# KA0091 - A commit (`astro check`) in the worktree during e2e coincided with a dev-server page navigation

```json
{
  "id": "KA0091",
  "title": "A commit (`astro check`) in the worktree during e2e coincided with a dev-server page navigation",
  "date": "2026-10-14"
}
```

## Description

during a full `CI=1 bun run test` I committed in the same worktree. The pre-commit hook's `astro check` printed `[vite] Re-optimizing dependencies because vite config has changed` at 19:40:31 and regenerated types and the content sync. Meanwhile the running `button layer and loading (astro dev)` › `the live loading sample slides its label out for the spinner and back by itself` failed with `locator.evaluate: Execution context was destroyed, most likely because of a navigation`, then passed on retry (`1 flaky`). The next full run, with nothing else running in the worktree, gave `158 passed`. [INFERENCE] The dev server saw the files `astro check` wrote (`.astro/` types, the vite deps cache) and reloaded the page; I did not see the dev server's own log for it. If so, a flaky retry from a dev-server test can come from a commit or `astro check` in the same tree, not from the code under test.

## Goal

A commit made during an e2e run cannot make the dev server reload under a running test, so a red run means a real bug.

- Kind: risk

Evidence:
- `playwright.config.ts` (the `astro dev` web server), `.husky/pre-commit` (`astro check`)
- Found by: 2026-10-14-ka0088-motion-test-race-85b614c5 (worker), 2026-10-14

## Done means

- The fix, with a test that proves it: keep the e2e dev server from reacting to files `astro check` writes (for example run it with its own cache dir, or have the coordinator's procedure say not to commit or run `astro check` while e2e runs). Out: changing what `astro check` checks.
- `npm test` and `npm run check` pass. The structure test holds.

## Scope

In:
- keep the e2e dev server from reacting to files `astro check` writes (for example run it with its own cache dir, or have the coordinator's procedure say not to commit or run `astro check` while e2e runs). Out: changing what `astro check` checks.

## Decisions

- 2026-10-14: Source: F1 of KA0088
- 2026-10-14: The human approved the ticket.
- 2026-10-14: The human said merge.
