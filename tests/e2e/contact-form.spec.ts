import { existsSync } from "node:fs";
import { DatabaseSync } from "node:sqlite";
import type { Page } from "@playwright/test";
import { expect, test } from "@playwright/test";

const ANY_VALUE = /.*/;
const LEAD_API = "**/api/lead";

interface SavedLead {
  email: string;
  message: string;
  type: string;
}

// The preview's SQLite file (playwright.config.ts). Every test uses an e-mail
// of its own, so the rows it finds are its own even when tests run at once.
function savedLeads(email: string): SavedLead[] {
  const path = process.env.E2E_LEADS_DB;
  if (!path) {
    throw new Error("E2E_LEADS_DB is not set (playwright.config.ts sets it)");
  }
  if (!existsSync(path)) {
    return [];
  }
  const db = new DatabaseSync(path, { readOnly: true });
  try {
    return db
      .prepare("SELECT email, type, message FROM leads WHERE email = ?")
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

test.describe("contact form", () => {
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

  test("valid submit saves the lead and shows the success card", async ({
    page,
  }) => {
    // No stub: the lead goes to the preview's /api/lead and its SQLite file.
    const email = uniqueEmail("success");
    const message = "Chciałbym wdrożyć agenta AI w firmie.";

    await stubUmami(page);
    await page.goto("/#contact");
    await page.waitForLoadState("networkidle");

    await page.fill('[data-contact-form] input[name="email"]', email);
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
      email,
      message,
      types: ["audit", "implementation"],
      website: "",
    });
    expect(savedLeads(email)).toEqual([
      { email, message, type: "audit,implementation" },
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
    expect(savedLeads(email)).toEqual([{ email, message, type: "other" }]);
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
      expect(savedLeads(email)).toEqual([{ email, message, type }]);
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
      { email, message, type: "audit,implementation,partner,other" },
    ]);
  });

  test("the project types are checkboxes a keyboard can tick, several at once", async ({
    page,
  }) => {
    await page.route(LEAD_API, (route) =>
      route.fulfill({ json: { ok: true }, status: 200 })
    );
    await page.goto("/#contact");
    await page.waitForLoadState("networkidle");

    const types = page.locator('[data-contact-form] input[name="type"]');
    await expect(types).toHaveCount(4);
    for (const type of await types.all()) {
      // biome-ignore lint/performance/noAwaitInLoops: one input at a time
      await expect(type).toHaveAttribute("type", "checkbox");
    }

    // Tab walks from the e-mail through every chip; Space ticks the one in
    // focus and leaves the others as they are.
    await page.locator('[data-contact-form] input[name="email"]').focus();
    await page.keyboard.type("klawiatura@example.com");
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
    expect((await sent).postDataJSON().types).toEqual(["audit", "partner"]);
  });

  test("the project chips are as high as the e-mail field and level with it", async ({
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
      expect(chip.y).toBe(field.y);
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
    await page.waitForLoadState("networkidle");

    await page.fill(
      '[data-contact-form] input[name="email"]',
      "kacper@example.com"
    );
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
      page.locator('[data-contact-form] textarea[name="message"]')
    ).toHaveValue("");
  });

  test("server failure shows the inline error banner", async ({ page }) => {
    await page.route(LEAD_API, (route) =>
      route.fulfill({ json: { error: "store" }, status: 500 })
    );

    await stubUmami(page);
    await page.goto("/#contact");
    await page.waitForLoadState("networkidle");

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
    await page.waitForLoadState("networkidle");

    const email = page.locator('[data-contact-form] input[name="email"]');
    const message = page.locator(
      '[data-contact-form] textarea[name="message"]'
    );
    const types = page.locator('[data-contact-form] input[name="type"]');
    const submit = page.locator("[data-contact-form] [data-submit]");
    await email.fill("kacper@example.com");
    await pickType(page, "implementation");
    await message.fill("Wysyłam i czekam");

    try {
      await submit.click();
      await expect(page.locator("[data-contact-wrap]")).toHaveAttribute(
        "data-state",
        "submitting"
      );
      await expect(email).toBeDisabled();
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
    await expect(message).toBeEnabled();
    await expect(submit).toBeEnabled();
    for (const type of await types.all()) {
      // biome-ignore lint/performance/noAwaitInLoops: one input at a time
      await expect(type).toBeEnabled();
    }
    await expect(email).toHaveValue("kacper@example.com");
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
    await page.waitForLoadState("networkidle");

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
