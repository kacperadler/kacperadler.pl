import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

// reduce motion → reveal.ts applies `.in` immediately so axe sees the
// final, fully-opaque state instead of the pre-scroll faded-out one.
test.use({ contextOptions: { reducedMotion: "reduce" } });

test.describe("axe-core a11y", () => {
  test("home page has no detectable WCAG 2.1 AA violations", async ({
    page,
  }) => {
    await page.goto("/");

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    expect(results.violations).toEqual([]);
  });

  test("404 page has no detectable WCAG 2.1 AA violations", async ({
    page,
  }) => {
    await page.goto("/this-route-does-not-exist", {
      waitUntil: "domcontentloaded",
    });

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    expect(results.violations).toEqual([]);
  });
});
