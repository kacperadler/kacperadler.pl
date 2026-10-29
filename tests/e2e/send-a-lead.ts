import type { Locator, Page } from "@playwright/test";

// The lead store scripts/contact-form.ts POSTs a lead to.
const LEAD_STORE = "**/api/lead";
const EMAIL = "lead@example.com";

// Fills one contact form with a valid lead, submits it the way a visitor
// does and returns how many requests the lead store answered (stubbed, so
// nothing leaves the test). A page that loads contact-form.ts sends one; a
// dev page must send none - its forms would land in the lead store and the
// notification.
//
// It returns once the submit is settled, never on network idle (the page
// reached it before the submit, so that wait returned at once): either the
// stub answered the lead (contact-form.ts stops the browser's own submit),
// or the browser submitted the form itself, a GET of the page with the
// fields in its query (no script took the submit).
export async function sendALead(page: Page, form: Locator): Promise<number> {
  let sent = 0;
  const { promise: answered, resolve } = Promise.withResolvers<void>();
  await page.route(LEAD_STORE, async (route) => {
    await route.fulfill({ json: { ok: true }, status: 200 });
    sent += 1;
    resolve();
  });
  const submittedNatively = page.waitForRequest(
    (request) => new URL(request.url()).searchParams.get("email") === EMAIL
  );
  // The loser of the race below rejects once the page closes or its wait
  // times out; nobody reads it then.
  submittedNatively.catch(() => undefined);
  await form.locator('input[name="email"]').fill(EMAIL);
  await form.locator("label.mb-choice").first().click();
  await form.locator('textarea[name="message"]').fill("Treść zapytania");
  await form.locator("[data-submit]").click();
  await Promise.race([answered, submittedNatively]);
  return sent;
}
