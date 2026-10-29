# Findings

## F1. The abbreviation-hyphen rule is not word-bounded

- Kind: note
- Found by: 2026-10-29-review-ka0125-taste-6035b882 (review), 2026-10-29
- Where: `src/lib/line-breaks.ts` (`ABBREVIATION_HYPHEN`)
- What: a mixed-case run such as `xYZ-ab` would also get the joiner; no such string is in the copy.
- Status: dropped, harmless: the joiner only keeps a word whole, and the rule matches the one-letter-word rule beside it.

## F2. dev-no-reload flaked once in the full suite

- Kind: note
- Found by: 2026-10-29-review-ka0125-taste-6035b882 (review), 2026-10-29
- Where: `tests/e2e/dev-no-reload.spec.ts`
- What: one navigation-timing flake, passed on retry, unrelated to this branch.
- Status: dropped, already ticket KA0099.
