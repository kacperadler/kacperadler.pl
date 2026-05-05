import { expect, test } from "@playwright/test";

// Mobile sheet only renders the hamburger below 880px - run these tests
// at a phone-sized viewport to make the trigger interactive.
test.use({ viewport: { width: 375, height: 812 } });

test.describe("mobile sheet", () => {
  test("hamburger opens sheet, X closes it", async ({ page }) => {
    await page.goto("/");

    const sheet = page.locator("#mobile-sheet");
    const trigger = page.locator("[data-menu-open]");

    await expect(sheet).toHaveAttribute("aria-hidden", "true");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");

    await trigger.click();

    await expect(sheet).toHaveAttribute("data-mobile-sheet", "open");
    await expect(sheet).toHaveAttribute("aria-hidden", "false");
    await expect(trigger).toHaveAttribute("aria-expanded", "true");

    await page.click("[data-menu-close]");

    await expect(sheet).toHaveAttribute("aria-hidden", "true");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  test("Escape closes the sheet and returns focus to trigger", async ({
    page,
  }) => {
    await page.goto("/");

    const sheet = page.locator("#mobile-sheet");
    const trigger = page.locator("[data-menu-open]");

    await trigger.click();
    await expect(sheet).toHaveAttribute("data-mobile-sheet", "open");

    await page.keyboard.press("Escape");

    await expect(sheet).toHaveAttribute("aria-hidden", "true");
    await expect(trigger).toBeFocused();
  });

  test("clicking a sheet link auto-closes the sheet", async ({ page }) => {
    await page.goto("/");

    const sheet = page.locator("#mobile-sheet");
    const trigger = page.locator("[data-menu-open]");

    await trigger.click();
    await expect(sheet).toHaveAttribute("data-mobile-sheet", "open");

    await page.click('[data-sheet-link][href="#services"]');

    await expect(sheet).toHaveAttribute("aria-hidden", "true");
  });
});
