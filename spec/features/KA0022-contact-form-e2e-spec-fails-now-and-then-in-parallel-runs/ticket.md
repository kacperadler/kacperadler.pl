# KA0022 - contact-form e2e spec fails now and then in parallel runs

```json
{
  "id": "KA0022",
  "title": "contact-form e2e spec fails now and then in parallel runs",
  "date": "2026-10-10"
}
```

## Description

The KA0016 review saw `tests/e2e/contact-form.spec.ts:173` fail once in a run with 4 workers and no `CI`; three reruns under the same conditions passed. Once KA0004 makes `npm test` run the e2e suite, `h merge` runs it before every merge, so a flaky spec blocks merges at random.

## Goal

The e2e suite gives the same answer every time for the same tree, so a failure on a merge means a real bug in the contact form, the site's success measure.

- Kind: risk

## Done means

- The cause of the failure at `contact-form.spec.ts:173` is named in the final message (reproduced, e.g. with `--repeat-each=30 --workers=4`), and fixed in the spec (a wait on the state it asserts, not a fixed timeout) or, if the form itself has the race, in the form.
- `bunx playwright test tests/e2e/contact-form.spec.ts --repeat-each=30 --workers=4` passes 30 of 30, with and without `CI=true`.
- `bun run lint`, `bun run check`, `bunx prettier --check "**/*.astro"`, `bun run build` and `bun run test:e2e` pass.

## Scope

In:
- `tests/e2e/contact-form.spec.ts`; `src/components/contact/` only if the form has the race.

Out:
- The lead store (SQLite) and anything else in the form's behaviour.

## Decisions

- 2026-10-10: Source: F1 of KA0016 (review note).
- 2026-10-10: Approved under the human's standing word (every KA finding approved until the final report).
