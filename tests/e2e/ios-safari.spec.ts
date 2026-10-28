import { expect, test } from "@playwright/test";

// What iOS Safari does and Chromium does not (KA0108): it zooms the page into
// a focused field whose text is under 16px, inflates text after a turn to
// landscape unless the root sets -webkit-text-size-adjust, and its 100vh is
// the height with the toolbar hidden. Chromium shows none of it, so these
// specs pin the conditions that keep Safari from doing it.

// Every field a visitor types into, on the pages that have one: the contact
// form (email, company, message) and the pagination "go to page" field
// (/lista/, the e2e fixture). The honeypot sits under aria-hidden, out of
// reach.
const FIELDS =
  'input:not([type="checkbox"], [type="radio"], [type="hidden"]), textarea, select';
const PAGES = [
  { fields: 3, path: "/" },
  { fields: 1, path: "/lista/" },
];

// The 404's min-height: the small viewport, no other viewport unit.
const SMALL_VIEWPORT = /\b100svh\b/;
const OTHER_VIEWPORT = /\d[ld]?vh\b/;

test.describe("iOS Safari", () => {
  // max(16px, 1rem): never under 16px, and the root font when it is larger.
  test("no field's text is under 16px, so a tap does not zoom the page", async ({
    page,
  }) => {
    const cases = [360, 1440].flatMap((width) =>
      PAGES.flatMap((entry) =>
        [12, 16, 20].map((root) => ({ ...entry, root, width }))
      )
    );
    for (const { fields, path, root, width } of cases) {
      // biome-ignore lint/performance/noAwaitInLoops: one page at a time
      await page.setViewportSize({ height: 900, width });
      await page.goto(path);
      await page.evaluate((px) => {
        document.documentElement.style.fontSize = `${px}px`;
      }, root);
      const sizes = await page.locator(FIELDS).evaluateAll((all) =>
        all
          .filter((field) => !field.closest('[aria-hidden="true"]'))
          .map((field) => ({
            field: `${field.tagName.toLowerCase()}#${field.id}`,
            size: getComputedStyle(field).fontSize,
          }))
      );
      const at = `${path} at ${width}px, root ${root}px`;
      expect(sizes.length, at).toBe(fields);
      for (const { field, size } of sizes) {
        expect(size, `${at}: ${field}`).toBe(`${Math.max(16, root)}px`);
      }
    }
  });

  test("text keeps its size after a turn to landscape", async ({ page }) => {
    for (const path of ["/", "/this-route-does-not-exist"]) {
      // biome-ignore lint/performance/noAwaitInLoops: one page at a time
      await page.goto(path);
      const adjust = await page.evaluate(() =>
        getComputedStyle(document.documentElement).getPropertyValue(
          "-webkit-text-size-adjust"
        )
      );
      expect(adjust, path).toBe("100%");
    }
  });

  // Chromium has no toolbar, so its svh and vh are one height: the layout
  // shows the 404 sized to the viewport, the rule shows which viewport.
  test("the 404 sizes to the visible screen, not the toolbar-hidden one", async ({
    page,
  }) => {
    await page.setViewportSize({ height: 800, width: 390 });
    await page.goto("/this-route-does-not-exist");
    const main = page.locator("main.mb-not-found");
    await expect(main).toHaveCSS("min-height", "560px");
    const minHeights = await page.evaluate(() =>
      [...document.styleSheets]
        .flatMap((sheet) => [...sheet.cssRules])
        .filter(
          (rule): rule is CSSStyleRule =>
            rule instanceof CSSStyleRule &&
            rule.selectorText.startsWith(".mb-not-found") &&
            rule.style.minHeight !== ""
        )
        .map((rule) => rule.style.minHeight)
    );
    // Chromium serialises the calc as it likes ("calc(-240px + 100svh)").
    expect(minHeights).toHaveLength(1);
    expect(minHeights[0]).toMatch(SMALL_VIEWPORT);
    expect(minHeights[0]).not.toMatch(OTHER_VIEWPORT);
  });
});
