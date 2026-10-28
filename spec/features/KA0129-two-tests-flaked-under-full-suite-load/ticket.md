# KA0129 - Two tests flaked under full-suite load

```json
{
  "id": "KA0129",
  "title": "Two tests flaked under full-suite load",
  "date": "2026-10-28"
}
```

## Description

each failed once and passed on retry in the full run; untouched by this branch. A flaky suite can block a merge on main.

## Goal

The full test suite passes on the first run, so a merge is never stopped or slowed by a test that fails only under load (the contact form's submit lock, the OG image fetch).

- Kind: bug

Evidence:
- `tests/e2e/contact-form.spec.ts` (submit-lock timeout), `tests/e2e/og-image.spec.ts` (fetch)
- Found by: 2026-10-28-review-ka0109-forced-col-8c6be0b0 (review), 2026-10-28

## Done means

- The fix, with a test that proves it: find why each times out under load and make it wait for the state it asserts.
- `npm test` and `npm run check` pass. The structure test holds.

## Scope

In:
- find why each times out under load and make it wait for the state it asserts.

## Decisions

- 2026-10-28: Source: F1 of KA0109
