# KA0103 - The 360px entrance-after-paint test is flaky

```json
{
  "id": "KA0103",
  "title": "The 360px entrance-after-paint test is flaky",
  "date": "2026-10-28"
}
```

## Description

`tests/e2e/blueprint.spec.ts:275` (the entrance starts after the first paint, at 360px) fails now and then and passes on Playwright's CI retry. The review of KA0098 traced it to the two-animation-frame "first paint" heuristic in the inline head script losing a race under load.

## Goal

The test suite stays trustworthy: a red run means a real bug, not a lost race, so merges do not wait on retries.

- Kind: bug

Evidence:
- `tests/e2e/blueprint.spec.ts:275`
- Found by: 2026-10-28-review-ka0098-blueprint-30d7d2d2 (review), 2026-10-28

## Done means

- The test passes 20 runs in a row with `--repeat-each=20` and no retries, at 360px and 1440px, while still failing when the entrance starts before the first paint (mutation shown).
- `npm test` and `npm run check` pass.

## Scope

In:
- The test, or the head script's start signal if the race is in the site, not the test.

## Decisions

- 2026-10-28: Source: F3 of KA0098
