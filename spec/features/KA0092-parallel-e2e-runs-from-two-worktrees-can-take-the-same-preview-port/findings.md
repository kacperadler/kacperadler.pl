# KA0092 - Findings

What was discovered while doing this ticket but is not part of it: bugs, risks, gaps, and suggested changes. Workers add entries on their branch; the coordinator adds the non-blocking notes from reviews. One entry per finding, numbered, never deleted: only its Status changes.

A finding ends in one of three statuses: `fixed` (the branch fixed it; name the commit), `ticket K0000` (a planning ticket carries it), or `dropped (reason)`. `open` lives only until the merge: `h merge` turns every `Status: open` entry into a planning ticket and rewrites its status to `ticket K0000`.

`- Budget:` is optional: set it, in USD, only when the ticket this finding becomes is expected to cost more than the autopilot default, and leave the line out otherwise. `h merge` copies it into the ticket's JSON block as `budget`, which `h ticket status --autopilot` passes to `--budget`, capped at `H_AUTOPILOT_BUDGET_MAX`.

## F1. dev-no-reload fails once on a navigation right after its first page load

- Kind: bug
- Found by: 2026-10-14-ka0092-e2e-port-race-a3f5757f (worker), 2026-10-14
- Where: `tests/e2e/dev-no-reload.spec.ts:21`
- What: in the first full `bun run test:e2e` after merging main (KA0091) into this branch, the spec failed its first try with `locator.evaluate: Execution context was destroyed, most likely because of a navigation` at line 21, right after `page.goto(${DEV_URL}/ui)` and before it touches any file, then passed on retry (`1 flaky`, `167 passed`). With 1 worker it is the first spec that loads a page of the dev server. Three runs of it with `ui-catalogue.spec.ts`, `--retries=0` and `node_modules/.vite` removed before each did not reproduce it (59 passed each). The cause is not known; [INFERENCE] a reload the dev server sends on its first request (for example Vite optimizing a dependency it just found), which the dev server's stdout (`stdout: "ignore"` in `playwright.config.ts`) does not show.
- Suggestion: make the spec wait for a page that has settled (for example a first `page.goto` before the probe, or a second one when the first navigates away) and log the dev server's reload reason when it happens; the no-watch setting itself stays as KA0091 left it.
- Status: ticket KA0099

## F2. Review notes: em-dashes in merged review files; F1 left out of scope

- Kind: note
- Found by: 2026-10-14-review-ka0092-e2e-port-r-ae2fbe8f and -a5cb3b83 (review notes), 2026-10-14
- Where: `spec/features/*/review-N.md`, `outcome.md`
- What: em-dashes in harness-written records came in with the main merge; F1 was correctly left to its own ticket.
- Status: dropped (harness records, not product copy)
