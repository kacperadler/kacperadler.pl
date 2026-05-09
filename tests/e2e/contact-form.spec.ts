import type { Page } from "@playwright/test";
import { expect, test } from "@playwright/test";

const ANY_VALUE = /.*/;
const NOCODB_FORM_URL = "**/api/v1/db/public/shared-view/**/rows";
const MULTIPART_RX = /^multipart\/form-data/;

interface TrackedEvent {
  data?: Record<string, unknown>;
  name: string;
}

// Stub window.umami before any page script runs and capture every
// track() call into window.__trackedEvents. Tests read it via
// readUmamiCalls() to assert on what was tracked.
async function stubUmami(page: Page): Promise<void> {
  await page.addInitScript(() => {
    const tracked: TrackedEvent[] = [];
    (window as unknown as { __trackedEvents: TrackedEvent[] }).__trackedEvents =
      tracked;
    window.umami = {
      track: (name: string, data?: Record<string, unknown>) => {
        tracked.push({ name, data });
      },
    };
  });
}

function readUmamiCalls(page: Page): Promise<TrackedEvent[]> {
  return page.evaluate(
    () =>
      (window as unknown as { __trackedEvents: TrackedEvent[] }).__trackedEvents
  );
}

test.describe("contact form", () => {
  test("empty submit marks all fields invalid", async ({ page }) => {
    await stubUmami(page);
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

    // Wrapper enters validation-error so the form stays visible and
    // the inline field errors do the talking; the submit-error banner
    // must NOT appear for client-side validation failures.
    await expect(page.locator("[data-contact-wrap]")).toHaveAttribute(
      "data-state",
      "error-validation"
    );
    await expect(
      page.locator("[data-contact-form] [data-submit]")
    ).toHaveAttribute("data-state", "error");
    await expect(
      page.locator("[data-contact-form] [data-form-error]")
    ).toBeHidden();

    // Validation errors are silent - we don't want noise in Umami
    // every time someone clicks submit on an empty form.
    expect(await readUmamiCalls(page)).toEqual([]);
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

  test("valid submit hides the form and shows the success card", async ({
    page,
  }) => {
    // Intercept the NocoDB POST so the test never hits the live
    // shared-view endpoint, and capture the body to assert that the
    // request goes out as multipart/form-data with a single "data"
    // part whose value is a JSON string of the row fields - NocoDB
    // rejects anything else.
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

    await stubUmami(page);
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

    // Wrapper flips to success → form node is hidden, success card
    // (with its reset button) takes over.
    await expect(page.locator("[data-contact-wrap]")).toHaveAttribute(
      "data-state",
      "success"
    );
    await expect(page.locator("[data-contact-form]")).toBeHidden();
    await expect(page.locator("[data-form-success]")).toBeVisible();
    await expect(page.locator("[data-form-reset]")).toBeVisible();

    // Umami event fires on success with the project type so the
    // dashboard can break submissions down by category.
    expect(await readUmamiCalls(page)).toEqual([
      { name: "form-submit", data: { type: "landing" } },
    ]);

    expect(capturedContentType).toMatch(MULTIPART_RX);
    expect(capturedBody).toContain('name="data"');
    expect(capturedBody).toContain('"Email":"kacper@example.com"');
    expect(capturedBody).toContain('"Type":"landing"');
    expect(capturedBody).toContain(
      '"Message":"Chciałbym landing page dla nowego produktu."'
    );
  });

  test("reset button on success card brings the form back empty", async ({
    page,
  }) => {
    await page.route(NOCODB_FORM_URL, (route) =>
      route.fulfill({ status: 200, body: "{}" })
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
      "Pierwsza wiadomość"
    );

    await page.click("[data-contact-form] [data-submit]");
    await expect(page.locator("[data-form-success]")).toBeVisible();

    await page.click("[data-form-reset]");

    // Wrapper back to idle, form visible again, fields cleared so the
    // user can compose a fresh message.
    await expect(page.locator("[data-contact-wrap]")).toHaveAttribute(
      "data-state",
      "idle"
    );
    await expect(page.locator("[data-contact-form]")).toBeVisible();
    await expect(page.locator("[data-form-success]")).toBeHidden();
    await expect(
      page.locator('[data-contact-form] input[name="email"]')
    ).toHaveValue("");
    await expect(
      page.locator('[data-contact-form] textarea[name="message"]')
    ).toHaveValue("");
  });

  test("upstream failure shows the inline error banner", async ({ page }) => {
    await page.route(NOCODB_FORM_URL, (route) =>
      route.fulfill({ status: 500, body: "boom" })
    );

    await stubUmami(page);
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

    // Form stays visible (so the user keeps what they wrote), the
    // banner appears, and the success card is NOT shown.
    await expect(page.locator("[data-contact-wrap]")).toHaveAttribute(
      "data-state",
      "error-submit"
    );
    await expect(page.locator("[data-contact-form]")).toBeVisible();
    await expect(
      page.locator("[data-contact-form] [data-form-error]")
    ).toBeVisible();
    await expect(page.locator("[data-form-success]")).toBeHidden();
    // Field values must survive the failure - the user gets to retry
    // without retyping.
    await expect(
      page.locator('[data-contact-form] input[name="email"]')
    ).toHaveValue("kacper@example.com");

    // form-error event fires too, so the Umami dashboard surfaces
    // upstream failures as a separate signal from successful submits.
    expect(await readUmamiCalls(page)).toEqual([
      { name: "form-error", data: { type: "webapp" } },
    ]);
  });

  test("honeypot fill silently drops the request and shows success", async ({
    page,
  }) => {
    let nocodbHit = false;
    await page.route(NOCODB_FORM_URL, async (route) => {
      nocodbHit = true;
      await route.fulfill({ status: 200, body: "{}" });
    });

    await stubUmami(page);
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

    // Bot sees the same success view a human would.
    await expect(page.locator("[data-contact-wrap]")).toHaveAttribute(
      "data-state",
      "success"
    );

    // The submit handler must short-circuit before fetch - otherwise
    // bots learn that filling the honeypot still works.
    expect(nocodbHit).toBe(false);

    // form-honeypot event lets the Umami dashboard show how much bot
    // traffic is hitting the form without inflating form-submit.
    expect(await readUmamiCalls(page)).toEqual([{ name: "form-honeypot" }]);
  });
});
