import { expect, test } from "@playwright/test";

const HASH_TOP = /#top$/;

test.describe("skip-to-content link", () => {
  test("first Tab focuses the skip link and reveals it", async ({ page }) => {
    await page.goto("/");

    const skipLink = page.locator(".skip-link");

    // Before focus the link must sit off-screen (transform translateY)
    // so sighted users don't see it floating above the page. Without
    // this pre-assertion the test would also pass for a broken design
    // where the skip link is always visible.
    const boxBefore = await skipLink.boundingBox();
    expect(boxBefore?.y ?? 0).toBeLessThan(0);

    await page.keyboard.press("Tab");
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
