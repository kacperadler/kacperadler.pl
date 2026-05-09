import { expect, test } from "@playwright/test";

const ANY_VALUE = /.*/;
const NOCODB_FORM_URL = "**/api/v1/db/public/shared-view/**/rows";

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
    // Intercept the NocoDB POST so the test never hits the live
    // shared-view endpoint, and capture the body to assert on the
    // payload shape (PascalCase keys NocoDB requires).
    let captured: { Email?: string; Type?: string; Message?: string } | null =
      null;
    await page.route(NOCODB_FORM_URL, async (route) => {
      captured = route.request().postDataJSON();
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: '{"id":"test"}',
      });
    });

    await page.goto("/#contact");
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

    // Payload shape: NocoDB needs PascalCase keys matching its column
    // names. If the form ever drifts, this test catches it instantly.
    expect(captured).toEqual({
      Email: "kacper@example.com",
      Type: "landing",
      Message: "Chciałbym landing page dla nowego produktu.",
    });
  });

  test("upstream failure flips the form to error state", async ({ page }) => {
    await page.route(NOCODB_FORM_URL, (route) =>
      route.fulfill({ status: 500, body: "boom" })
    );

    await page.goto("/#contact");
    await page.waitForLoadState("networkidle");

    await page.fill(
      '[data-contact-form] input[name="email"]',
      "kacper@example.com"
    );
    await page
      .locator('[data-contact-form] input[name="type"][value="webapp"]')
      .check({ force: true });
    await page.fill(
      '[data-contact-form] textarea[name="message"]',
      "Server is down"
    );

    await page.click("[data-contact-form] [data-submit]");

    await expect(
      page.locator("[data-contact-form] [data-submit]")
    ).toHaveAttribute("data-state", "error");
  });

  test("honeypot fill silently drops the request and shows success", async ({
    page,
  }) => {
    let nocodbHit = false;
    await page.route(NOCODB_FORM_URL, async (route) => {
      nocodbHit = true;
      await route.fulfill({ status: 200, body: "{}" });
    });

    await page.goto("/#contact");
    await page.waitForLoadState("networkidle");

    await page.fill(
      '[data-contact-form] input[name="email"]',
      "bot@example.com"
    );
    await page
      .locator('[data-contact-form] input[name="type"][value="other"]')
      .check({ force: true });
    await page.fill(
      '[data-contact-form] textarea[name="message"]',
      "Buy our SEO services!"
    );
    // The bot tells on itself by filling the off-screen honeypot.
    await page
      .locator('[data-contact-form] input[name="website"]')
      .fill("http://spam.example", { force: true });

    await page.click("[data-contact-form] [data-submit]");

    await expect(
      page.locator("[data-contact-form] [data-submit]")
    ).toHaveAttribute("data-state", "success");

    // The submit handler must short-circuit before fetch - otherwise
    // bots learn that filling the honeypot still works.
    expect(nocodbHit).toBe(false);
  });
});
