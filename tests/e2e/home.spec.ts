import { expect, test } from "@playwright/test";

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
  "Problemy",
  "Przykłady",
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
  "Automatyzuję ręczną pracę w firmach z pomocą AI: agenci, integracje, narzędzia wewnętrzne. Audyt, wdrożenie i stała opieka, bez zatrudniania działu IT.";
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
      "Mniej ręcznej roboty. Więcej czasu na biznes."
    );
    await expect(
      hero.getByRole("link", { name: "Umów bezpłatną rozmowę (30 min)" })
    ).toHaveAttribute("href", "#contact");
    await expect(
      hero.getByRole("link", { name: "Zobacz, co mogę zautomatyzować" })
    ).toHaveAttribute("href", "#examples");
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

  test("the offer is the three steps, Wdrożenie names apps and landing pages, and llms lists them in the same order", async ({
    page,
    request,
  }) => {
    await page.goto("/");
    const offer = page.locator("#services");
    const titles = (await offer.locator(".mb-card h3").allTextContents()).map(
      (title) => title.trim()
    );
    expect(titles).toEqual(["Audyt AI", "Wdrożenie", "Partner technologiczny"]);

    const implementation = offer
      .locator(".mb-card")
      .filter({ has: page.locator("h3", { hasText: "Wdrożenie" }) });
    await expect(implementation).toContainText("webową");
    await expect(implementation).toContainText("mobilną");
    await expect(implementation).toContainText("landing page");
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
    await expect(faq).toHaveCount(6);
    for (const item of await faq.all()) {
      // biome-ignore lint/performance/noAwaitInLoops: one item at a time
      await expect(item).not.toHaveAttribute("open");
    }
    await expect(page.locator("#faq")).toContainText(
      "Kod i dokumentacja należą do Ciebie."
    );

    const experience = page.locator("#about details");
    await expect(experience).not.toHaveAttribute("open");
    await expect(experience.locator(".mb-card")).toHaveCount(6);
    await experience.locator("summary").click();
    await expect(experience.locator(".mb-card").first()).toBeVisible();
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
