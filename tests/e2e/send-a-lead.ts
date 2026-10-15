import type { Locator, Page } from "@playwright/test";

// The lead store scripts/contact-form.ts POSTs a lead to.
const LEAD_STORE = "**/api/lead";

// Fills one contact form with a valid lead, submits it the way a visitor
// does and returns how many requests reached the lead store (stubbed, so
// nothing leaves the test). A page that loads contact-form.ts sends one; a
// dev page must send none - its forms would land in the lead store and the
// notification.
export async function sendALead(page: Page, form: Locator): Promise<number> {
  let sent = 0;
  await page.route(LEAD_STORE, (route) => {
    sent += 1;
    return route.fulfill({ json: { ok: true }, status: 200 });
  });
  await form.locator('input[name="email"]').fill("lead@example.com");
  await form.locator("label.mb-choice").first().click();
  await form.locator('textarea[name="message"]').fill("Treść zapytania");
  await form.locator("[data-submit]").click();
  await page.waitForLoadState("networkidle");
  return sent;
}
