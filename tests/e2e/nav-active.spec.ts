import { expect, test } from "@playwright/test";

const ACTIVE_CLASS = /active/;
const HASH_HOW = /#how$/;

test.describe("nav active section", () => {
  test("scrolling into a section activates its link", async ({ page }) => {
    await page.goto("/");

    const servicesLink = page.locator('[data-nav-link][href="#services"]');
    await page.locator("#services").scrollIntoViewIfNeeded();

    await expect(servicesLink).toHaveClass(ACTIVE_CLASS);
    await expect(servicesLink).toHaveAttribute("aria-current", "location");
  });

  test("scrolling to contact activates the CTA, not the primary links", async ({
    page,
  }) => {
    await page.goto("/");

    await page.locator("#contact").scrollIntoViewIfNeeded();

    const cta = page.locator("[data-nav-cta]");
    await expect(cta).toHaveClass(ACTIVE_CLASS);
    await expect(cta).toHaveAttribute("aria-current", "location");

    const activePrimary = page.locator("[data-nav-link].active");
    await expect(activePrimary).toHaveCount(0);
  });

  test("primary link click scrolls and activates", async ({ page }) => {
    await page.goto("/");

    await page.click('[data-nav-link][href="#how"]');

    await expect(page).toHaveURL(HASH_HOW);
    const howLink = page.locator('[data-nav-link][href="#how"]');
    await expect(howLink).toHaveClass(ACTIVE_CLASS);
  });
});
