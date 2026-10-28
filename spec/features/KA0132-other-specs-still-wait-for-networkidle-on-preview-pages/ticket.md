# KA0132 - Other specs still wait for networkidle on preview pages

```json
{
  "id": "KA0132",
  "title": "Other specs still wait for networkidle on preview pages",
  "date": "2026-10-28"
}
```

## Description

the same wait this ticket removed from `contact-form.spec.ts`: on the preview it waits for the Umami round trips (F1), and with the analytics host hanging the old submit-lock test timed out in `page.waitForLoadState` after 30 s. In `send-a-lead.ts` the wait comes after the submit click on a page that reached networkidle long before, so it most likely returns at once and the function can return before the route handler counted the request [INFERENCE: Playwright resolves `waitForLoadState` at once for a state already reached; not run].

## Goal

The remaining specs wait for the state they assert instead of network idle, so they do not hang or flake on the remote analytics.

- Kind: bug

Evidence:
- `tests/e2e/a11y.spec.ts:84`, `tests/e2e/design.spec.ts:70`, `tests/e2e/send-a-lead.ts:21` (used by `ui-catalogue.spec.ts:1208` on the preview)
- Found by: 2026-10-28-ka0129-load-flakes-af11ddfd (worker), 2026-10-28

## Done means

- The fix, with a test that proves it: wait for the state each test asserts instead (in `sendALead`, for the stubbed request itself, e.g. `page.waitForRequest`); F1 alone would also take the remote server out of these waits.
- `npm test` and `npm run check` pass. The structure test holds.

## Scope

In:
- wait for the state each test asserts instead (in `sendALead`, for the stubbed request itself, e.g. `page.waitForRequest`); F1 alone would also take the remote server out of these waits.

## Decisions

- 2026-10-28: Source: F2 of KA0129
