# KA0088 - Findings

What was discovered while doing this ticket but is not part of it: bugs, risks, gaps, and suggested changes. Workers add entries on their branch; the coordinator adds the non-blocking notes from reviews. One entry per finding, numbered, never deleted: only its Status changes.

A finding ends in one of three statuses: `fixed` (the branch fixed it; name the commit), `ticket K0000` (a planning ticket carries it), or `dropped (reason)`. `open` lives only until the merge: `h merge` turns every `Status: open` entry into a planning ticket and rewrites its status to `ticket K0000`.

`- Budget:` is optional: set it, in USD, only when the ticket this finding becomes is expected to cost more than the autopilot default, and leave the line out otherwise. `h merge` copies it into the ticket's JSON block as `budget`, which `h ticket status --autopilot` passes to `--budget`, capped at `H_AUTOPILOT_BUDGET_MAX`.

## F1. A commit (`astro check`) in the worktree during e2e coincided with a dev-server page navigation

- Kind: risk
- Found by: 2026-10-14-ka0088-motion-test-race-85b614c5 (worker), 2026-10-14
- Where: `playwright.config.ts` (the `astro dev` web server), `.husky/pre-commit` (`astro check`)
- What: during a full `CI=1 bun run test` I committed in the same worktree. The pre-commit hook's `astro check` printed `[vite] Re-optimizing dependencies because vite config has changed` at 19:40:31 and regenerated types and the content sync. Meanwhile the running `button layer and loading (astro dev)` › `the live loading sample slides its label out for the spinner and back by itself` failed with `locator.evaluate: Execution context was destroyed, most likely because of a navigation`, then passed on retry (`1 flaky`). The next full run, with nothing else running in the worktree, gave `158 passed`. [INFERENCE] The dev server saw the files `astro check` wrote (`.astro/` types, the vite deps cache) and reloaded the page; I did not see the dev server's own log for it. If so, a flaky retry from a dev-server test can come from a commit or `astro check` in the same tree, not from the code under test.
- Suggestion: keep the e2e dev server from reacting to files `astro check` writes (for example run it with its own cache dir, or have the coordinator's procedure say not to commit or run `astro check` while e2e runs). Out: changing what `astro check` checks.
- Status: open
