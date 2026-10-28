# KA0098 - Findings

What was discovered while doing this ticket but is not part of it: bugs, risks, gaps, and suggested changes. Workers add entries on their branch; the coordinator adds the non-blocking notes from reviews. One entry per finding, numbered, never deleted: only its Status changes.

A finding ends in one of three statuses: `fixed` (the branch fixed it; name the commit), `ticket K0000` (a planning ticket carries it), or `dropped (reason)`. `open` lives only until the merge: `h merge` turns every `Status: open` entry into a planning ticket and rewrites its status to `ticket K0000`.

`- Budget:` is optional: set it, in USD, only when the ticket this finding becomes is expected to cost more than the autopilot default, and leave the line out otherwise. `h merge` copies it into the ticket's JSON block as `budget`, which `h ticket status --autopilot` passes to `--budget`, capped at `H_AUTOPILOT_BUDGET_MAX`.

## F1. The 404 page's rule is the one line the pen does not draw

- Kind: improvement
- Found by: 2026-10-28-ka0098-blueprint-live-li-4aa472de (worker), 2026-10-28
- Where: `src/pages/404.astro:38`
- What: The 404 page opens with its own `ink` rule over the mono `404` (`.mb-not-found-inner`, `border-top`), not a `section-head.astro`, so on that page only the rulers and the footer draw; the rule over the message stands from the start. Every other page opens with a section head, whose rule runs out as a dimension line.
- Suggestion: Give `.mb-not-found-inner` the section head's drawing (the rule by `background-size` over `--bl-e`, ticks, the dimension), or build the 404 on `section-head.astro` with `404` as its label. Out: the blueprint elsewhere, which this ticket carries.
- Status: open
