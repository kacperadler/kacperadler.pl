import { expect, test } from "@playwright/test";

const ANY_VALUE = /.*/;
const NOCODB_FORM_URL = "**/api/v1/db/public/shared-view/**/rows";
const MULTIPART_RX = /^multipart\/form-data/;

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
    // shared-view endpoint, and capture the body to assert that the
    // request goes out as multipart/form-data with the expected field
    // names + values - NocoDB rejects anything that's not multipart.
    let capturedBody = "";
    let capturedContentType: string | null = null;
    await page.route(NOCODB_FORM_URL, async (route) => {
      capturedBody = route.request().postData() ?? "";
      capturedContentType = route.request().headers()["content-type"] ?? null;
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

    // multipart/form-data with PascalCase column names + values must
    // appear in the body. NocoDB rejects JSON outright.
    expect(capturedContentType).toMatch(MULTIPART_RX);
    expect(capturedBody).toContain('name="Email"');
    expect(capturedBody).toContain("kacper@example.com");
    expect(capturedBody).toContain('name="Type"');
    expect(capturedBody).toContain("landing");
    expect(capturedBody).toContain('name="Message"');
    expect(capturedBody).toContain(
      "Chciałbym landing page dla nowego produktu."
    );
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
