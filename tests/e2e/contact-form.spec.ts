import { expect, test } from "@playwright/test";

const ANY_VALUE = /.*/;

test.describe("contact form", () => {
  test("empty submit marks all fields invalid", async ({ page }) => {
    await page.goto("/#contact");

    await page.click("[data-contact-form] [data-submit]");

    await expect(
      page.locator('[data-contact-form] [data-field="email"]')
    ).toHaveAttribute("data-invalid", "true");
    await expect(
      page.locator('[data-contact-form] [data-field="type"]')
    ).toHaveAttribute("data-invalid", "true");
    await expect(
      page.locator('[data-contact-form] [data-field="message"]')
    ).toHaveAttribute("data-invalid", "true");

    await expect(
      page.locator("[data-contact-form] [data-submit]")
    ).toHaveAttribute("data-state", "error");
  });

  test("invalid email is flagged, valid email clears on input", async ({
    page,
  }) => {
    await page.goto("/#contact");

    await page.fill('[data-contact-form] input[name="email"]', "not-an-email");
    await page
      .locator('[data-contact-form] input[name="type"][value="webapp"]')
      .check({ force: true });
    await page.fill(
      '[data-contact-form] textarea[name="message"]',
      "Test message"
    );

    await page.click("[data-contact-form] [data-submit]");
    await expect(
      page.locator('[data-contact-form] [data-field="email"]')
    ).toHaveAttribute("data-invalid", "true");

    await page.fill(
      '[data-contact-form] input[name="email"]',
      "kacper@example.com"
    );
    await expect(
      page.locator('[data-contact-form] [data-field="email"]')
    ).not.toHaveAttribute("data-invalid", ANY_VALUE);
  });

  test("valid submit transitions through submitting → success", async ({
    page,
  }) => {
    const consoleMessages: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "info") {
        consoleMessages.push(msg.text());
      }
    });

    await page.goto("/#contact");
    // Let ClientRouter settle so the astro:page-load resetForm hook
    // doesn't race the setTimeout in contact-form.ts.
    await page.waitForLoadState("networkidle");

    await page.fill(
      '[data-contact-form] input[name="email"]',
      "kacper@example.com"
    );
    await page
      .locator('[data-contact-form] input[name="type"][value="landing"]')
      .check({ force: true });
    await page.fill(
      '[data-contact-form] textarea[name="message"]',
      "Chciałbym landing page dla nowego produktu."
    );

    await page.click("[data-contact-form] [data-submit]");

    const submit = page.locator("[data-contact-form] [data-submit]");
    await expect(submit).toHaveAttribute("data-state", "success");

    await expect(
      page.locator("[data-contact-form] [data-form-success]")
    ).toHaveAttribute("data-show", "true");

    expect(consoleMessages.some((m) => m.includes("[contact]"))).toBe(true);
  });
});
