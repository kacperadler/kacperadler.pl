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

Second case, 2026-10-10: `h merge KA0004` ran `npm test` on main and `tests/e2e/mobile-sheet.spec.ts:61` ("open sheet is a dialog named 'Menu mobilne'…") failed three times in a row, retries included, at `await expect(dialog).toHaveCSS("opacity", "1")` (line 72); 18 others passed. The coordinator could not reproduce it right after in the main checkout (`bunx playwright test`, with and without `CI=true FORCE_COLOR=1`: 19 passed, 4 times). `h merge` runs `npm run check` then `npm test` with `PATH` that has no `~/.bun/bin` (only `H_PATH_PREPEND` would add it) and `FORCE_COLOR` set.

## Goal

The e2e suite gives the same answer every time for the same tree, so a failure on a merge means a real bug in the contact form, the site's success measure.

- Kind: risk

## Done means

- The cause of the failure at `mobile-sheet.spec.ts:72` under `h merge`'s environment is found (reproduce with `env -i HOME=$HOME PATH=/usr/bin:/bin:$HOME/.nvm/versions/node/v24.21.0/bin FORCE_COLOR=1 npm test` after the KA0004 script exists, or the closest you can get) and fixed so it cannot happen: wait on the state the test needs, not on a CSS transition value.
- The cause of the failure at `contact-form.spec.ts:173` is named in the final message (reproduced, e.g. with `--repeat-each=30 --workers=4`), and fixed in the spec (a wait on the state it asserts, not a fixed timeout) or, if the form itself has the race, in the form.
- `bunx playwright test tests/e2e/contact-form.spec.ts tests/e2e/mobile-sheet.spec.ts --repeat-each=30 --workers=4` passes every run, with and without `CI=true`.
- `bun run lint`, `bun run check`, `bunx prettier --check "**/*.astro"`, `bun run build` and `bun run test:e2e` pass.

## Scope

In:
- `tests/e2e/contact-form.spec.ts`, `tests/e2e/mobile-sheet.spec.ts`; `src/components/` only if the component itself has the race.

Out:
- The lead store (SQLite) and anything else in the form's behaviour.

## Decisions

- 2026-10-10: Source: F1 of KA0016 (review note).
- 2026-10-10: Approved under the human's standing word (every KA finding approved until the final report).
- 2026-10-10: The coordinator added the mobile-sheet failure that stopped KA0004's merge; KA0004 merges after this.
