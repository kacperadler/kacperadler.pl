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

  test("contact form error states have no detectable WCAG 2.1 AA violations", async ({
    page,
  }) => {
    // Measured on the idle form: hover or a focused field turns the host into
    // translucent glass. Even idle, axe files the error lines as "incomplete"
    // (the host's spotlight pseudos cover them), so the contrast is also
    // computed directly below.
    const axe = async () => {
      await page.evaluate(() => (document.activeElement as HTMLElement).blur());
      await page.mouse.move(0, 0);
      return new AxeBuilder({ page })
        .include(".contact-form-host")
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();
    };
    await page.route("**/api/v1/db/public/shared-view/**/rows", (route) =>
      route.fulfill({ body: "boom", status: 500 })
    );
    await page.goto("/#contact");
    await page.waitForLoadState("networkidle");
    const wrap = page.locator("[data-contact-wrap]");

    // Empty submit: every field invalid, error lines and red borders shown.
    await page.click("[data-contact-form] [data-submit]");
    await expect(wrap).toHaveAttribute("data-state", "error-validation");
    expect((await axe()).violations).toEqual([]);

    // WCAG AA: error text 4.5:1, invalid border 3:1, on the form surface.
    const ratios = await page.evaluate(() => {
      const luminance = (color: string) => {
        const [r = 0, g = 0, b = 0] = (color.match(/\d+(\.\d+)?/g) ?? []).map(
          (c) => {
            const s = Number(c) / 255;
            return s <= 0.040_45 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
          }
        );
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
      };
      const contrast = (a: string, b: string) => {
        const la = luminance(a);
        const lb = luminance(b);
        return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
      };
      const css = (selector: string) =>
        getComputedStyle(document.querySelector(selector) as Element);
      const surface = css("[data-contact-form]").backgroundColor;
      return {
        border: contrast(css(".v2-input").borderTopColor, surface),
        text: contrast(css(".field .err").color, surface),
      };
    });
    expect(ratios.text).toBeGreaterThanOrEqual(4.5);
    expect(ratios.border).toBeGreaterThanOrEqual(3);

    // Valid submit the server refuses: the send-error banner.
    await page.fill('[data-contact-form] input[name="email"]', "a@example.com");
    await page.locator("[data-contact-form] label.radio").first().click();
    await page.fill('[data-contact-form] textarea[name="message"]', "Treść");
    await page.click("[data-contact-form] [data-submit]");
    await expect(wrap).toHaveAttribute("data-state", "error-submit");
    expect((await axe()).violations).toEqual([]);
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
