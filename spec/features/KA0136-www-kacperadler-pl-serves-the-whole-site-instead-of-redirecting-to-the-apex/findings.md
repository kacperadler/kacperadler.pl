# KA0136 - Findings

What was discovered while doing this ticket but is not part of it: bugs, risks, gaps, and suggested changes. Workers add entries on their branch; the coordinator adds the non-blocking notes from reviews. One entry per finding, numbered, never deleted: only its Status changes.

A finding ends in one of three statuses: `fixed` (the branch fixed it; name the commit), `ticket K0000` (a planning ticket carries it), or `dropped (reason)`. `open` lives only until the merge: `h merge` turns every `Status: open` entry into a planning ticket and rewrites its status to `ticket K0000`.

`- Budget:` is optional: set it, in USD, only when the ticket this finding becomes is expected to cost more than the autopilot default, and leave the line out otherwise. `h merge` copies it into the ticket's JSON block as `budget`, which `h ticket status --autopilot` passes to `--budget`, capped at `H_AUTOPILOT_BUDGET_MAX`.

## F1. dev-no-reload.spec.ts is flaky on a fresh worktree

- Kind: bug
- Found by: 2026-10-29-ka0136-www-680e2089 (worker), 2026-10-29
- Where: `tests/e2e/dev-no-reload.spec.ts:21`
- What: the first full `bun run test` in a worktree right after `bun install` failed this test once and passed it on retry (`1 flaky, 241 passed`): `locator.evaluate: Execution context was destroyed, most likely because of a navigation` at `html.evaluate(...)`, right after `page.goto(`${DEV_URL}/ui`)`. The page navigated on its own before the probe was set. [INFERENCE] Vite's first-visit dependency optimisation reloads the page, which is a reload the spec does not cause and does not wait out.
- Suggestion: before setting the probe, wait until the dev server has settled (for example a warm-up `goto` of `/ui` and `waitForLoadState("networkidle")`, or `optimizeDeps.include` for the deps `/ui` pulls in), so the test only sees reloads caused by the file it writes. Keep the assertion itself.
- Status: open
