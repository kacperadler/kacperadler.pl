# KA0127 - Findings

What was discovered while doing this ticket but is not part of it: bugs, risks, gaps, and suggested changes. Workers add entries on their branch; the coordinator adds the non-blocking notes from reviews. One entry per finding, numbered, never deleted: only its Status changes.

A finding ends in one of three statuses: `fixed` (the branch fixed it; name the commit), `ticket K0000` (a planning ticket carries it), or `dropped (reason)`. `open` lives only until the merge: `h merge` turns every `Status: open` entry into a planning ticket and rewrites its status to `ticket K0000`.

`- Budget:` is optional: set it, in USD, only when the ticket this finding becomes is expected to cost more than the autopilot default, and leave the line out otherwise. `h merge` copies it into the ticket's JSON block as `budget`, which `h ticket status --autopilot` passes to `--budget`, capped at `H_AUTOPILOT_BUDGET_MAX`.

## F1. The experience list's logos stay grey on a phone

- Kind: improvement
- Found by: 2026-10-29-ka0127-logos-4b88a47a (worker), 2026-10-29
- Where: `src/components/mb/sections/about.astro:236-257` (`.mb-exp-logo`)
- What: the "Pełne doświadczenie" accordion in `#about` greys its logos the same way the trust bar and the cases did before KA0127 (`opacity: 0.6; filter: grayscale(100%)` at rest, colour only on `:hover` under `(hover: hover) and (pointer: fine)`), so on a phone a visitor never sees ReX, LeadBuster and the rest in their colours there. KA0127's approved decision covers only the trust bar and the cases. Reproduce: open `/` on a 390px touch viewport, open the accordion; every logo is grey.
- Suggestion: move the grey rest state of `.mb-exp-logo` into the existing `@media (hover: hover) and (pointer: fine)` block, as KA0127 did in `trust.astro` and `cases.astro`, add `.mb-exp-logo` to `LOGOS` in `tests/e2e/touch-hover.spec.ts`, and widen the sentence in `DESIGN.md` (Motion) and `AGENTS.md` ("Hover tylko pod myszą") to the experience list.
- Status: ticket KA0141
