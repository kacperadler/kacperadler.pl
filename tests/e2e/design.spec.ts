import { expect, test } from "@playwright/test";

// Minimal brutalism on every production page (KA0069): square corners, no
// glass, no drifting ribbons over a dot grid - nothing of the old style.
const PAGES = [
  "/",
  "/polityka-prywatnosci/",
  "/regulamin/",
  "/realizacje/",
  "/this-route-does-not-exist",
];

test.describe("minimal brutalism", () => {
  test("no page has a rounded corner, glass or the old atmosphere", async ({
    page,
  }) => {
    await page.goto("/realizacje/");
    const cases = await page
      .locator("#top a[href^='/realizacje/']")
      .evaluateAll((links) =>
        links.map((link) => link.getAttribute("href") ?? "")
      );
    expect(cases.length).toBeGreaterThan(0);

    for (const path of [...PAGES, ...cases]) {
      // biome-ignore lint/performance/noAwaitInLoops: one page at a time
      await page.goto(path, { waitUntil: "domcontentloaded" });
      // Elements that paint nothing (the hidden native radio under a choice
      // chip, opacity 0) keep their UA corners; only what shows counts.
      const offenders = await page.evaluate(() =>
        [...document.querySelectorAll("body *")]
          .filter((el) => {
            const style = getComputedStyle(el);
            return (
              el.checkVisibility({ opacityProperty: true }) &&
              (style.borderTopLeftRadius !== "0px" ||
                style.borderBottomRightRadius !== "0px" ||
                style.backdropFilter !== "none" ||
                style.backgroundImage.includes("radial-gradient"))
            );
          })
          .map((el) => `${el.tagName.toLowerCase()}.${el.className}`)
      );
      expect(offenders, path).toEqual([]);
    }
  });
});
