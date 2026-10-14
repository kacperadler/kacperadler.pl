# KA0054 - Findings

What was discovered while doing this ticket but is not part of it: bugs, risks, gaps, and suggested changes. Workers add entries on their branch; the coordinator adds the non-blocking notes from reviews. One entry per finding, numbered, never deleted: only its Status changes.

A finding ends in one of three statuses: `fixed` (the branch fixed it; name the commit), `ticket K0000` (a planning ticket carries it), or `dropped (reason)`. `open` lives only until the merge: `h merge` turns every `Status: open` entry into a planning ticket and rewrites its status to `ticket K0000`.

`- Budget:` is optional: set it, in USD, only when the ticket this finding becomes is expected to cost more than the autopilot default, and leave the line out otherwise. `h merge` copies it into the ticket's JSON block as `budget`, which `h ticket status --autopilot` passes to `--budget`, capped at `H_AUTOPILOT_BUDGET_MAX`.

## F1. The "move under no-preference" motion test races the transitions it looks for

- Kind: bug
- Found by: 2026-10-14-ka0054-contact-link-step-7f2526ae (worker), 2026-10-14
- Where: `tests/e2e/ui-catalogue.spec.ts`, `motion (astro dev)` › `hover, press and focus move under no-preference` (and `runningTransitions`)
- What: in one full `bun run test` (with `CI` set, so retries on) it failed once and passed on retry, reported `1 flaky`; alone with `--repeat-each=6 --retries=0` it passed 6 of 6. After each hover, press or focus the test asks `getAnimations()` for a transition that is still running. A `--mb-snap` one lasts only 0.12s, so on a loaded machine the transition can end before the test looks, and the test fails though the motion played. The run that flaked shared the machine with other worktrees' builds and dev servers.
- Suggestion: record the transitions the action starts (a `transitionrun` / `transitionstart` listener set up before the action, read after it) instead of sampling the ones still running after it. The reduced-motion half, which expects none, stays as it is.
- Status: open
