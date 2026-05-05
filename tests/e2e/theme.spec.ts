import { expect, test } from "@playwright/test";

const ANY_VALUE = /.*/;

test.describe("theme toggle", () => {
  test("light writes localStorage and html[data-theme]", async ({ page }) => {
    await page.goto("/");

    await page.click('[data-theme-mode="light"]');

    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
    await expect(page.locator('[data-theme-mode="light"]')).toHaveAttribute(
      "aria-pressed",
      "true"
    );

    const stored = await page.evaluate(() => localStorage.getItem("ka:theme"));
    expect(stored).toBe("light");
  });

  test("dark writes localStorage and html[data-theme]", async ({ page }) => {
    await page.goto("/");

    await page.click('[data-theme-mode="dark"]');

    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await expect(page.locator('[data-theme-mode="dark"]')).toHaveAttribute(
      "aria-pressed",
      "true"
    );

    const stored = await page.evaluate(() => localStorage.getItem("ka:theme"));
    expect(stored).toBe("dark");
  });

  test("system removes data-theme and clears storage", async ({ page }) => {
    await page.goto("/");

    await page.click('[data-theme-mode="dark"]');
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

    await page.click('[data-theme-mode="system"]');

    await expect(page.locator("html")).not.toHaveAttribute(
      "data-theme",
      ANY_VALUE
    );
    await expect(page.locator('[data-theme-mode="system"]')).toHaveAttribute(
      "aria-pressed",
      "true"
    );

    const stored = await page.evaluate(() => localStorage.getItem("ka:theme"));
    expect(stored).toBeNull();
  });

  test("forced theme persists across reload", async ({ page }) => {
    await page.goto("/");
    await page.click('[data-theme-mode="dark"]');
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

    await page.reload();

    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await expect(page.locator('[data-theme-mode="dark"]')).toHaveAttribute(
      "aria-pressed",
      "true"
    );
  });
});
