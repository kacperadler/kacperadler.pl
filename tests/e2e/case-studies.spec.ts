import AxeBuilder from "@axe-core/playwright";
import { expect, type Page, test } from "@playwright/test";

// The e2e build reads tests/fixtures/case-studies while src/content/case-studies
// is empty (E2E_FIXTURES=1, see src/content.config.ts), so these specs run on
// whatever case studies the build has rather than on the fixture's values.

test.use({ contextOptions: { reducedMotion: "reduce" } });

const SITE = "https://kacperadler.pl";
const CASE_STUDY_PATH = /^\/realizacje\/[a-z0-9-]+\/$/;

interface LinkedEntry {
  company: string;
  href: string;
}

async function linkedEntries(page: Page): Promise<LinkedEntry[]> {
  await page.goto("/");
  return page
    .locator("#experience .exp-panel")
    .filter({ has: page.locator("a.exp-link") })
    .evaluateAll((cards) =>
      cards.map((card) => ({
        company: card.querySelector("h3")?.textContent?.trim() ?? "",
        href: card.querySelector("a.exp-link")?.getAttribute("href") ?? "",
      }))
    );
}

test.describe("case studies", () => {
  test("an entry in Z kim pracowałem leads to its case study page", async ({
    page,
  }) => {
    const entries = await linkedEntries(page);
    expect(entries.length).toBeGreaterThan(0);

    for (const { company, href } of entries) {
      expect(href).toMatch(CASE_STUDY_PATH);

      // biome-ignore lint/performance/noAwaitInLoops: one page, one entry at a time
      await page.goto("/");
      const card = page
        .locator("#experience .exp-panel")
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
      await expect(page.locator(".case-lede")).toHaveText(description ?? "");
      await expect(page.locator(".case-stack li").first()).toBeVisible();
      await expect(page.locator(".prose")).not.toBeEmpty();

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
});
