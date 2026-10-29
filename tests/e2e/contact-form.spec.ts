import { spawn } from "node:child_process";
import { once } from "node:events";
import { existsSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { DatabaseSync } from "node:sqlite";
import type { Page } from "@playwright/test";
import { expect, test } from "@playwright/test";

const ANY_VALUE = /.*/;
const LEAD_API = "**/api/lead";

interface SavedLead {
  company: string;
  email: string;
  message: string;
  type: string;
}

// The preview's SQLite file (playwright.config.ts). Every test uses an e-mail
// of its own, so the rows it finds are its own even when tests run at once.
// Tests that run at once also write at once: a read that comes while the
// server writes another test's lead waits for that write (the busy timeout
// the server's own connection has, src/lib/leads-db.ts) instead of failing
// with "database is locked".
function savedLeads(
  email: string,
  path = process.env.E2E_LEADS_DB
): SavedLead[] {
  if (!path) {
    throw new Error("E2E_LEADS_DB is not set (playwright.config.ts sets it)");
  }
  if (!existsSync(path)) {
    return [];
  }
  const db = new DatabaseSync(path, { readOnly: true });
  db.exec("PRAGMA busy_timeout = 5000");
  try {
    return db
      .prepare(
        "SELECT email, type, message, company FROM leads WHERE email = ?"
      )
      .all(email) as unknown as SavedLead[];
  } finally {
    db.close();
  }
}

const uniqueEmail = (name: string): string =>
  `${name}-${Date.now()}-${Math.random().toString(36).slice(2)}@example.com`;

interface TrackedEvent {
  data?: Record<string, unknown>;
  name: string;
}

// Stub window.umami before any page script runs and capture every
// track() call into window.__trackedEvents. Tests read it via
// readUmamiCalls() to assert on what was tracked.
async function stubUmami(page: Page): Promise<void> {
  await page.addInitScript(() => {
    const tracked: TrackedEvent[] = [];
    (window as unknown as { __trackedEvents: TrackedEvent[] }).__trackedEvents =
      tracked;
    window.umami = {
      track: (name: string, data?: Record<string, unknown>) => {
        tracked.push({ data, name });
      },
    };
  });
}

function readUmamiCalls(page: Page): Promise<TrackedEvent[]> {
  return page.evaluate(
    () =>
      (window as unknown as { __trackedEvents: TrackedEvent[] }).__trackedEvents
  );
}

// Only the named `form-*` events the form code emits. Excludes pageview
// pings from Umami auto-init and the astro:page-load handler so tests
// can assert on the form-specific tracking surface in isolation.
async function readFormEvents(page: Page): Promise<TrackedEvent[]> {
  const all = await readUmamiCalls(page);
  return all.filter(
    (e) => typeof e.name === "string" && e.name.startsWith("form-")
  );
}

// Picks a project type the way a visitor does: by clicking its visible
// label. The checkbox input is opacity 0 with pointer-events none, and
// check({ force: true }) on it clicks raw coordinates without waiting for
// the page to hold still. After goto("/#contact") the browser is still
// smooth-scrolling to the fragment (html has scroll-behavior: smooth), so
// that click landed on another field now and then. A label click waits
// until the label is stable.
async function pickType(page: Page, value: string): Promise<void> {
  const box = `input[name="type"][value="${value}"]`;
  await page
    .locator("[data-contact-form] label")
    .filter({ has: page.locator(box) })
    .click();
  await expect(page.locator(`[data-contact-form] ${box}`)).toBeChecked();
}

// WCAG contrast ratio of two "rgb(r, g, b)" colours.
function contrast(a: string, b: string): number {
  const luminance = (color: string): number => {
    const [r, g, bl] = (color.match(/\d+(\.\d+)?/g) ?? []).map((part) => {
      const c = Number(part) / 255;
      return c <= 0.039_28 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * (r ?? 0) + 0.7152 * (g ?? 0) + 0.0722 * (bl ?? 0);
  };
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return ((hi ?? 0) + 0.05) / ((lo ?? 0) + 0.05);
}

// A test opens the form with goto("/#contact") alone: goto waits for the load
// event, and the form's script (a module script) runs before it. No test
// waits for "networkidle": on the preview build the page loads Umami when the
// browser is idle, so the idle network came after that request, or before it
// when the machine was busy enough to delay the idle callback. The request
// used to go to analytics.kacperadler.pl, and a slow answer ran the wait into
// the 30 s test timeout; the e2e browser now cannot resolve that host
// (playwright.config.ts), but the wait still depends on the idle callback.
test.describe("contact form", () => {
  test('the company label reads "Firma", then a smaller, dimmer "(opcjonalnie)" still at 4.5:1', async ({
    page,
  }) => {
    await page.setViewportSize({ height: 844, width: 390 });
    await page.goto("/#contact");

    const input = page.locator('[data-contact-form] input[name="company"]');
    await expect(input).toHaveAccessibleName("Firma (opcjonalnie)");
    const label = page.locator(
      '[data-contact-form] label[for="contact-company"]'
    );
    const hint = label.locator(".mb-field-optional");
    await expect(hint).toHaveText("(opcjonalnie)");

    // The sheet lights up under the pointer, so the hint is read on the
    // lit panel too, the lighter of its two grounds.
    await page.locator("[data-contact-wrap]").hover();
    const look = await label.evaluate((el) => {
      const hintEl = el.querySelector(".mb-field-optional") as HTMLElement;
      const sheet = el.closest("[data-contact-wrap]") as HTMLElement;
      const style = (node: Element) => getComputedStyle(node);
      return {
        ground: style(sheet).backgroundColor,
        hintColor: style(hintEl).color,
        hintSize: Number.parseFloat(style(hintEl).fontSize),
        labelColor: style(el).color,
        labelSize: Number.parseFloat(style(el).fontSize),
      };
    });
    expect(look.hintSize).toBeLessThan(look.labelSize);
    expect(contrast(look.hintColor, look.ground)).toBeLessThan(
      contrast(look.labelColor, look.ground)
    );
    expect(contrast(look.hintColor, look.ground)).toBeGreaterThanOrEqual(4.5);
  });

  test("empty submit marks all fields invalid", async ({ page }) => {
    await stubUmami(page);
    await page.goto("/#contact");

    await page.click("[data-contact-form] [data-submit]");

    await expect(
      page.locator('[data-contact-form] [data-field="email"]')
    ).toHaveAttribute("data-invalid", "true");
    await expect(
      page.locator('[data-contact-form] [data-field="type"]')
    ).toHaveAttribute("data-invalid", "true");
    await expect(
      page.locator('[data-contact-form] [data-field="message"]')
    ).toHaveAttribute("data-invalid", "true");
    // The company is optional: an empty one is never flagged.
    await expect(
      page.locator('[data-contact-form] [data-field="company"]')
    ).not.toHaveAttribute("data-invalid", ANY_VALUE);

    // Wrapper enters validation-error so the form stays visible and
    // the inline field errors do the talking; the submit-error banner
    // must NOT appear for client-side validation failures.
    await expect(page.locator("[data-contact-wrap]")).toHaveAttribute(
      "data-state",
      "error-validation"
    );
    await expect(
      page.locator("[data-contact-form] [data-submit]")
    ).toHaveAttribute("data-state", "error");
    await expect(
      page.locator("[data-contact-form] [data-form-error]")
    ).toBeHidden();

    // Validation errors are silent - we don't want form-* noise in
    // Umami every time someone clicks submit on an empty form.
    expect(await readFormEvents(page)).toEqual([]);
  });

  test("invalid email is flagged, valid email clears on input", async ({
    page,
  }) => {
    await page.goto("/#contact");

    await page.fill('[data-contact-form] input[name="email"]', "not-an-email");
    await pickType(page, "implementation");
    await page.fill(
      '[data-contact-form] textarea[name="message"]',
      "Test message"
    );

    await page.click("[data-contact-form] [data-submit]");
    await expect(
      page.locator('[data-contact-form] [data-field="email"]')
    ).toHaveAttribute("data-invalid", "true");

    await page.fill(
      '[data-contact-form] input[name="email"]',
      "kacper@example.com"
    );
    await expect(
      page.locator('[data-contact-form] [data-field="email"]')
    ).not.toHaveAttribute("data-invalid", ANY_VALUE);
  });

  test("a company name over 200 characters is flagged and nothing is sent; editing it clears the mark", async ({
    page,
  }) => {
    let sent = 0;
    await page.route(LEAD_API, (route) => {
      sent += 1;
      return route.fulfill({ json: { ok: true }, status: 200 });
    });
    await page.goto("/#contact");

    const company = page.locator('[data-contact-form] [data-field="company"]');
    await page.fill(
      '[data-contact-form] input[name="email"]',
      "kacper@example.com"
    );
    await page.fill(
      '[data-contact-form] input[name="company"]',
      "F".repeat(201)
    );
    await pickType(page, "audit");
    await page.fill('[data-contact-form] textarea[name="message"]', "Treść");

    await page.click("[data-contact-form] [data-submit]");
    await expect(company).toHaveAttribute("data-invalid", "true");
    await expect(company.locator(".mb-field-error")).toBeVisible();
    await expect(page.locator("[data-contact-wrap]")).toHaveAttribute(
      "data-state",
      "error-validation"
    );
    for (const name of ["email", "type", "message"]) {
      // biome-ignore lint/performance/noAwaitInLoops: one field at a time
      await expect(
        page.locator(`[data-contact-form] [data-field="${name}"]`)
      ).not.toHaveAttribute("data-invalid", ANY_VALUE);
    }
    expect(sent).toBe(0);

    await page.fill(
      '[data-contact-form] input[name="company"]',
      "F".repeat(200)
    );
    await expect(company).not.toHaveAttribute("data-invalid", ANY_VALUE);
  });

  test("valid submit saves the lead and shows the success card", async ({
    page,
  }) => {
    // No stub: the lead goes to the preview's /api/lead and its SQLite file.
    const email = uniqueEmail("success");
    const message = "Chciałbym wdrożyć agenta AI w firmie.";
    const company = "Kowalski sp. z o.o.";

    await stubUmami(page);
    await page.goto("/#contact");

    await page.fill('[data-contact-form] input[name="email"]', email);
    await page.fill(
      '[data-contact-form] input[name="company"]',
      ` ${company} `
    );
    await pickType(page, "implementation");
    await pickType(page, "audit");
    await page.fill('[data-contact-form] textarea[name="message"]', message);

    const sheet = page.locator("[data-contact-wrap]");
    const heightBefore = (await sheet.boundingBox())?.height;
    const sent = page.waitForRequest(LEAD_API);
    await page.click("[data-contact-form] [data-submit]");
    const request = await sent;

    // Wrapper flips to success → form node is hidden, success card
    // (with its reset button) takes over in the same space: the sheet keeps
    // its height, so the page does not jump.
    await expect(sheet).toHaveAttribute("data-state", "success");
    await expect(page.locator("[data-contact-form]")).toBeHidden();
    await expect(page.locator("[data-form-success]")).toBeVisible();
    await expect(page.locator("[data-form-reset]")).toBeVisible();
    expect((await sheet.boundingBox())?.height).toBe(heightBefore);

    // Umami event fires on success with the project types (in the form's
    // order, whatever order they were ticked in) so the dashboard can break
    // submissions down by category.
    expect(await readFormEvents(page)).toEqual([
      { data: { type: "audit,implementation" }, name: "form-submit" },
    ]);

    expect(request.method()).toBe("POST");
    expect(request.headers()["content-type"]).toBe("application/json");
    expect(request.postDataJSON()).toEqual({
      company,
      email,
      message,
      types: ["audit", "implementation"],
      website: "",
    });
    expect(savedLeads(email)).toEqual([
      { company, email, message, type: "audit,implementation" },
    ]);
  });

  test("the message box grows with the text from 5 to 14 lines, the sheet with it, and once sent the sheet is back to the empty form's height without moving the page", async ({
    page,
  }) => {
    await page.route(LEAD_API, (route) =>
      route.fulfill({ json: { ok: true }, status: 200 })
    );
    await page.goto("/#contact");

    const box = page.locator('[data-contact-form] textarea[name="message"]');
    const sheet = page.locator("[data-contact-wrap]");
    const measure = () =>
      box.evaluate((el) => ({
        clientHeight: el.clientHeight,
        height: el.getBoundingClientRect().height,
        lineHeight: Number.parseFloat(getComputedStyle(el).lineHeight),
        scrollHeight: el.scrollHeight,
      }));
    const lines = (count: number): string =>
      Array.from({ length: count }, (_, i) => `Linia ${i + 1}`).join("\n");
    const sheetHeight = async (): Promise<number> =>
      (await sheet.boundingBox())?.height ?? 0;

    // No drag handle: a dragged height would stop the box from growing.
    await expect(box).toHaveCSS("resize", "none");

    // Empty, it stands 5 lines high (padding and border included).
    const empty = await measure();
    expect(empty.height).toBeCloseTo(5 * empty.lineHeight, 0);
    const sheetEmpty = await sheetHeight();

    // Eight lines: the box grows to show them all, nothing scrolls inside,
    // and the sheet grows by as much.
    await box.fill(lines(8));
    const eight = await measure();
    expect(eight.height).toBeGreaterThan(empty.height + 3 * empty.lineHeight);
    expect(eight.scrollHeight).toBeLessThanOrEqual(eight.clientHeight);
    expect(await sheetHeight()).toBeCloseTo(
      sheetEmpty + eight.height - empty.height,
      0
    );

    // Thirty lines: the box stops at 14 lines and scrolls the rest.
    await box.fill(lines(30));
    const thirty = await measure();
    expect(thirty.height).toBeCloseTo(14 * empty.lineHeight, 0);
    expect(thirty.scrollHeight).toBeGreaterThan(thirty.clientHeight);

    // Sent with the tall box: the success card does not fill a tall, empty
    // sheet. The sheet is back to the empty form's height, and it gets
    // shorter only at its bottom: its top stays where the visitor saw it and,
    // with the card's heading in view, the page does not scroll, even with
    // the card's bottom below the viewport.
    await page.fill('[data-contact-form] input[name="email"]', "a@example.com");
    await pickType(page, "audit");
    // The sheet's top 300px down; sent with Enter from the e-mail field,
    // since a click would scroll to the button below the fold.
    await sheet.evaluate((el) =>
      window.scrollBy({
        behavior: "instant",
        top: el.getBoundingClientRect().top - 300,
      })
    );
    const where = () =>
      page.evaluate(() => ({
        scrollY: window.scrollY,
        top: document
          .querySelector("[data-contact-wrap]")
          ?.getBoundingClientRect().top,
      }));
    // goto("/#contact") may still be smooth-scrolling: wait for it to settle.
    let before = await where();
    await expect
      .poll(async () => {
        const now = await where();
        const settled = now.scrollY === before.scrollY;
        before = now;
        return settled;
      })
      .toBe(true);
    expect(await sheetHeight()).toBeGreaterThan(
      sheetEmpty + 8 * empty.lineHeight
    );
    await page
      .locator('[data-contact-form] input[name="email"]')
      .evaluate((el: HTMLInputElement) => el.focus({ preventScroll: true }));
    await page.keyboard.press("Enter");
    await expect(sheet).toHaveAttribute("data-state", "success");
    expect(await sheetHeight()).toBeCloseTo(sheetEmpty, 0);
    // A scroll would be smooth: give it time to move the page first.
    await page.waitForTimeout(500);
    expect(await where()).toEqual(before);
    await expect(page.locator("[data-form-success]")).toBeFocused();
    const card = await page.locator("[data-form-success]").boundingBox();
    expect((card?.y ?? 0) + (card?.height ?? 0)).toBeGreaterThan(
      page.viewportSize()?.height ?? 0
    );
    // The card still fills the sheet: the hidden form is as high as the card.
    const formHeight = await page
      .locator("[data-contact-form]")
      .evaluate((el) => el.getBoundingClientRect().height);
    expect(
      (await page.locator("[data-form-success]").boundingBox())?.height
    ).toBe(formHeight);
  });

  // Fills a 30-line message, scrolls so the top of `from` (the submit button
  // or the e-mail field) sits `at` px down the viewport (when negative, its
  // bottom that far up from the viewport's bottom) and sends: a click on the
  // button, Enter in the field.
  async function sendLong(
    page: Page,
    from: "email" | "submit",
    at: number
  ): Promise<void> {
    await page.route(LEAD_API, (route) =>
      route.fulfill({ json: { ok: true }, status: 200 })
    );
    await page.goto("/#contact");
    const email = page.locator('[data-contact-form] input[name="email"]');
    await email.fill("a@example.com");
    await pickType(page, "audit");
    await page.fill(
      '[data-contact-form] textarea[name="message"]',
      Array.from({ length: 30 }, (_, i) => `Linia ${i + 1}`).join("\n")
    );
    const submit = page.locator("[data-contact-form] [data-submit]");
    const anchor = from === "email" ? email : submit;
    await anchor.evaluate((el, y) => {
      const rect = el.getBoundingClientRect();
      const top = y < 0 ? window.innerHeight + y - rect.height : y;
      window.scrollBy({ behavior: "instant", top: rect.top - top });
    }, at);
    if (from === "email") {
      await email.evaluate((el: HTMLInputElement) =>
        el.focus({ preventScroll: true })
      );
      await page.keyboard.press("Enter");
    } else {
      await submit.click();
    }
    await expect(page.locator("[data-contact-wrap]")).toHaveAttribute(
      "data-state",
      "success"
    );
  }

  // Where the success card and its heading stand, against the band of the
  // viewport under the sticky header (html's scroll-padding-block-start).
  function successView(page: Page) {
    return page.evaluate(() => {
      const card = document.querySelector("[data-form-success]");
      const heading = card?.querySelector("h3");
      const c = card?.getBoundingClientRect();
      const h = heading?.getBoundingClientRect();
      return {
        bandBottom: document.documentElement.clientHeight,
        bandTop: Number.parseFloat(
          getComputedStyle(document.documentElement).scrollPaddingBlockStart
        ),
        cardBottom: c?.bottom ?? Number.NaN,
        cardTop: c?.top ?? Number.NaN,
        headingBottom: h?.bottom ?? Number.NaN,
        headingTop: h?.top ?? Number.NaN,
      };
    });
  }

  // The sheet's top stays put and the card is centred in it, so after a send
  // from low down a long form its heading would sit above the viewport, or
  // behind the sticky header.
  for (const { heading, submitTop } of [
    { heading: "above the viewport", submitTop: 361 },
    { heading: "under the header", submitTop: 464 },
  ]) {
    test(`with the success heading ${heading}, the card scrolls in whole under the header and takes focus`, async ({
      page,
    }) => {
      await page.setViewportSize({ height: 720, width: 1280 });
      await sendLong(page, "submit", submitTop);

      await expect(page.locator("[data-form-success]")).toBeFocused();
      // The page scrolls (smoothly) as little as it takes: the card's top
      // lands under the header, the whole card on screen.
      await expect
        .poll(async () => {
          const view = await successView(page);
          return Math.abs(Math.round(view.cardTop - view.bandTop));
        })
        .toBe(0);
      const view = await successView(page);
      expect(view.cardBottom).toBeLessThanOrEqual(view.bandBottom);
    });
  }

  test("sent with Enter from the e-mail field at the viewport's bottom, the success card scrolls up whole and takes focus", async ({
    page,
  }) => {
    // The card's heading lands below the viewport.
    await page.setViewportSize({ height: 720, width: 1280 });
    await sendLong(page, "email", -1);

    await expect(page.locator("[data-form-success]")).toBeFocused();
    await expect
      .poll(async () => {
        const view = await successView(page);
        return Math.abs(Math.round(view.cardBottom - view.bandBottom));
      })
      .toBe(0);
    const view = await successView(page);
    expect(view.cardTop).toBeGreaterThanOrEqual(view.bandTop);
  });

  test("a success card taller than the viewport under the header brings its heading to the middle", async ({
    page,
  }) => {
    // Scrolled "nearest", a card this tall would line its bottom up with the
    // viewport's and leave its heading behind the header.
    await page.setViewportSize({ height: 400, width: 390 });
    await sendLong(page, "submit", -1);

    await expect(page.locator("[data-form-success]")).toBeFocused();
    await expect
      .poll(async () => {
        const view = await successView(page);
        return Math.abs(
          Math.round(
            (view.headingTop + view.headingBottom) / 2 -
              (view.bandTop + view.bandBottom) / 2
          )
        );
      })
      .toBe(0);
    const view = await successView(page);
    expect(view.cardBottom - view.cardTop).toBeGreaterThan(
      view.bandBottom - view.bandTop
    );
  });

  test("a lead sent with the company left empty is saved without one", async ({
    page,
  }) => {
    const email = uniqueEmail("no-company");
    await page.goto("/#contact");

    await page.fill('[data-contact-form] input[name="email"]', email);
    await pickType(page, "other");
    await page.fill('[data-contact-form] textarea[name="message"]', "Treść");
    const sent = page.waitForRequest(LEAD_API);
    await page.click("[data-contact-form] [data-submit]");

    expect((await sent).postDataJSON().company).toBe("");
    await expect(page.locator("[data-contact-wrap]")).toHaveAttribute(
      "data-state",
      "success"
    );
    expect(savedLeads(email)).toEqual([
      { company: "", email, message: "Treść", type: "other" },
    ]);
  });

  for (const { name, lead } of [
    {
      lead: { email: "not-an-email", message: "Treść", types: ["audit"] },
      name: "a bad e-mail",
    },
    {
      lead: { email: "", message: "Treść", types: ["crm"] },
      name: "an unknown project type",
    },
    {
      lead: { email: "", message: "Treść", types: ["audit", "crm"] },
      name: "a known type beside an unknown one",
    },
    {
      lead: { email: "", message: "Treść", types: [] },
      name: "no project type",
    },
    {
      lead: { email: "", message: "Treść", types: ["audit", "audit"] },
      name: "a project type twice",
    },
    {
      lead: { email: "", message: "Treść", types: "audit" },
      name: "types as a string, not a list",
    },
    {
      lead: { email: "", message: "Treść", type: "audit" },
      name: "the old single `type` field",
    },
    // The types before KA0075: rows saved with them stay in the table, but
    // a new lead cannot use them.
    ...["ai", "webapp", "landing", "mobile", "tool"].map((type) => ({
      lead: { email: "", message: "Treść", types: [type] },
      name: `the retired project type "${type}"`,
    })),
    {
      lead: { email: "", message: "x".repeat(5001), types: ["audit"] },
      name: "a message over 5000 characters",
    },
    {
      lead: { email: "", message: "   ", types: ["audit"] },
      name: "a blank message",
    },
    {
      lead: {
        company: "F".repeat(201),
        email: "",
        message: "Treść",
        types: ["audit"],
      },
      name: "a company over 200 characters",
    },
  ]) {
    test(`the server turns away ${name} with 400 and saves nothing`, async ({
      request,
    }) => {
      const email = lead.email || uniqueEmail("invalid");
      const res = await request.post("/api/lead", {
        data: { ...lead, email, website: "" },
      });
      expect(res.status()).toBe(400);
      expect(savedLeads(email)).toEqual([]);
    });
  }

  test("the server takes a message of exactly 5000 characters", async ({
    request,
  }) => {
    const email = uniqueEmail("limit");
    const message = "x".repeat(5000);
    const res = await request.post("/api/lead", {
      data: { email, message, types: ["other"], website: "" },
    });
    expect(res.status()).toBe(200);
    expect(savedLeads(email)).toEqual([
      { company: "", email, message, type: "other" },
    ]);
  });

  test("the server takes a company of exactly 200 characters", async ({
    request,
  }) => {
    const email = uniqueEmail("company-limit");
    const company = "F".repeat(200);
    const res = await request.post("/api/lead", {
      data: { company, email, message: "Treść", types: ["other"], website: "" },
    });
    expect(res.status()).toBe(200);
    expect(savedLeads(email)).toEqual([
      { company, email, message: "Treść", type: "other" },
    ]);
  });

  test("the server answers a filled honeypot with 200 and saves nothing", async ({
    request,
  }) => {
    const email = uniqueEmail("bot");
    const res = await request.post("/api/lead", {
      data: {
        email,
        message: "Buy our SEO services!",
        types: ["other"],
        website: "http://spam.example",
      },
    });
    expect(res.status()).toBe(200);
    expect(savedLeads(email)).toEqual([]);
  });

  for (const type of ["audit", "implementation", "partner", "other"]) {
    test(`the server saves a lead of type "${type}"`, async ({ request }) => {
      const email = uniqueEmail(`type-${type}`);
      const message = "Chcemy przestać przepisywać faktury.";
      const res = await request.post("/api/lead", {
        data: { email, message, types: [type], website: "" },
      });
      expect(res.status()).toBe(200);
      expect(savedLeads(email)).toEqual([
        { company: "", email, message, type },
      ]);
    });
  }

  test("the server saves every chosen type, in the form's order", async ({
    request,
  }) => {
    const email = uniqueEmail("types");
    const message = "Audyt, potem wdrożenie i opieka.";
    const res = await request.post("/api/lead", {
      data: {
        email,
        message,
        types: ["partner", "audit", "implementation", "other"],
        website: "",
      },
    });
    expect(res.status()).toBe(200);
    expect(savedLeads(email)).toEqual([
      {
        company: "",
        email,
        message,
        type: "audit,implementation,partner,other",
      },
    ]);
  });

  // Under several workers a test read the store while the server wrote
  // another test's lead, and failed with "database is locked". Here another
  // process holds the write lock for half a second: the read waits for it and
  // finds the lead written under it.
  test("reading the lead store waits for a lead being written", async () => {
    const path = join(
      mkdtempSync(join(tmpdir(), "kacperadler-leads-lock-")),
      "leads.sqlite"
    );
    const email = uniqueEmail("locked");
    const writer = spawn(
      process.execPath,
      [
        "-e",
        `const { DatabaseSync } = require("node:sqlite");
        const db = new DatabaseSync(process.argv[1]);
        db.exec("CREATE TABLE leads (email TEXT, type TEXT, message TEXT, company TEXT)");
        db.exec("BEGIN EXCLUSIVE");
        db.prepare("INSERT INTO leads VALUES (?, 'other', 'Treść', '')").run(process.argv[2]);
        process.stdout.write("locked");
        setTimeout(() => db.exec("COMMIT"), 500);`,
        path,
        email,
      ],
      { stdio: ["ignore", "pipe", "inherit"] }
    );
    const exited = once(writer, "exit");
    await once(writer.stdout, "data");

    expect(savedLeads(email, path)).toEqual([
      { company: "", email, message: "Treść", type: "other" },
    ]);
    expect(await exited).toEqual([0, null]);
  });

  test("the project types are checkboxes a keyboard can tick, several at once", async ({
    page,
  }) => {
    await page.route(LEAD_API, (route) =>
      route.fulfill({ json: { ok: true }, status: 200 })
    );
    await page.goto("/#contact");

    const types = page.locator('[data-contact-form] input[name="type"]');
    await expect(types).toHaveCount(4);
    for (const type of await types.all()) {
      // biome-ignore lint/performance/noAwaitInLoops: one input at a time
      await expect(type).toHaveAttribute("type", "checkbox");
    }

    // Tab walks from the e-mail through the company to every chip; Space
    // ticks the one in focus and leaves the others as they are.
    await page.locator('[data-contact-form] input[name="email"]').focus();
    await page.keyboard.type("klawiatura@example.com");
    await page.keyboard.press("Tab");
    await expect(
      page.locator('[data-contact-form] input[name="company"]')
    ).toBeFocused();
    await page.keyboard.type("Klawiatura S.A.");
    await page.keyboard.press("Tab");
    await expect(types.nth(0)).toBeFocused();
    await page.keyboard.press("Space");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await expect(types.nth(2)).toBeFocused();
    await page.keyboard.press("Space");
    await expect(types.nth(0)).toBeChecked();
    await expect(types.nth(1)).not.toBeChecked();
    await expect(types.nth(2)).toBeChecked();
    // The focused chip shows the ring.
    await expect(
      page.locator("[data-contact-form] .mb-choice-label").nth(2)
    ).toHaveCSS("outline-style", "solid");

    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await expect(
      page.locator('[data-contact-form] textarea[name="message"]')
    ).toBeFocused();
    await page.keyboard.type("Wpisane z klawiatury.");

    const sent = page.waitForRequest(LEAD_API);
    await page.keyboard.press("Tab");
    await page.keyboard.press("Enter");
    const body = (await sent).postDataJSON();
    expect(body.types).toEqual(["audit", "partner"]);
    expect(body.company).toBe("Klawiatura S.A.");
  });

  test("the project chips are as high as the e-mail field and sit in one row", async ({
    page,
  }) => {
    await page.setViewportSize({ height: 900, width: 1440 });
    await page.goto("/#contact");
    // One read of every box, so the smooth scroll to #contact cannot move
    // the page between the field and the chips.
    const { chips, field } = await page
      .locator("[data-contact-form]")
      .evaluate((form) => ({
        chips: [...form.querySelectorAll(".mb-choice-label")].map(
          (el) => el.getBoundingClientRect().toJSON() as DOMRect
        ),
        field: (form.querySelector('input[name="email"]') as HTMLElement)
          .getBoundingClientRect()
          .toJSON() as DOMRect,
      }));
    expect(chips).toHaveLength(4);
    for (const chip of chips) {
      expect(chip.height).toBe(field.height);
      expect(chip.y).toBe((chips[0] as DOMRect).y);
    }
  });

  test("the four project types are offered, Audyt AI first, and none overflows on mobile", async ({
    page,
  }) => {
    await page.setViewportSize({ height: 844, width: 390 });
    await page.goto("/#contact");

    const group = page.locator("[data-contact-form] fieldset.mb-choices");
    const labels = group.locator("label");
    await expect(labels).toHaveText([
      "Audyt AI",
      "Wdrożenie",
      "Stała współpraca",
      "Inne",
    ]);
    expect(
      await labels
        .locator("input")
        .evaluateAll((inputs) =>
          inputs.map((input) => (input as HTMLInputElement).value)
        )
    ).toEqual(["audit", "implementation", "partner", "other"]);

    // Every option stays inside the group (none pushed past its right
    // edge), and the page does not scroll sideways.
    const groupBox = await group.boundingBox();
    const boxes = await labels.evaluateAll((els) =>
      els.map((el) => el.getBoundingClientRect().toJSON() as DOMRect)
    );
    if (!groupBox) {
      throw new Error("project type group is not rendered");
    }
    for (const box of boxes) {
      expect(box.right).toBeLessThanOrEqual(groupBox.x + groupBox.width + 1);
    }
    expect(
      await page.evaluate(
        () =>
          document.documentElement.scrollWidth <=
          document.documentElement.clientWidth
      )
    ).toBe(true);
  });

  test("reset button on success card brings the form back empty", async ({
    page,
  }) => {
    await page.route(LEAD_API, (route) =>
      route.fulfill({ json: { ok: true }, status: 200 })
    );

    await page.goto("/#contact");

    await page.fill(
      '[data-contact-form] input[name="email"]',
      "kacper@example.com"
    );
    await page.fill('[data-contact-form] input[name="company"]', "Firma");
    await pickType(page, "implementation");
    await page.fill(
      '[data-contact-form] textarea[name="message"]',
      "Pierwsza wiadomość"
    );

    await page.click("[data-contact-form] [data-submit]");
    await expect(page.locator("[data-form-success]")).toBeVisible();

    await page.click("[data-form-reset]");

    // Wrapper back to idle, form visible again, fields cleared so the
    // user can compose a fresh message.
    await expect(page.locator("[data-contact-wrap]")).toHaveAttribute(
      "data-state",
      "idle"
    );
    await expect(page.locator("[data-contact-form]")).toBeVisible();
    await expect(page.locator("[data-form-success]")).toBeHidden();
    await expect(
      page.locator('[data-contact-form] input[name="email"]')
    ).toHaveValue("");
    await expect(
      page.locator('[data-contact-form] input[name="company"]')
    ).toHaveValue("");
    await expect(
      page.locator('[data-contact-form] textarea[name="message"]')
    ).toHaveValue("");
  });

  test("server failure shows the inline error banner", async ({ page }) => {
    await page.route(LEAD_API, (route) =>
      route.fulfill({ json: { error: "store" }, status: 500 })
    );

    await stubUmami(page);
    await page.goto("/#contact");

    await page.fill(
      '[data-contact-form] input[name="email"]',
      "kacper@example.com"
    );
    await pickType(page, "implementation");
    await page.fill(
      '[data-contact-form] textarea[name="message"]',
      "Server is down"
    );

    await page.click("[data-contact-form] [data-submit]");

    // Form stays visible (so the user keeps what they wrote), the
    // banner appears, and the success card is NOT shown.
    await expect(page.locator("[data-contact-wrap]")).toHaveAttribute(
      "data-state",
      "error-submit"
    );
    await expect(page.locator("[data-contact-form]")).toBeVisible();
    await expect(
      page.locator("[data-contact-form] [data-form-error]")
    ).toBeVisible();
    await expect(page.locator("[data-form-success]")).toBeHidden();
    // Field values must survive the failure - the user gets to retry
    // without retyping.
    await expect(
      page.locator('[data-contact-form] input[name="email"]')
    ).toHaveValue("kacper@example.com");

    // form-error event fires too, so the Umami dashboard surfaces
    // upstream failures as a separate signal from successful submits.
    expect(await readFormEvents(page)).toEqual([
      { data: { type: "implementation" }, name: "form-error" },
    ]);
  });

  test("nothing in the form can be edited while it sends, and all of it comes back after", async ({
    page,
  }) => {
    // Hold the lead request until the disabled form has been checked.
    const { promise: held, resolve: release } = Promise.withResolvers<void>();
    await page.route(LEAD_API, async (route) => {
      await held;
      await route.fulfill({
        body: JSON.stringify({ error: "store" }),
        contentType: "application/json",
        status: 500,
      });
    });

    await page.goto("/#contact");

    const email = page.locator('[data-contact-form] input[name="email"]');
    const company = page.locator('[data-contact-form] input[name="company"]');
    const message = page.locator(
      '[data-contact-form] textarea[name="message"]'
    );
    const types = page.locator('[data-contact-form] input[name="type"]');
    const submit = page.locator("[data-contact-form] [data-submit]");
    await email.fill("kacper@example.com");
    await company.fill("Firma");
    await pickType(page, "implementation");
    await message.fill("Wysyłam i czekam");

    try {
      await submit.click();
      await expect(page.locator("[data-contact-wrap]")).toHaveAttribute(
        "data-state",
        "submitting"
      );
      await expect(email).toBeDisabled();
      await expect(company).toBeDisabled();
      await expect(message).toBeDisabled();
      await expect(submit).toBeDisabled();
      expect(await types.count()).toBe(4);
      for (const type of await types.all()) {
        // biome-ignore lint/performance/noAwaitInLoops: one input at a time
        await expect(type).toBeDisabled();
      }
      // The disabled look: fields on the flat panel, the chosen type a
      // muted block.
      await expect(email).toHaveCSS("background-color", "rgb(20, 23, 28)");
      await expect(message).toHaveCSS("background-color", "rgb(20, 23, 28)");
      await expect(
        page
          .locator("[data-contact-form] label", {
            has: page.locator('input[value="implementation"]'),
          })
          .locator(".mb-choice-label")
      ).toHaveCSS("background-color", "rgb(157, 156, 149)");
    } finally {
      release();
    }

    await expect(page.locator("[data-contact-wrap]")).toHaveAttribute(
      "data-state",
      "error-submit"
    );
    await expect(email).toBeEnabled();
    await expect(company).toBeEnabled();
    await expect(message).toBeEnabled();
    await expect(submit).toBeEnabled();
    for (const type of await types.all()) {
      // biome-ignore lint/performance/noAwaitInLoops: one input at a time
      await expect(type).toBeEnabled();
    }
    await expect(email).toHaveValue("kacper@example.com");
    await expect(company).toHaveValue("Firma");
    await expect(message).toHaveValue("Wysyłam i czekam");
    await expect(
      page.locator('[data-contact-form] input[value="implementation"]')
    ).toBeChecked();
  });

  test("honeypot fill silently drops the request and shows success", async ({
    page,
  }) => {
    let leadSent = false;
    await page.route(LEAD_API, async (route) => {
      leadSent = true;
      await route.fulfill({ json: { ok: true }, status: 200 });
    });

    await stubUmami(page);
    await page.goto("/#contact");

    await page.fill(
      '[data-contact-form] input[name="email"]',
      "bot@example.com"
    );
    await pickType(page, "other");
    await page.fill(
      '[data-contact-form] textarea[name="message"]',
      "Buy our SEO services!"
    );
    // The bot tells on itself by filling the off-screen honeypot.
    await page
      .locator('[data-contact-form] input[name="website"]')
      .fill("http://spam.example", { force: true });

    await page.click("[data-contact-form] [data-submit]");

    // Bot sees the same success view a human would.
    await expect(page.locator("[data-contact-wrap]")).toHaveAttribute(
      "data-state",
      "success"
    );

    // The submit handler must short-circuit before fetch - otherwise
    // bots learn that filling the honeypot still works.
    expect(leadSent).toBe(false);

    // form-honeypot event lets the Umami dashboard show how much bot
    // traffic is hitting the form without inflating form-submit.
    expect(await readFormEvents(page)).toEqual([{ name: "form-honeypot" }]);
  });
});
