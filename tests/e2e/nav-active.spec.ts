import { expect, test } from "@playwright/test";

const ACTIVE_CLASS = /active/;
const HASH_HOW = /#how$/;

test.describe("nav active section", () => {
  test("scrolling into a section activates its link", async ({ page }) => {
    await page.goto("/");

    const servicesLink = page.locator('[data-nav-link][href="/#services"]');
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

    await page.click('[data-nav-link][href="/#how"]');

    await expect(page).toHaveURL(HASH_HOW);
    const howLink = page.locator('[data-nav-link][href="/#how"]');
    await expect(howLink).toHaveClass(ACTIVE_CLASS);
  });

  // A menu link parks its section 8px under the sticky header: the
  // dimension line with its ticks (6px above it) and the "§ … / Realizacje"
  // label show, not hidden behind it. Below 360px the header takes two rows;
  // at every width its height is the token the scroll padding reads, filled
  // by its row(s) with no empty band under them.
  for (const width of [1440, 390, 350, 320]) {
    test(`a menu link lands #cases just under the header at ${width}px`, async ({
      page,
    }) => {
      await page.setViewportSize({ height: 800, width });
      await page.goto("/");

      if (width > 880) {
        await page.click('[data-nav-link][href="/#cases"]');
      } else {
        await page.click("[data-menu-open]");
        await page.click('[data-sheet-link][href="/#cases"]');
      }

      // Polled: the scroll is smooth and the header may still be coming
      // down from the entrance, so both travel before they rest.
      const below = () =>
        page.evaluate(() => {
          const header = document.querySelector(".mb-header");
          const rect = header?.getBoundingClientRect();
          const bottom = rect?.bottom ?? 0;
          const top = (selector: string) =>
            (document.querySelector(selector)?.getBoundingClientRect().top ??
              0) - bottom;
          return {
            // The header's height less its nav's and its 1px rule.
            empty:
              (rect?.height ?? 0) -
              1 -
              (header?.querySelector(".mb-nav")?.getBoundingClientRect()
                .height ?? 0),
            section: top("#cases"),
            ticks: top("#cases .mb-section-head") - 6,
          };
        });
      await expect
        .poll(async () => Math.abs((await below()).section - 8))
        .toBeLessThanOrEqual(1);
      const landed = await below();
      expect(landed.ticks).toBeGreaterThanOrEqual(0);
      expect(landed.empty).toBeGreaterThanOrEqual(0);
      expect(landed.empty).toBeLessThan(1);
    });
  }
});
