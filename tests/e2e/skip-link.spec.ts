import { expect, test } from "@playwright/test";

const HASH_TOP = /#top$/;

test.describe("skip-to-content link", () => {
  test("first Tab focuses the skip link and reveals it", async ({ page }) => {
    await page.goto("/");

    await page.keyboard.press("Tab");

    const skipLink = page.locator(".skip-link");
    await expect(skipLink).toBeFocused();

    // Reveal is via transform: translateY(0); poll because the transition
    // (0.18s) may still be in flight when the focus event resolves.
    await expect
      .poll(async () => {
        const box = await skipLink.boundingBox();
        return box?.y ?? -1;
      })
      .toBeGreaterThanOrEqual(0);
  });

  test("activating the skip link points the browser at #top", async ({
    page,
  }) => {
    await page.goto("/");

    await page.keyboard.press("Tab");
    await page.keyboard.press("Enter");

    await expect(page).toHaveURL(HASH_TOP);
  });
});
