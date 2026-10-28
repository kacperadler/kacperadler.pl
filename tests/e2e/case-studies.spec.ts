import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import AxeBuilder from "@axe-core/playwright";
import { expect, type Page, test } from "@playwright/test";

// The e2e build reads tests/fixtures/case-studies while src/content/case-studies
// is empty (E2E_FIXTURES=1, see src/content.config.ts), so these specs run on
// whatever case studies the build has rather than on the fixture's values.

test.use({ contextOptions: { reducedMotion: "reduce" } });

const SITE = "https://kacperadler.pl";
const CASE_STUDY_PATH = /^\/realizacje\/[a-z0-9-]+\/$/;
const LIST_PATH = "/realizacje/";
// The menu is the same in both builds: every entry is a home page section.
const NAV_LABELS = ["Oferta", "Realizacje", "Proces", "O mnie", "FAQ"];
// Built by the webServer command with E2E_FIXTURES=none (playwright.config.ts);
// the pages are in client/, next to the Node adapter's server/.
const NO_CASE_STUDIES = fileURLToPath(
  new URL("../../dist-no-case-studies/client/", import.meta.url)
);

interface LinkedEntry {
  company: string;
  href: string;
}

// The experience list sits in "O mnie", in a closed accordion.
async function openExperience(page: Page): Promise<void> {
  await page
    .locator("#about summary", { hasText: "Pełne doświadczenie" })
    .click();
}

async function linkedEntries(page: Page): Promise<LinkedEntry[]> {
  await page.goto("/");
  await openExperience(page);
  return page
    .locator("#about .mb-card")
    .filter({ has: page.locator("a.mb-link-case") })
    .evaluateAll((cards) =>
      cards.map((card) => ({
        company: card.querySelector("h3")?.textContent?.trim() ?? "",
        href: card.querySelector("a.mb-link-case")?.getAttribute("href") ?? "",
      }))
    );
}

test.describe("case studies", () => {
  test("an entry in the full experience list leads to its case study page", async ({
    page,
  }) => {
    const entries = await linkedEntries(page);
    expect(entries.length).toBeGreaterThan(0);

    for (const { company, href } of entries) {
      expect(href).toMatch(CASE_STUDY_PATH);

      // biome-ignore lint/performance/noAwaitInLoops: one page, one entry at a time
      await page.goto("/");
      await openExperience(page);
      const card = page
        .locator("#about .mb-card")
        .filter({ has: page.locator("h3", { hasText: company }) });
      // Screen readers get the company in the link name, not five
      // identical "Zobacz realizację".
      const link = card.getByRole("link", {
        name: `Zobacz realizację - ${company}`,
      });
      await expect(link).toHaveCount(1);

      await link.click();
      await expect(page).toHaveURL(href);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(company);
    }
  });

  test("a case study page has SEO meta and no WCAG 2.1 AA violations", async ({
    page,
  }) => {
    const entries = await linkedEntries(page);
    expect(entries.length).toBeGreaterThan(0);

    for (const { company, href } of entries) {
      // biome-ignore lint/performance/noAwaitInLoops: one page, one entry at a time
      await page.goto(href);

      await expect(page).toHaveTitle(`${company} - realizacja - Kacper Adler`);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        "href",
        `${SITE}${href}`
      );
      const description = await page
        .locator('meta[name="description"]')
        .getAttribute("content");
      await expect(page.locator(".mb-section-lede")).toHaveText(
        description ?? ""
      );
      await expect(page.locator(".mb-case-stack li").first()).toBeVisible();
      await expect(page.locator(".mb-prose")).not.toBeEmpty();

      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();
      expect(results.violations).toEqual([]);
    }
  });

  test("every case study is in the sitemap and in llms.txt", async ({
    page,
    request,
  }) => {
    const entries = await linkedEntries(page);
    expect(entries.length).toBeGreaterThan(0);

    const sitemap = await (await request.get("/sitemap-0.xml")).text();
    const llms = await (await request.get("/llms.txt")).text();
    const llmsFull = await (await request.get("/llms-full.txt")).text();
    for (const { company, href } of entries) {
      expect(sitemap).toContain(`<loc>${SITE}${href}</loc>`);
      expect(llms).toContain(`[${company}](${SITE}${href})`);
      expect(llmsFull).toContain(`**Strona**: ${SITE}${href}`);
    }
  });

  test("Realizacje in the menu leads to #cases, whose Wszystkie realizacje opens the list of every case study", async ({
    page,
  }) => {
    const entries = await linkedEntries(page);
    expect(entries.length).toBeGreaterThan(0);

    await expect(page.locator(".mb-nav-links [data-nav-link]")).toHaveText(
      NAV_LABELS
    );
    await page
      .locator(".mb-nav-links")
      .getByRole("link", { exact: true, name: "Realizacje" })
      .click();
    await expect(page).toHaveURL("/#cases");
    await page
      .locator("#cases")
      .getByRole("link", { name: "Wszystkie realizacje" })
      .click();
    await expect(page).toHaveURL(LIST_PATH);

    await expect(page).toHaveTitle("Realizacje - Kacper Adler");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      `${SITE}${LIST_PATH}`
    );
    const cards = page.locator(".mb-case-cell");
    await expect(cards).toHaveCount(entries.length);
    for (const { company, href } of entries) {
      const card = cards.filter({
        has: page.getByRole("heading", { exact: true, name: company }),
      });
      // biome-ignore lint/performance/noAwaitInLoops: one card at a time
      await expect(card.locator(".mb-case-role")).not.toBeEmpty();
      await expect(card.locator(".mb-case-period")).not.toBeEmpty();
      await expect(card.locator(".mb-case-summary")).not.toBeEmpty();
      await expect(
        card.getByRole("link", { name: `Zobacz realizację - ${company}` })
      ).toHaveAttribute("href", href);
    }

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    expect(results.violations).toEqual([]);

    // Section links lead back to the home page sections from here.
    await page
      .locator(".mb-nav-links")
      .getByRole("link", { name: "O mnie" })
      .click();
    await expect(page).toHaveURL("/#about");
  });

  test("the mobile menu has Realizacje and it leads to #cases", async ({
    page,
  }) => {
    await page.setViewportSize({ height: 812, width: 375 });
    await page.goto("/");
    await page.locator("[data-menu-open]").click();

    const sheetLinks = page.locator("#mobile-sheet .mb-sheet-link");
    await expect(sheetLinks).toHaveText(NAV_LABELS);
    await sheetLinks.filter({ hasText: "Realizacje" }).click();
    await expect(page).toHaveURL("/#cases");
  });

  test("a case study page leads back to the list", async ({ page }) => {
    const [entry] = await linkedEntries(page);
    await page.goto(entry?.href ?? LIST_PATH);
    await page
      .locator(".mb-case-foot")
      .getByRole("link", { name: "Wszystkie realizacje" })
      .click();
    await expect(page).toHaveURL(LIST_PATH);
  });

  test("the list page is in the sitemap and in llms.txt", async ({
    request,
  }) => {
    const sitemap = await (await request.get("/sitemap-0.xml")).text();
    const llms = await (await request.get("/llms.txt")).text();
    const llmsFull = await (await request.get("/llms-full.txt")).text();
    expect(sitemap).toContain(`<loc>${SITE}${LIST_PATH}</loc>`);
    expect(llms).toContain(`Lista: ${SITE}${LIST_PATH}`);
    expect(llmsFull).toContain(`Lista: ${SITE}${LIST_PATH}`);
  });
});

test.describe("no case studies", () => {
  test("builds no list page, and #cases links neither it nor a case study", async ({
    page,
  }) => {
    const file = (path: string) => `${NO_CASE_STUDIES}${path}`;
    expect(existsSync(file("index.html"))).toBe(true);
    expect(existsSync(file("realizacje"))).toBe(false);

    const sitemap = readFileSync(file("sitemap-0.xml"), "utf8");
    expect(sitemap).not.toContain("/realizacje/");
    for (const llms of ["llms.txt", "llms-full.txt"]) {
      expect(readFileSync(file(llms), "utf8")).not.toContain("Realizacje");
    }

    // The built HTML read straight from disk: the menus as rendered.
    await page.goto(pathToFileURL(file("index.html")).href);
    await expect(page.locator(".mb-nav-links [data-nav-link]")).toHaveText(
      NAV_LABELS
    );
    await expect(
      page.locator(".mb-nav-links [data-nav-link]", { hasText: "Realizacje" })
    ).toHaveAttribute("href", "/#cases");
    await expect(page.locator("#mobile-sheet .mb-sheet-link")).toHaveText(
      NAV_LABELS
    );
    await expect(page.locator("#cases .mb-card").first()).toBeAttached();
    // Nothing leads to /realizacje/: not the list, not a case study (the
    // hero's "Zobacz realizacje" goes to #cases on the page).
    await expect(page.locator('a[href^="/realizacje/"]')).toHaveCount(0);
  });
});
