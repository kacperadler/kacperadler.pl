# KA0015 - Findings

What was discovered while doing this ticket but is not part of it: bugs, risks, gaps, and suggested changes. Workers add entries on their branch; the coordinator adds the non-blocking notes from reviews. One entry per finding, numbered, never deleted: only its Status changes.

A finding ends in one of three statuses: `fixed` (the branch fixed it; name the commit), `ticket K0000` (a planning ticket carries it), or `dropped (reason)`. `open` lives only until the merge: `h merge` turns every `Status: open` entry into a planning ticket and rewrites its status to `ticket K0000`.

`- Budget:` is optional: set it, in USD, only when the ticket this finding becomes is expected to cost more than the autopilot default, and leave the line out otherwise. `h merge` copies it into the ticket's JSON block as `budget`, which `h ticket status --autopilot` passes to `--budget`, capped at `H_AUTOPILOT_BUDGET_MAX`.

## F1. The modal mobile sheet does not move or hold focus

- Kind: bug
- Found by: 2026-10-10-mobile-menu-accessible-n-264b11e8 (worker), 2026-10-10
- Where: `src/scripts/mobile-sheet.ts:29` (`setOpen`)
- What: KA0015 made the sheet `role="dialog"` with `aria-modal="true"`, but `setOpen` only toggles `data-mobile-sheet`, `aria-hidden`, `aria-expanded` and body overflow: it never moves focus into the dialog on open and sets no `inert` on the page behind it. After a click on the hamburger, focus stays on the trigger, which sits behind the modal; Tab can reach the page under the overlay. Only Escape returns focus (to the trigger). KA0015's Scope left the menu's behaviour out.
- Suggestion: on open, focus the close button (or the first sheet link) and mark the rest of the page `inert` (or trap Tab inside the sheet); on close by X or link, return focus to the trigger as Escape already does. Extend `tests/e2e/mobile-sheet.spec.ts` with a focus-on-open and a Tab-stays-inside case. The look stays as is.
- Status: ticket KA0019

## F2. Parallel worktrees collide on the e2e preview port 4329

- Kind: risk
- Found by: 2026-10-10-mobile-menu-accessible-n-264b11e8 (worker), 2026-10-10
- Where: `playwright.config.ts:5` (`PORT = 4329`), `playwright.config.ts:32` (`reuseExistingServer: !process.env.CI`)
- What: every worktree's `bun run test:e2e` serves on port 4329. While this job ran, another job's `astro preview` (worktree `2026-10-10-design-md-dark-only-at-78ab9b6c`) held 4329, and `bunx playwright test` here stopped with `http://localhost:4329 is already used`. With `CI` unset, `reuseExistingServer` is true, so the same run would instead test the other worktree's build and report its result as this branch's [INFERENCE: from the config line, not run with CI unset].
- Suggestion: let an env variable (for example `E2E_PORT`) override the port, defaulting to 4329, and have the harness give each job its own; keep CI as is.
- Status: dropped (KA0016 covers it; ticket KA0020 dropped)
