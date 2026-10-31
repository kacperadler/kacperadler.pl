# KA0143 - Findings

## F1. README is 74 lines, not "about 70"

- Kind: cleanup
- Found by: 2026-10-31-review-ka0143-readme-24544d7c (review), 2026-10-31
- Where: `README.md`
- What: four lines over the ticket's rough target; the prose is plain and complete.
- Suggestion: none.
- Status: dropped (within "about"; the human merged it as is)

## F2. dev-no-reload.spec.ts flaked once and passed on retry

- Kind: bug
- Found by: 2026-10-31-review-ka0143-readme-24544d7c (review), 2026-10-31
- Where: `tests/e2e/dev-no-reload.spec.ts`
- What: a stale `html` attribute check failed once in the review's run and passed on Playwright's retry; unrelated to this docs-only diff.
- Suggestion: none here.
- Status: dropped (already ticket KA0099, waiting for approval)
