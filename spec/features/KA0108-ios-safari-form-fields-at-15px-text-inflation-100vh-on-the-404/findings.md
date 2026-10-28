# KA0108 - Findings

## F1. The three iOS behaviours are not checked on a real iPhone

- Kind: note
- Found by: 2026-10-28-review-ka0108-ios-form-z-272a993a (review), 2026-10-28
- Where: form fields, landscape text size, the 404
- What: none of them reproduces in Chromium; the human was asked to check on his iPhone after deploy.
- Status: dropped (a manual check by the human, not code)

## F2. dev-no-reload.spec.ts flaked once in the full run

- Kind: note
- Found by: 2026-10-28-review-ka0108-ios-form-z-272a993a (review), 2026-10-28
- Where: `tests/e2e/dev-no-reload.spec.ts`
- What: passed on retry; unrelated to this branch.
- Status: dropped (KA0099 carries this flake)

