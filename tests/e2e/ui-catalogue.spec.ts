import AxeBuilder from "@axe-core/playwright";
import { expect, type Locator, type Page, test } from "@playwright/test";

// The catalogue exists only on `astro dev`; playwright.config.ts starts one
// for this tree and passes its port in E2E_DEV_PORT.
const DEV_URL = `http://localhost:${process.env.E2E_DEV_PORT}`;

const SECTIONS = [
  "Przycisk",
  "Link",
  "Badge i tag",
  "Status pill",
  "Karta",
  "Pola formularza",
  "Nagłówek sekcji",
  "Typografia",
];

// Computed paint of an element (and its ::before / ::after) for the given
// properties - what a forced state has to match.
const paint = (locator: Locator, props: string[], pseudo?: string) =>
  locator.evaluate(
    (el, [p, ps]) => {
      const style = getComputedStyle(el, ps ?? null);
      return Object.fromEntries(
        (p as string[]).map((name) => [name, style.getPropertyValue(name)])
      );
    },
    [props, pseudo] as const
  );

const sample = (page: Page, sectionId: string, caption: string) =>
  page
    .locator(`section[aria-labelledby="${sectionId}"] .ui-sample`)
    .filter({ has: page.locator(".ui-caption", { hasText: caption }) });

test.describe("component catalogue (astro dev)", () => {
  test.use({
    baseURL: DEV_URL,
    contextOptions: { reducedMotion: "reduce" },
  });

  test.beforeEach(async ({ page }) => {
    await page.goto("/ui", { waitUntil: "networkidle" });
  });

  test("lists every component under its own heading", async ({ page }) => {
    await expect(
      page.getByRole("heading", { level: 1, name: "Katalog komponentów" })
    ).toBeVisible();
    await Promise.all(
      SECTIONS.map((name) =>
        expect(
          page.getByRole("heading", { exact: true, level: 2, name })
        ).toBeVisible()
      )
    );
  });

  test("has no detectable WCAG 2.1 AA violations", async ({ page }) => {
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .exclude("astro-dev-toolbar")
      .analyze();

    expect(results.violations).toEqual([]);
  });

  test("a forced hover paints like a real one", async ({ page }) => {
    const props = ["background-color", "box-shadow", "color"];
    const buttons = page
      .locator('section[aria-labelledby="ui-button"] .ui-row')
      .first();
    const forced = buttons.locator('.btn[data-state="hover"]');
    const idle = buttons.locator(".ui-sample").first().locator(".btn");

    const forcedPaint = await paint(forced, props);
    expect(forcedPaint).not.toEqual(await paint(idle, props));
    await idle.hover();
    expect(await paint(idle, props)).toEqual(forcedPaint);
  });

  test("a forced card hover lights the card, its spotlight and its badge", async ({
    page,
  }) => {
    const idle = page.locator('.v2-card:not([data-state="hover"])').first();
    const forced = page.locator('.v2-card[data-state="hover"]');
    const card = ["background-color", "border-color", "backdrop-filter"];
    const badge = ["background-color", "color"];

    const forcedCard = await paint(forced, card);
    const forcedRing = await paint(forced, ["opacity"], "::after");
    const forcedBadge = await paint(forced.locator(".badge"), badge);
    expect(forcedRing.opacity).toBe("1");

    await idle.hover();
    expect(await paint(idle, card)).toEqual(forcedCard);
    expect(await paint(idle, ["opacity"], "::after")).toEqual(forcedRing);
    expect(await paint(idle.locator(".badge"), badge)).toEqual(forcedBadge);
  });

  test("a forced focus paints like a real one", async ({ page }) => {
    const props = ["border-color", "box-shadow"];
    const forced = sample(page, "ui-form", "focus").locator(".v2-input");
    const empty = sample(page, "ui-form", "empty").locator(".v2-input");

    const forcedPaint = await paint(forced, props);
    expect(forcedPaint).not.toEqual(await paint(empty, props));
    await empty.focus();
    expect(await paint(empty, props)).toEqual(forcedPaint);
  });

  test("the error state shows the message and the error border", async ({
    page,
  }) => {
    const error = sample(page, "ui-form", "error").first();
    await expect(error.locator(".err")).toBeVisible();
    await expect(error.locator(".v2-input")).toHaveCSS(
      "border-color",
      "rgb(224, 122, 112)"
    );
  });

  test("the typography block follows the port, not the site's .prose", async ({
    page,
  }) => {
    // global.css styles .prose for the legal pages (h2 weight 500, a boxed
    // inline code); prose.css has to win on /ui.
    const prose = page.locator("article.prose");
    await expect(prose.locator("h2")).toHaveCSS("font-weight", "700");
    await expect(prose.locator("p code")).toHaveCSS(
      "background-color",
      "rgba(0, 0, 0, 0)"
    );
  });
});

test.describe("production build", () => {
  test("has no /ui page", async ({ request }) => {
    const statuses = await Promise.all(
      ["/ui", "/ui/"].map(async (path) => (await request.get(path)).status())
    );
    expect(statuses).toEqual([404, 404]);
  });

  test("neither the sitemap nor the home page points to /ui", async ({
    page,
    request,
  }) => {
    const sitemap = await (await request.get("/sitemap-0.xml")).text();
    expect(sitemap).toContain("<loc>");
    expect(sitemap).not.toContain("/ui");

    await page.goto("/");
    await expect(page.locator('a[href^="/ui"]')).toHaveCount(0);
  });
});
