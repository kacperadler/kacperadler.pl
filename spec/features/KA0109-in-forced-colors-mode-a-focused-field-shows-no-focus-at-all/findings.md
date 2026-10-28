# KA0109 - Findings

## F1. Two tests flaked under full-suite load

- Kind: bug
- Found by: 2026-10-28-review-ka0109-forced-col-8c6be0b0 (review), 2026-10-28
- Where: `tests/e2e/contact-form.spec.ts` (submit-lock timeout), `tests/e2e/og-image.spec.ts` (fetch)
- What: each failed once and passed on retry in the full run; untouched by this branch. A flaky suite can block a merge on main.
- Suggestion: find why each times out under load and make it wait for the state it asserts.
- Status: open
