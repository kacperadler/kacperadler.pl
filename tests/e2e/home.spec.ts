import { expect, type Locator, type Page, test } from "@playwright/test";
import sharp from "sharp";

// The home page per the brief (KA0075): its sections in order, the menu, the
// offer, the meta, and none of the copy the brief removed.

const SECTIONS = [
  "top",
  "trust",
  "problems",
  "services",
  "cases",
  "how",
  "about",
  "faq",
  "contact",
];
const SECTION_LABELS = [
  "Problem",
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
  // The lead marketplace was taken over, not built from scratch.
  "od zera",
  "Od zera",
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

// The layout is measured with the drawing standing complete (under reduced
// motion nothing waits for the pen, blueprint.spec.ts covers the drawing);
// the one test of motion here opens its own context.
test.use({ contextOptions: { reducedMotion: "reduce" } });

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
      "Wdrożenia AI i automatyzacje, które przejmują nudną pracę"
    );
    // The hero's headline is the page's only h1, and "nudną pracę" is its
    // underlined phrase.
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(hero.locator("h1 em")).toHaveText("nudną pracę");
    await expect(hero.locator(".mb-hero-sub")).toHaveText(
      "Tworzę automatyzacje, integracje i aplikacje szyte na miarę. Znajduję procesy, które zabierają czas, i zamieniam je w działające systemy. Ty skupiasz się na biznesie i rozwoju firmy, a powtarzalne zadania zostawiasz mnie."
    );
    await expect(
      hero.getByRole("link", { name: "Umów bezpłatną konsultację" })
    ).toHaveAttribute("href", "#contact");
    await expect(
      hero.getByRole("link", {
        name: "Zobacz, co mogę zrobić dla Twojej firmy",
      })
    ).toHaveAttribute("href", "#services");

    // Beside the text: results, not a photo and a bio, and a button to the
    // case highlights.
    const card = hero.getByRole("complementary", { name: "Efekty w liczbach" });
    await expect(card.locator("img")).toHaveCount(0);
    await expect(card.locator(".mb-badge")).toHaveCount(0);
    // A description list: each figure (dt) over what it counts (dd).
    await expect(card.locator("dl > div > dt")).toHaveText([
      "1000+",
      "500+",
      "24 h",
    ]);
    await expect(card.locator("dl > div > dd")).toHaveText([
      "osób codziennie pracuje w systemach, które współtworzyłem",
      "osób codziennie korzysta z aplikacji mobilnych, które stworzyłem",
      "w tym czasie wracam z pierwszym pomysłem na automatyzację",
    ]);
    await expect(
      card.getByRole("link", { name: "Zobacz realizacje" })
    ).toHaveAttribute("href", "#cases");
  });

  test("the problems are six cells with their effects, three a row on the desktop and one on a phone", async ({
    page,
  }) => {
    const problems = page.locator("#problems");
    const cells = problems.locator(".mb-card");
    // Each cell's box and the top of its effect line, in one read.
    const cellBoxes = () =>
      cells.evaluateAll((els) =>
        els.map((el) => ({
          ...(el.getBoundingClientRect().toJSON() as DOMRect),
          effect: (
            el.querySelector(".mb-problem-effect") as Element
          ).getBoundingClientRect().top,
        }))
      );
    const spread = (values: number[]) =>
      Math.max(...values) - Math.min(...values);

    await page.setViewportSize({ height: 1000, width: 1440 });
    await page.goto("/");
    await expect(cells.locator("h3")).toHaveText([
      "Przepisywanie danych",
      "Te same pytania",
      "Ręczne raporty",
      "Dokumenty i faktury",
      "Wiedza w głowach",
      "AI bez planu",
    ]);
    await expect(cells.locator(".mb-problem")).toHaveText([
      "Zespół godzinami kopiuje te same dane między systemami.",
      "Odpowiadacie w kółko na podobne maile i zapytania klientów.",
      "Co tydzień składacie raport z kilku Exceli.",
      "Ktoś ręcznie wypełnia i sprawdza dokumenty, faktury i umowy.",
      "Odpowiedzi znają tylko konkretne osoby, a reszta czeka na nie.",
      "Wiesz, że AI mogłoby pomóc, ale nie wiesz, od czego zacząć.",
    ]);
    // Under each sentence, after an arrow, the effect (the arrow is hidden
    // from screen readers).
    await expect(cells.locator(".mb-problem-effect")).toHaveText([
      "→ CRM, poczta i arkusze wymieniają się danymi same.",
      "→ Agent AI odpowiada na proste sprawy, a trudne przekazuje Wam z gotowym podsumowaniem.",
      "→ Raport jest gotowy, zanim o niego poprosisz.",
      "→ Dane z dokumentów trafiają do systemu same.",
      "→ Asystent AI odpowiada każdemu w zespole na podstawie Waszych dokumentów.",
      "→ Na bezpłatnej rozmowie pokażę, od czego zacząć i ile to kosztuje.",
    ]);
    await expect(cells.locator(".mb-badge, .mb-badge-tag")).toHaveCount(0);
    // Lede, closing line and button stay.
    await expect(problems.locator(".mb-section-lede")).toContainText(
      "Jeśli rozpoznajesz swoją firmę"
    );
    await expect(
      problems.getByRole("link", { name: "Umów bezpłatną rozmowę" })
    ).toHaveAttribute("href", "#contact");

    for (const [width, perRow] of [
      [1440, 3],
      [700, 2],
      [390, 1],
    ] as const) {
      // biome-ignore lint/performance/noAwaitInLoops: one width at a time
      await page.setViewportSize({ height: 900, width });
      const boxes = await cellBoxes();
      expect(boxes).toHaveLength(6);
      const rows = Map.groupBy(boxes, (cell) => Math.round(cell.y));
      expect(rows.size, `${width}px`).toBe(6 / perRow);
      expect(spread(boxes.map((cell) => cell.width))).toBeLessThan(TOLERANCE);
      // In a row: the cells equally tall, the effects on one line.
      for (const row of rows.values()) {
        expect(spread(row.map((cell) => cell.height))).toBeLessThan(TOLERANCE);
        expect(spread(row.map((cell) => cell.effect))).toBeLessThan(TOLERANCE);
      }
    }

    // On a phone the button spans the column, like the hero's.
    const grid = await box(problems.locator(".mb-problems-grid"));
    const button = await box(
      problems.getByRole("link", { name: "Umów bezpłatną rozmowę" })
    );
    expect(Math.abs(button.width - grid.width)).toBeLessThan(TOLERANCE);
  });

  test("fewer paragraphs end on a lone word than with plain wrapping, on the desktop and on a phone", async ({
    page,
  }) => {
    // The text blocks of at least four words whose last word sits alone on
    // its line, with the page's wrapping and then with plain `wrap`.
    const lone = () =>
      page.evaluate(() => {
        const count = () =>
          Array.from(
            document.querySelectorAll("main :is(p, li, dd, summary, h3)")
          ).filter((el) => {
            const words: Range[] = [];
            const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
            for (let node = walker.nextNode(); node; node = walker.nextNode()) {
              for (const word of node.textContent?.matchAll(/\S+/g) ?? []) {
                const range = document.createRange();
                range.setStart(node, word.index);
                range.setEnd(node, word.index + word[0].length);
                words.push(range);
              }
            }
            const [before, last] = words.slice(-2);
            return (
              words.length >= 4 &&
              before !== undefined &&
              last !== undefined &&
              last.getBoundingClientRect().top -
                before.getBoundingClientRect().top >
                4
            );
          }).length;
        const pretty = count();
        document.documentElement.style.textWrap = "wrap";
        const plain = count();
        document.documentElement.style.textWrap = "";
        return { plain, pretty };
      });

    await page.setViewportSize({ height: 900, width: 1440 });
    await page.goto("/");
    const wide = await lone();
    expect(wide.pretty).toBeLessThan(wide.plain);

    await page.setViewportSize({ height: 844, width: 390 });
    const narrow = await lone();
    expect(narrow.pretty).toBeLessThan(narrow.plain);
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
    expect(titles).toEqual([
      "Audyt AI",
      "Wdrożenie",
      "Partner technologiczny",
      "Aplikacje szyte na miarę",
    ]);

    await expect(offer).toContainText("Koszt audytu odliczam od wdrożenia.");
    for (const cta of ["Zamów audyt", "Wyceń projekt", "Porozmawiajmy"]) {
      // biome-ignore lint/performance/noAwaitInLoops: one button at a time
      await expect(offer.getByRole("link", { name: cta })).toHaveAttribute(
        "href",
        "#contact"
      );
    }

    // Custom apps: one full-width row under the three steps, sharing the
    // table's bottom rule.
    const steps = await box(offer.locator(".mb-services-grid"));
    const apps = await box(offer.locator(".mb-services-apps .mb-card"));
    expect(Math.abs(apps.y - (steps.y + steps.height - 1))).toBeLessThan(
      TOLERANCE
    );
    expect(Math.abs(apps.width - steps.width)).toBeLessThan(TOLERANCE);

    const llms = await (await request.get("/llms.txt")).text();
    const llmsOffer = llms.match(OFFER_SECTION)?.[1] ?? "";
    expect([...llmsOffer.matchAll(LLMS_ITEM)].map((m) => m[1])).toEqual(
      titles.slice(0, 3)
    );
    expect(llmsOffer).toContain("- **Aplikacje szyte na miarę**: Gotowe");
    const llmsFull = await (await request.get("/llms-full.txt")).text();
    const fullOffer = llmsFull.match(OFFER_SECTION)?.[1] ?? "";
    expect([...fullOffer.matchAll(LLMS_FULL_ITEM)].map((m) => m[1])).toEqual(
      titles.slice(0, 3)
    );
    expect(fullOffer).toContain("### Aplikacje szyte na miarę");

    // What can be automated: the six problems with their effects, in both.
    for (const text of [llms, llmsFull]) {
      expect(text).toContain(
        "- **Przepisywanie danych**: Zespół godzinami kopiuje te same dane między systemami. → CRM, poczta i arkusze wymieniają się danymi same."
      );
      expect(text).toContain("- **AI bez planu**: ");
    }
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
    await expect(experience.locator(".mb-card")).toHaveCount(8);
    await experience.locator("summary").click();
    await expect(experience.locator(".mb-card").first()).toBeVisible();
  });

  test("the open experience table has rules only between its cells, and a hovered cell lights no panel", async ({
    page,
  }) => {
    // Tall enough for the whole open table under the sticky header: its
    // edges are read from a screenshot of the viewport.
    await page.setViewportSize({ height: 1600, width: 1440 });
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
          .evaluate((el) => getComputedStyle(el, "::after").visibility)
      )
      .toBe("visible");
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

  test("the contact sheet fills the width, the email and the company side by side over the project types on the desktop", async ({
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
    const company = page.locator('#contact [data-field="company"]');
    const type = page.locator('#contact [data-field="type"]');
    const message = page.locator('#contact [data-field="message"]');
    let [e, c, t, m] = [
      await box(email),
      await box(company),
      await box(type),
      await box(message),
    ];
    expect(Math.abs(e.y - c.y)).toBeLessThanOrEqual(TOLERANCE);
    expect(c.x).toBeGreaterThan(e.x + e.width);
    expect(t.y).toBeGreaterThan(e.y + e.height);
    expect(Math.abs(t.x - e.x)).toBeLessThanOrEqual(TOLERANCE);
    expect(m.y).toBeGreaterThan(t.y + t.height);
    expect(Math.abs(m.width - (c.x + c.width - e.x))).toBeLessThan(TOLERANCE);

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
    [e, c, t, m] = [
      await box(email),
      await box(company),
      await box(type),
      await box(message),
    ];
    expect(Math.abs(e.x - c.x)).toBeLessThanOrEqual(TOLERANCE);
    expect(Math.abs(e.x - t.x)).toBeLessThanOrEqual(TOLERANCE);
    expect(c.y).toBeGreaterThan(e.y + e.height);
    expect(t.y).toBeGreaterThan(c.y + c.height);
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

    await page.setViewportSize({ height: 800, width: 360 });
    const smallest = await measure();
    for (const cta of smallest.ctas) {
      expect(Math.abs(cta.width - smallest.text.width)).toBeLessThan(TOLERANCE);
    }

    // At every width: the card's rows are equally tall and its figures
    // start at one x.
    for (const { figures, rows } of [wide, narrow, smallest]) {
      expect(rows).toHaveLength(3);
      const heights = rows.map((row) => row.height);
      expect(Math.max(...heights) - Math.min(...heights)).toBeLessThan(
        TOLERANCE
      );
      const xs = figures.map((figure) => figure.x);
      expect(Math.max(...xs) - Math.min(...xs)).toBeLessThan(TOLERANCE);
    }

    // A row whose text runs a line longer still keeps the rows equal.
    await page.setViewportSize({ height: 844, width: 390 });
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
    const cells = offer.locator(".mb-services-grid > .mb-card");
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

  test("the process alternates around a central rail, staggered with room and joined to it, and runs in one column on a phone", async ({
    page,
  }) => {
    const layout = () =>
      page.locator("#how").evaluate((how) => {
        const r = (el: Element | null) =>
          (el as Element).getBoundingClientRect().toJSON() as DOMRect;
        return {
          list: r(how.querySelector(".mb-how-steps")),
          steps: [...how.querySelectorAll(".mb-step")].map((step) => ({
            badge: r(step.querySelector(".mb-card .mb-step-head .mb-badge")),
            card: r(step.querySelector(".mb-card")),
            contentRight: (() => {
              const card = step.querySelector(".mb-card") as Element;
              const style = getComputedStyle(card);
              return (
                card.getBoundingClientRect().right -
                Number.parseFloat(style.paddingRight) -
                Number.parseFloat(style.borderRightWidth)
              );
            })(),
            dot: r(step.querySelector(".mb-step-dot")),
            link: r(step.querySelector(".mb-step-link")),
            title: r(step.querySelector(".mb-card h3")),
            // The title's first line of text, and where the card's content
            // ends on the right.
            titleLine: (() => {
              const range = document.createRange();
              range.selectNodeContents(
                step.querySelector(".mb-card h3") as Element
              );
              return range.getClientRects()[0]?.toJSON() as DOMRect;
            })(),
          })),
        };
      });

    await page.setViewportSize({ height: 1000, width: 1440 });
    await page.goto("/");
    const { list, steps: wide } = await layout();
    expect(wide).toHaveLength(5);
    const container = await box(page.locator("#how .container"));
    for (const [i, step] of wide.entries()) {
      const middle = step.dot.x + step.dot.width / 2;
      // The marks run down the middle of the container.
      expect(
        Math.abs(middle - (container.x + container.width / 2))
      ).toBeLessThan(TOLERANCE + 16);
      // Odd steps left of the rail, even ones right, each joined to its
      // mark by a connector on the mark's centre, from edge to edge.
      const dotMiddle = step.dot.y + step.dot.height / 2;
      expect(
        Math.abs(step.link.y + step.link.height / 2 - dotMiddle)
      ).toBeLessThan(TOLERANCE);
      if (i % 2 === 0) {
        expect(Math.abs(step.link.left - step.card.right)).toBeLessThan(
          TOLERANCE
        );
        expect(Math.abs(step.link.right - step.dot.left)).toBeLessThan(
          TOLERANCE
        );
      } else {
        expect(Math.abs(step.link.left - step.dot.right)).toBeLessThan(
          TOLERANCE
        );
        expect(Math.abs(step.link.right - step.card.left)).toBeLessThan(
          TOLERANCE
        );
      }
      // The duration on the title's line, at its right end.
      expect(step.badge.x).toBeGreaterThan(step.title.right);
      expect(Math.abs(step.badge.right - step.contentRight)).toBeLessThan(
        TOLERANCE
      );
      expect(
        Math.abs(
          step.badge.y +
            step.badge.height / 2 -
            (step.titleLine.y + step.titleLine.height / 2)
        )
      ).toBeLessThan(TOLERANCE);
      // Staggered: each card starts near the foot of the one before it
      // (they still overlap, so no side has a hole, but each step stands
      // clear), and two cards on one side stand 128px apart.
      const previous = wide[i - 1];
      if (previous) {
        const into = (step.card.top - previous.card.top) / previous.card.height;
        expect(into, `card ${i + 1}`).toBeGreaterThan(0.8);
        expect(into, `card ${i + 1}`).toBeLessThan(1);
      }
      const sameSide = wide[i - 2];
      if (sameSide) {
        expect(
          Math.abs(step.card.top - sameSide.card.bottom - 128),
          `card ${i + 1}`
        ).toBeLessThan(TOLERANCE);
      }
    }
    // The overlap still makes the steps shorter than the cards stacked one
    // under another.
    const stacked = wide.reduce((sum, step) => sum + step.card.height, 0);
    expect(list.height).toBeLessThan(stacked);

    await page.setViewportSize({ height: 844, width: 390 });
    const { steps: narrow } = await layout();
    for (const [i, step] of narrow.entries()) {
      // One column: the mark left of every card, no connectors.
      expect(Math.abs(step.card.x - (narrow[0]?.card.x ?? 0))).toBeLessThan(
        TOLERANCE
      );
      expect(step.dot.right).toBeLessThan(step.card.left);
      expect(step.link.width).toBe(0);
      // The duration stays on the title's line, at its right end, even
      // when a narrow card wraps the title.
      expect(Math.abs(step.badge.right - step.contentRight)).toBeLessThan(
        TOLERANCE
      );
      expect(
        Math.abs(
          step.badge.y +
            step.badge.height / 2 -
            (step.titleLine.y + step.titleLine.height / 2)
        )
      ).toBeLessThan(TOLERANCE);
      // The cards 40px apart, the rail through the space between.
      const previous = narrow[i - 1];
      if (previous) {
        expect(
          Math.abs(step.card.top - previous.card.bottom - 40)
        ).toBeLessThan(TOLERANCE);
      }
    }
  });

  test("the process rail fills as the page scrolls through it", async ({
    browser,
  }) => {
    const context = await browser.newContext({
      reducedMotion: "no-preference",
    });
    const page = await context.newPage();
    // The 2px blue line over each segment (its scale), and which marks are
    // blue.
    const fill = () =>
      page.locator("#how").evaluate((how) => ({
        dots: [...how.querySelectorAll(".mb-step-dot")].map(
          (dot) =>
            getComputedStyle(dot).backgroundColor === "rgb(142, 174, 216)"
        ),
        lines: [...how.querySelectorAll(".mb-step-fill")].map(
          (line) =>
            new DOMMatrix(getComputedStyle(line, "::before").transform).d
        ),
        // A connector turns blue with its mark.
        links: [...how.querySelectorAll(".mb-step-link")].map(
          (link) =>
            getComputedStyle(link).backgroundColor === "rgb(142, 174, 216)"
        ),
      }));
    // Puts the element's centre a little past the viewport's middle line.
    const scrollTo = (selector: string) =>
      page.evaluate((target) => {
        const rect = (
          document.querySelector(target) as Element
        ).getBoundingClientRect();
        window.scrollTo(
          0,
          rect.top +
            rect.height / 2 +
            8 +
            window.scrollY -
            window.innerHeight / 2
        );
      }, selector);

    await page.setViewportSize({ height: 1000, width: 1440 });
    await page.goto("/");
    await page.evaluate(() => window.scrollTo(0, 0));
    await expect.poll(fill).toEqual({
      dots: [false, false, false, false, false],
      lines: [0, 0, 0, 0, 0],
      links: [false, false, false, false, false],
    });

    // The middle of the viewport on the third mark: the first two segments
    // full, the marks up to the third blue, the rest still empty.
    await scrollTo("#how .mb-step:nth-child(3) .mb-step-dot");
    await expect
      .poll(async () => (await fill()).dots)
      .toEqual([true, true, true, false, false]);
    const middle = await fill();
    expect(middle.lines.slice(0, 2)).toEqual([1, 1]);
    expect(middle.lines.slice(3)).toEqual([0, 0]);
    expect(middle.links).toEqual(middle.dots);

    await scrollTo("#how .mb-how-cta");
    await expect.poll(fill).toEqual({
      dots: [true, true, true, true, true],
      lines: [1, 1, 1, 1, 1],
      links: [true, true, true, true, true],
    });
    await context.close();
  });

  test("with reduced motion the process rail shows filled, nothing moves", async ({
    browser,
  }) => {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const page = await context.newPage();
    await page.goto("/");
    const state = await page.locator("#how").evaluate((how) => ({
      animations: how.getAnimations({ subtree: true }).length,
      dots: [...how.querySelectorAll(".mb-step-dot")].map(
        (dot) => getComputedStyle(dot).backgroundColor
      ),
      lines: [...how.querySelectorAll(".mb-step-fill")].map(
        (line) => getComputedStyle(line, "::before").transform
      ),
      links: [...how.querySelectorAll(".mb-step-link")].map(
        (link) => getComputedStyle(link).backgroundColor
      ),
    }));
    expect(state.animations).toBe(0);
    expect(new Set(state.links)).toEqual(new Set(["rgb(142, 174, 216)"]));
    expect(new Set(state.dots)).toEqual(new Set(["rgb(142, 174, 216)"]));
    expect(new Set(state.lines)).toEqual(new Set(["none"]));
    await context.close();
  });

  test("between the offer and the contact form, the process ends at a button to the form", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(
      page.locator("#how").getByRole("link", { name: "Umów bezpłatną rozmowę" })
    ).toHaveAttribute("href", "#contact");
  });

  test("the cases are four projects, newest first, each named once by its logos", async ({
    page,
    request,
  }) => {
    await page.setViewportSize({ height: 1000, width: 1440 });
    await page.goto("/");
    const cards = page.locator("#cases .mb-card");
    await expect(cards).toHaveCount(4);
    // The heading is the logo (two for the marketplace); its alt text is
    // the company, so the heading reads as the name.
    await expect(cards.locator("h3")).toHaveText(["", " i ", "", ""]);
    const names = await cards
      .locator("h3")
      .evaluateAll((headings) =>
        headings.map((h) =>
          [...h.querySelectorAll("img")].map((img) => img.alt).join(" i ")
        )
      );
    expect(names).toEqual([
      "ReX Recruitment Exchange",
      "LeadBuster i LeadApartament",
      "Helpfind",
      "Energia Direct",
    ]);
    // Helpfind was team work, and the card says so.
    await expect(cards.locator(".mb-cases-row dd").nth(7)).toContainText(
      "W zespole budowałem wewnętrzny CRM"
    );

    // In a row the cells are equally tall and each label starts on one line.
    const rows = await cards.evaluateAll((els) =>
      Object.values(
        Object.groupBy(
          els.map((el) => ({
            height: el.getBoundingClientRect().height,
            labels: [...el.querySelectorAll("dt")].map(
              (dt) => dt.getBoundingClientRect().top
            ),
            y: Math.round(el.getBoundingClientRect().y),
          })),
          (cell) => cell.y
        )
      )
    );
    expect(rows).toHaveLength(2);
    for (const row of rows) {
      const [first, second] = (row ?? []) as unknown as [
        { height: number; labels: number[] },
        { height: number; labels: number[] },
      ];
      expect(Math.abs(first.height - second.height)).toBeLessThan(TOLERANCE);
      for (const [i, top] of first.labels.entries()) {
        expect(Math.abs(top - (second.labels[i] ?? 0))).toBeLessThan(TOLERANCE);
      }
    }

    const head = cards.first().locator(".mb-cases-head");
    const [title, badge] = [
      await box(head.locator("h3")),
      await box(head.locator(".mb-badge")),
    ];
    expect(badge.x).toBeGreaterThan(title.x + title.width);

    // On a phone every badge sits under its logos, a long one and a short
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

    // The facts as the human gave them: the marketplace's launch month,
    // Energia Direct's ~100 daily users, on the page
    // and in the full text for AI agents.
    const llmsFull = await (await request.get("/llms-full.txt")).text();
    expect(llmsFull).toContain(
      "### LeadBuster i LeadApartament (Marketplace leadów)"
    );
    const casesText = await page.locator("#cases").textContent();
    for (const text of [casesText, llmsFull]) {
      expect(text).toContain("Platforma działa od 10.2026 na leadbuster.pl");
      expect(text).toContain("Ok. 100 użytkowników dziennie.");
      expect(text).not.toContain("200 użytkowników");
      expect(text).not.toContain("19.10.2026");
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

  test("the about text is the three paragraphs, its column level with the photo and the links ending on the photo's foot", async ({
    page,
  }) => {
    const about = page.locator("#about");
    const layout = () =>
      about.evaluate((section) => {
        const r = (selector: string) =>
          (section.querySelector(selector) as Element)
            .getBoundingClientRect()
            .toJSON() as DOMRect;
        // The top of the first line's text (its content area).
        const first = section.querySelector(".mb-about-text > p") as Element;
        const range = document.createRange();
        range.selectNodeContents(first);
        const line = range.getClientRects()[0] as DOMRect;
        return {
          links: r(".mb-about-text .mb-cell-grid"),
          photo: r(".mb-about-photo"),
          textTop: line.top,
        };
      });

    await page.setViewportSize({ height: 1000, width: 1440 });
    await page.goto("/");
    await expect(about.locator(".mb-about-text > p")).toHaveText([
      "Od 2020 roku buduję oprogramowanie: od enterprise, przez software house, po wewnętrzne systemy używane codziennie przez setki osób.",
      "Dziś łączę to doświadczenie z AI. Sam dowożę to, na co kiedyś trzeba było całego zespołu: analizę procesu, backend, frontend, integracje i wdrożenie.",
      "Pracuję z firmami jako ich partner technologiczny. Rozumiem biznes, tłumaczę technologię na ludzki język i biorę odpowiedzialność za efekt.",
    ]);

    for (const width of [1440, 1024]) {
      // biome-ignore lint/performance/noAwaitInLoops: one width at a time
      await page.setViewportSize({ height: 1000, width });
      const { links, photo, textTop } = await layout();
      expect(Math.abs(textTop - photo.top), `${width}px top`).toBeLessThan(
        TOLERANCE
      );
      expect(
        Math.abs(links.bottom - photo.bottom),
        `${width}px bottom`
      ).toBeLessThan(TOLERANCE);
    }

    // A phone: the photo above the text, nothing wider than the screen.
    await page.setViewportSize({ height: 844, width: 390 });
    const { links, photo } = await layout();
    expect(links.top).toBeGreaterThan(photo.bottom);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth)
    ).toBe(390);
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
