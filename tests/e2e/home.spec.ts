import { expect, type Locator, type Page, test } from "@playwright/test";
import sharp from "sharp";

// The home page per the brief (KA0075): its sections in order, the menu, the
// offer, the meta, and none of the copy the brief removed.

const SECTIONS = [
  "top",
  "trust",
  "problems",
  "examples",
  "services",
  "cases",
  "how",
  "about",
  "faq",
  "contact",
];
const SECTION_LABELS = [
  "Problem",
  "Możliwości",
  "Oferta",
  "Realizacje",
  "Proces",
  "O mnie",
  "FAQ",
  "Kontakt",
];
const NAV_LABELS = ["Oferta", "Realizacje", "Proces", "O mnie", "FAQ"];
const TITLE = "Wdrożenia AI i automatyzacje dla firm | Kacper Adler";
const DESCRIPTION =
  "Automatyzuję ręczną pracę w firmach: agenci AI, integracje i aplikacje szyte na miarę. Audyt, wdrożenie i stała opieka, bez zatrudniania działu IT.";
const REMOVED = [
  "Wizytówki",
  "Buduję interfejsy",
  "Inżynier oprogramowania",
  "Frontend dev w ReX",
  "React Native · TypeScript · Astro",
];
const OFFER_SECTION = /^## Oferta$([\s\S]*?)^## /m;
const LLMS_ITEM = /^- \*\*(.+?)\*\* \(/gm;
const LLMS_FULL_ITEM = /^### \d{2}\. (.+)$/gm;
const BRACKETED = /\[[^\]]*\]/;
const LLMS_HEAD =
  /^# Kacper Adler - AI Engineer · Partner technologiczny\n\n> Wdrożenia AI i automatyzacje dla firm\. /;
// Sub-pixel rounding plus the 1px rule two neighbouring cells share.
const TOLERANCE = 2;
// Brighter than this is a rule (ink on the dark ground), not the ground.
const INK_LUMA = 100;
// A frame lights its whole edge; rules that only end at it light a few px.
const FRAME_SHARE = 0.05;

async function box(locator: Locator) {
  const rect = await locator.boundingBox();
  if (!rect) {
    throw new Error("the element is not rendered");
  }
  return rect;
}

// The share of ink pixels along each edge of the element's box, one pixel
// inside it, from a screenshot of the page.
async function inkOnEdges(page: Page, locator: Locator) {
  const rect = await box(locator);
  const clip = {
    height: Math.floor(rect.y + rect.height) - Math.ceil(rect.y),
    width: Math.floor(rect.x + rect.width) - Math.ceil(rect.x),
    x: Math.ceil(rect.x),
    y: Math.ceil(rect.y),
  };
  const { data, info } = await sharp(await page.screenshot({ clip }))
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const ink = (x: number, y: number) => {
    const i = (y * info.width + x) * info.channels;
    const luma =
      0.2126 * (data[i] ?? 0) +
      0.7152 * (data[i + 1] ?? 0) +
      0.0722 * (data[i + 2] ?? 0);
    return luma > INK_LUMA;
  };
  const share = (points: [number, number][]) =>
    points.filter(([x, y]) => ink(x, y)).length / points.length;
  const xs = Array.from({ length: info.width }, (_, x) => x);
  const ys = Array.from({ length: info.height }, (_, y) => y);
  return {
    bottom: share(xs.map((x) => [x, info.height - 1])),
    left: share(ys.map((y) => [0, y])),
    right: share(ys.map((y) => [info.width - 1, y])),
    top: share(xs.map((x) => [x, 0])),
  };
}

test.describe("home page", () => {
  test("the sections run in the brief's order between the header and the footer", async ({
    page,
  }) => {
    await page.goto("/");

    expect(
      await page
        .locator("main section[id]")
        .evaluateAll((sections) => sections.map((s) => s.id))
    ).toEqual(SECTIONS);
    await expect(page.locator("main .mb-section-label")).toHaveText(
      SECTION_LABELS
    );

    // Header before main; the footer, then the EFS+ band, after it
    // (querySelectorAll returns document order).
    expect(
      await page
        .locator("[data-nav-wrap], main, footer.mb-footer, aside.eu-funding")
        .evaluateAll((els) =>
          els.map((el) =>
            el.hasAttribute("data-nav-wrap") ? "header" : el.localName
          )
        )
    ).toEqual(["header", "main", "footer", "aside"]);
    await expect(page.locator("aside.eu-funding")).toBeVisible();
  });

  test("the header and the mobile menu name the sections and the call CTA", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page.locator(".mb-nav-links [data-nav-link]")).toHaveText(
      NAV_LABELS
    );
    await expect(page.locator("[data-nav-cta]")).toHaveText("Umów rozmowę");
    await expect(page.locator("#mobile-sheet .mb-sheet-link")).toHaveText(
      NAV_LABELS
    );

    // Every menu entry lands on a section of this page.
    for (const href of await page
      .locator(".mb-nav-links [data-nav-link]")
      .evaluateAll((links) => links.map((a) => a.getAttribute("href") ?? ""))) {
      // biome-ignore lint/performance/noAwaitInLoops: one link at a time
      await expect(page.locator(href.replace("/", ""))).toBeAttached();
    }
  });

  test("the hero says what, for whom, and what to click", async ({ page }) => {
    await page.goto("/");
    const hero = page.locator("#top");
    await expect(hero.locator("h1")).toHaveText(
      "Zamień ręczną robotę na czas na rozwój Twojego biznesu"
    );
    await expect(
      hero.getByRole("link", { name: "Umów bezpłatną konsultację" })
    ).toHaveAttribute("href", "#contact");
    await expect(
      hero.getByRole("link", { name: "Zobacz, co mogę dla Ciebie zrobić" })
    ).toHaveAttribute("href", "#services");

    // Beside the text: results, not a photo and a bio, and a button to the
    // case highlights.
    const card = hero.getByRole("complementary", { name: "Efekty w liczbach" });
    await expect(card.locator("img")).toHaveCount(0);
    await expect(card.locator(".mb-status-figure")).toHaveText([
      "+250",
      "+100",
      "24 godziny",
    ]);
    await expect(
      card.getByRole("link", { name: "Zobacz realizacje" })
    ).toHaveAttribute("href", "#cases");
  });

  test("nothing on the page is a placeholder or removed copy", async ({
    page,
    request,
  }) => {
    await page.goto("/");
    // All the copy, closed accordions too, without script and style text.
    const text = await page.evaluate(() => {
      const body = document.body.cloneNode(true) as HTMLElement;
      for (const el of body.querySelectorAll("script, style")) {
        el.remove();
      }
      return body.textContent ?? "";
    });
    expect(text).not.toMatch(BRACKETED);
    expect(text).not.toContain("Wolne terminy");
    expect(text).not.toContain("TODO");

    const llms = await (await request.get("/llms.txt")).text();
    const llmsFull = await (await request.get("/llms-full.txt")).text();
    for (const removed of REMOVED) {
      expect(text, `page: ${removed}`).not.toContain(removed);
      expect(llms, `llms.txt: ${removed}`).not.toContain(removed);
      expect(llmsFull, `llms-full.txt: ${removed}`).not.toContain(removed);
    }
  });

  test("the offer is the three steps with buttons to the form, and llms lists them in the same order", async ({
    page,
    request,
  }) => {
    await page.goto("/");
    const offer = page.locator("#services");
    const titles = (await offer.locator(".mb-card h3").allTextContents()).map(
      (title) => title.trim()
    );
    expect(titles).toEqual(["Audyt AI", "Wdrożenie", "Partner technologiczny"]);

    await expect(offer).toContainText("Koszt audytu odliczam od wdrożenia.");
    for (const cta of ["Zamów audyt", "Wyceń projekt", "Porozmawiajmy"]) {
      // biome-ignore lint/performance/noAwaitInLoops: one button at a time
      await expect(offer.getByRole("link", { name: cta })).toHaveAttribute(
        "href",
        "#contact"
      );
    }

    const llms = await (await request.get("/llms.txt")).text();
    const llmsOffer = llms.match(OFFER_SECTION)?.[1] ?? "";
    expect([...llmsOffer.matchAll(LLMS_ITEM)].map((m) => m[1])).toEqual(titles);
    const llmsFull = await (await request.get("/llms-full.txt")).text();
    const fullOffer = llmsFull.match(OFFER_SECTION)?.[1] ?? "";
    expect([...fullOffer.matchAll(LLMS_FULL_ITEM)].map((m) => m[1])).toEqual(
      titles
    );
  });

  test("the FAQ and the experience list are in the HTML while closed", async ({
    page,
  }) => {
    await page.goto("/");
    const faq = page.locator("#faq details");
    await expect(faq).toHaveCount(8);
    for (const item of await faq.all()) {
      // biome-ignore lint/performance/noAwaitInLoops: one item at a time
      await expect(item).not.toHaveAttribute("open");
    }
    await expect(page.locator("#faq")).toContainText(
      "Kod, dostępy i dokumentacja należą do Ciebie."
    );

    const experience = page.locator("#about details");
    await expect(experience).not.toHaveAttribute("open");
    await expect(experience.locator(".mb-card")).toHaveCount(6);
    await experience.locator("summary").click();
    await expect(experience.locator(".mb-card").first()).toBeVisible();
  });

  test("the open experience table has rules only between its cells, and a hovered cell lights no panel", async ({
    page,
  }) => {
    await page.setViewportSize({ height: 1000, width: 1440 });
    await page.goto("/");
    const experience = page.locator("#about details");
    await experience.locator("summary").click();
    const table = experience.locator(".mb-accordion-content");
    const cards = table.locator(".mb-card");
    await expect(cards.first()).toBeVisible();
    await table.scrollIntoViewIfNeeded();
    await page.mouse.move(0, 0);

    // Three cells a row: the rules between them reach the table's edges.
    const [first, second] = [await box(cards.nth(0)), await box(cards.nth(1))];
    expect(Math.abs(first.y - second.y)).toBeLessThanOrEqual(TOLERANCE);
    const edges = await inkOnEdges(page, table);
    for (const [edge, share] of Object.entries(edges)) {
      expect(share, `no rule along the table's ${edge} edge`).toBeLessThan(
        FRAME_SHARE
      );
    }
    // The rules between the cells are there: the column rule crosses the
    // middle of the table, so it lights part of its top edge.
    expect(edges.top).toBeGreaterThan(0);

    const ground = await cards
      .nth(1)
      .evaluate((el) => getComputedStyle(el).backgroundColor);
    await cards.first().hover();
    await expect
      .poll(() =>
        cards
          .first()
          .evaluate((el) => getComputedStyle(el, "::before").transform)
      )
      .toBe("matrix(1, 0, 0, 1, 0, 0)");
    await expect(cards.first()).toHaveCSS("background-color", ground);
  });

  test("the FAQ fills the width in two columns on the desktop and runs in order in one on a phone", async ({
    page,
  }) => {
    await page.setViewportSize({ height: 900, width: 1440 });
    await page.goto("/");
    const head = await box(page.locator("#faq .mb-section-head"));
    const rows = page.locator("#faq summary");
    const wide = await Promise.all((await rows.all()).map((row) => box(row)));
    expect(wide).toHaveLength(8);
    const left = wide.slice(0, 4);
    const right = wide.slice(4);
    for (const [i, row] of left.entries()) {
      expect(Math.abs(row.x - (left[0] as typeof row).x)).toBeLessThanOrEqual(
        TOLERANCE
      );
      expect(Math.abs(row.y - (right[i] as typeof row).y)).toBeLessThanOrEqual(
        TOLERANCE
      );
      expect((right[i] as typeof row).x).toBeGreaterThan(row.x + row.width);
    }
    const frames = page.locator("#faq .mb-accordion");
    const last = await box(frames.last());
    expect(Math.abs(last.x + last.width - (head.x + head.width))).toBeLessThan(
      TOLERANCE
    );

    // Opening a question grows only its own column: the next row on the
    // left moves down, the right column's rows keep their spacing.
    const gap = async (from: number, to: number) =>
      (await box(rows.nth(to))).y - (await box(rows.nth(from))).y;
    const [leftGap, rightGap] = [await gap(0, 1), await gap(4, 5)];
    await rows.nth(0).click();
    await expect.poll(() => gap(0, 1)).toBeGreaterThan(leftGap + 20);
    expect(await gap(4, 5)).toBe(rightGap);

    await page.setViewportSize({ height: 844, width: 390 });
    const narrow = await Promise.all((await rows.all()).map((row) => box(row)));
    for (const [i, row] of narrow.entries()) {
      expect(Math.abs(row.x - (narrow[0] as typeof row).x)).toBeLessThanOrEqual(
        TOLERANCE
      );
      if (i > 0) {
        expect(row.y).toBeGreaterThan((narrow[i - 1] as typeof row).y);
      }
    }
    // One list: between the halves runs the same hairline as between the
    // questions, drawn once, not the frames' ink.
    const hair = await page
      .locator("#faq details")
      .first()
      .evaluate((el) => getComputedStyle(el).borderBottomColor);
    await expect(frames.first()).toHaveCSS("border-bottom-color", hair);
    await expect(frames.last()).toHaveCSS(
      "border-top-color",
      "rgba(0, 0, 0, 0)"
    );
  });

  test("the contact sheet fills the width, the email and the project type side by side on the desktop", async ({
    page,
  }) => {
    await page.setViewportSize({ height: 900, width: 1440 });
    await page.goto("/");
    const head = await box(page.locator("#contact .mb-section-head"));
    const sheet = await box(page.locator("#contact [data-contact-wrap]"));
    expect(
      Math.abs(sheet.x + sheet.width - (head.x + head.width))
    ).toBeLessThan(TOLERANCE);
    const email = page.locator('#contact [data-field="email"]');
    const type = page.locator('#contact [data-field="type"]');
    const message = page.locator('#contact [data-field="message"]');
    let [e, t, m] = [await box(email), await box(type), await box(message)];
    expect(Math.abs(e.y - t.y)).toBeLessThanOrEqual(TOLERANCE);
    expect(t.x).toBeGreaterThan(e.x + e.width);
    expect(m.y).toBeGreaterThan(e.y + e.height);
    expect(Math.abs(m.width - (t.x + t.width - e.x))).toBeLessThan(TOLERANCE);

    // The form comes first; the direct links are the sheet's last row,
    // sharing its bottom rule, and the submit button sits right under the
    // message, not at the foot of an empty sheet.
    const links = await box(page.locator("#contact .mb-contact-links"));
    expect(Math.abs(links.y - (sheet.y + sheet.height - 1))).toBeLessThan(
      TOLERANCE
    );
    const submit = await box(page.locator("#contact [data-submit]"));
    expect(submit.y - (m.y + m.height)).toBeLessThan(40);
    expect(sheet.y + sheet.height - (submit.y + submit.height)).toBeLessThan(
      40
    );

    await page.setViewportSize({ height: 844, width: 390 });
    [e, t, m] = [await box(email), await box(type), await box(message)];
    expect(Math.abs(e.x - t.x)).toBeLessThanOrEqual(TOLERANCE);
    expect(t.y).toBeGreaterThan(e.y + e.height);
    expect(m.y).toBeGreaterThan(t.y + t.height);
  });

  test("the hero's text, buttons, card rows and figures sit on one grid", async ({
    page,
  }) => {
    // Every box in one read, so nothing moves between two measurements.
    const measure = () =>
      page.locator("#top").evaluate((hero) => {
        const r = (el: Element) =>
          el.getBoundingClientRect().toJSON() as DOMRect;
        const all = (selector: string) =>
          [...hero.querySelectorAll(selector)].map(r);
        return {
          card: r(hero.querySelector(".mb-hero-status") as Element),
          cardButton: r(
            hero.querySelector(".mb-status-cta .mb-btn") as Element
          ),
          ctas: all(".mb-hero-ctas .mb-btn"),
          figures: all(".mb-status-figure"),
          rows: all(".mb-status-row"),
          text: r(hero.querySelector(".mb-hero-text") as Element),
        };
      });

    await page.setViewportSize({ height: 1000, width: 1440 });
    await page.goto("/");
    const wide = await measure();
    // The two columns start and end on the same lines, and the hero's
    // buttons rest on the card button's line.
    expect(Math.abs(wide.card.y - wide.text.y)).toBeLessThan(TOLERANCE);
    expect(Math.abs(wide.card.height - wide.text.height)).toBeLessThan(
      TOLERANCE
    );
    for (const cta of wide.ctas) {
      expect(Math.abs(cta.bottom - wide.cardButton.bottom)).toBeLessThan(
        TOLERANCE
      );
    }

    await page.setViewportSize({ height: 844, width: 390 });
    const narrow = await measure();
    // Stacked, every hero button takes the column's full width, and the
    // card's button the card's.
    for (const cta of narrow.ctas) {
      expect(Math.abs(cta.width - narrow.text.width)).toBeLessThan(TOLERANCE);
    }
    expect(
      Math.abs(narrow.cardButton.width - (narrow.rows[0]?.width ?? 0))
    ).toBeLessThan(TOLERANCE);

    // At both widths: the card's rows are equally tall and its figures
    // start at one x.
    for (const { figures, rows } of [wide, narrow]) {
      expect(rows).toHaveLength(3);
      const heights = rows.map((row) => row.height);
      expect(Math.max(...heights) - Math.min(...heights)).toBeLessThan(
        TOLERANCE
      );
      const xs = figures.map((figure) => figure.x);
      expect(Math.max(...xs) - Math.min(...xs)).toBeLessThan(TOLERANCE);
    }

    // A row whose text runs a line longer still keeps the rows equal.
    await page
      .locator("#top .mb-status-text")
      .first()
      .evaluate((text) => {
        text.textContent += " i jeszcze jedna linia opisu ponad pozostałe";
      });
    const longer = (await measure()).rows.map((row) => row.height);
    expect(longer[0]).toBeGreaterThan(narrow.rows[0]?.height ?? 0);
    expect(Math.max(...longer) - Math.min(...longer)).toBeLessThan(TOLERANCE);
  });

  test("the offer's labels run in straight lines, and only the first step's button is the primary one", async ({
    page,
  }) => {
    await page.setViewportSize({ height: 900, width: 1440 });
    await page.goto("/");
    const offer = page.locator("#services");
    const cells = offer.locator(".mb-card");
    await expect(cells).toHaveCount(3);
    // The first cell's "Dla kogo" wraps onto two lines at this width; the
    // rows under it stay level with the other cells' rows anyway.
    const rows = await offer
      .locator(".mb-service-facts")
      .evaluateAll((lists) =>
        lists.map((list) =>
          [...list.querySelectorAll("dt")].map(
            (dt) => dt.getBoundingClientRect().y
          )
        )
      );
    expect(rows).toHaveLength(3);
    for (const [row, label] of ["Dla kogo", "Co dostajesz", "Czas"].entries()) {
      const ys = rows.map((cell) => cell[row] ?? Number.NaN);
      expect(Math.max(...ys) - Math.min(...ys), label).toBeLessThan(TOLERANCE);
    }
    const buttons = await cells
      .locator(".mb-card-footer > *")
      .evaluateAll((els) => els.map((el) => el.className));
    expect(buttons[0]).toContain("mb-btn-default");
    expect(buttons[1]).toContain("mb-btn-outline");
    expect(buttons[2]).toContain("mb-btn-outline");

    // The pricing answer is the head's lede; the audit credit is a fact of
    // the audit step.
    await expect(offer.locator(".mb-section-lede")).toContainText(
      "Każdy projekt wyceniam indywidualnie."
    );
    await expect(cells.first()).toContainText(
      "Koszt audytu odliczam od wdrożenia."
    );
  });

  test("between the offer and the contact form, the process ends at a button to the form", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(
      page.locator("#how").getByRole("link", { name: "Umów bezpłatną rozmowę" })
    ).toHaveAttribute("href", "#contact");
  });

  test("a case names its company once, with no logo", async ({ page }) => {
    await page.goto("/");
    const cards = page.locator("#cases .mb-card");
    await expect(cards).toHaveCount(2);
    await expect(cards.locator("img")).toHaveCount(0);
    const head = cards.first().locator(".mb-cases-head");
    const [title, badge] = [
      await box(head.locator("h3")),
      await box(head.locator(".mb-badge")),
    ];
    expect(badge.x).toBeGreaterThan(title.x + title.width);

    // On a phone every badge sits under its name, a long one and a short
    // one alike.
    await page.setViewportSize({ height: 844, width: 390 });
    for (const card of await cards.all()) {
      const [name, kind] = [
        // biome-ignore lint/performance/noAwaitInLoops: one card at a time
        await box(card.locator("h3")),
        await box(card.locator(".mb-cases-head .mb-badge")),
      ];
      expect(kind.y).toBeGreaterThan(name.y + name.height - 1);
      expect(Math.abs(kind.x - name.x)).toBeLessThan(TOLERANCE);
    }
  });

  test("the trust bar names a bare mark, sizes logos by weight, and stays a short band on a phone", async ({
    page,
  }) => {
    await page.setViewportSize({ height: 900, width: 1440 });
    await page.goto("/");
    const trust = page.locator("#trust");
    await expect(trust.getByText("Apptension", { exact: true })).toBeVisible();
    const pwc = await box(trust.getByRole("img", { name: "PwC Polska" }));
    const rex = await box(
      trust.getByRole("img", { name: "ReX Recruitment Exchange" })
    );
    expect(pwc.height).toBeGreaterThan(rex.height);

    await page.setViewportSize({ height: 844, width: 390 });
    const strip = await box(trust.locator(".mb-trust-logos"));
    expect(strip.height).toBeLessThan(260);
  });

  test("the wide last example keeps the prose measure", async ({ page }) => {
    await page.setViewportSize({ height: 900, width: 1440 });
    await page.goto("/");
    const last = page.locator("#examples .mb-card").last();
    const [cell, text] = [
      await box(last),
      await box(last.locator(".mb-example-desc")),
    ];
    expect(text.width).toBeLessThan(cell.width * 0.7);
  });

  test("the meta follow the brief", async ({ page, request }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(TITLE);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      DESCRIPTION
    );
    await expect(
      page.locator('meta[property="og:description"]')
    ).toHaveAttribute("content", DESCRIPTION);
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
      "content",
      "Kacper Adler: AI Engineer · Partner technologiczny"
    );

    const person = (
      await page.locator('script[type="application/ld+json"]').allTextContents()
    )
      .map((json) => JSON.parse(json))
      .find((schema) => schema["@type"] === "Person");
    expect(person.jobTitle).toBe("AI Engineer · Partner technologiczny");
    expect(person.knowsAbout).toEqual(
      expect.arrayContaining(["Agenci AI", "Wdrożenia AI w firmach"])
    );

    const llms = await (await request.get("/llms.txt")).text();
    expect(llms).toMatch(LLMS_HEAD);
  });
});
