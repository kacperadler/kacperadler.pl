import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

// Mobile sheet only renders the hamburger below 880px - run these tests
// at a phone-sized viewport to make the trigger interactive.
test.use({ viewport: { height: 812, width: 375 } });

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

  test("open sheet takes focus, keeps Tab inside, and X returns it to the trigger", async ({
    page,
  }) => {
    await page.goto("/");

    const sheet = page.locator("#mobile-sheet");
    const trigger = page.locator("[data-menu-open]");
    const close = page.locator("[data-menu-close]");
    const frame = page.locator(".mb-frame");

    await trigger.click();

    await expect(close).toBeFocused();
    await expect(frame).toHaveJSProperty("inert", true);

    // One full lap forward: each press moves to the next control of the
    // sheet in DOM order, and the press after the last one wraps back to
    // the close button instead of leaving for the page.
    const controls = await sheet.locator("a[href], button").all();
    for (const control of [...controls.slice(1), close]) {
      // biome-ignore lint/performance/noAwaitInLoops: key presses must run in order
      await page.keyboard.press("Tab");
      await expect(control).toBeFocused();
    }

    // Shift+Tab from the first control wraps to the last one, not the page.
    await page.keyboard.press("Shift+Tab");
    await expect(sheet.locator(".mb-sheet-cta a")).toBeFocused();

    await close.click();

    await expect(trigger).toBeFocused();
    await expect(frame).toHaveJSProperty("inert", false);
  });

  test.describe("under reduced motion", () => {
    test.use({ contextOptions: { reducedMotion: "reduce" } });

    test("the open sheet still takes focus on its close button", async ({
      page,
    }) => {
      await page.goto("/");

      await page.locator("[data-menu-open]").click();

      await expect(page.locator("[data-menu-close]")).toBeFocused();
    });
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

    await page.click('[data-sheet-link][href="/#services"]');

    await expect(sheet).toHaveAttribute("aria-hidden", "true");
    await expect(trigger).toBeFocused();
    await expect(page.locator(".mb-frame")).toHaveJSProperty("inert", false);
  });

  test("open sheet is a dialog named 'Menu mobilne' with no axe violations", async ({
    page,
  }) => {
    await page.goto("/");

    await page.locator("[data-menu-open]").click();

    const dialog = page.getByRole("dialog", { name: "Menu mobilne" });
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveAttribute("aria-modal", "true");
    // Let the open transition finish so axe measures contrast on the final
    // paint: wait until the sheet has no running animation, not for a value.
    await dialog.evaluate((sheet) =>
      Promise.all(sheet.getAnimations().map((animation) => animation.finished))
    );

    const results = await new AxeBuilder({ page })
      .include("#mobile-sheet")
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    expect(results.violations).toEqual([]);
  });
});
