# KA0073 - Findings

What was discovered while doing this ticket but is not part of it: bugs, risks, gaps, and suggested changes. Workers add entries on their branch; the coordinator adds the non-blocking notes from reviews. One entry per finding, numbered, never deleted: only its Status changes.

A finding ends in one of three statuses: `fixed` (the branch fixed it; name the commit), `ticket K0000` (a planning ticket carries it), or `dropped (reason)`. `open` lives only until the merge: `h merge` turns every `Status: open` entry into a planning ticket and rewrites its status to `ticket K0000`.

`- Budget:` is optional: set it, in USD, only when the ticket this finding becomes is expected to cost more than the autopilot default, and leave the line out otherwise. `h merge` copies it into the ticket's JSON block as `budget`, which `h ticket status --autopilot` passes to `--budget`, capped at `H_AUTOPILOT_BUDGET_MAX`.

## F1. The favicon still draws the old rounded brand mark

- Kind: improvement
- Found by: 2026-10-14-ka0073-og-image-76a0a62a (worker), 2026-10-14
- Where: `public/favicon.svg:2-8`
- What: the favicon is the old mark: a `blue` rect with `rx="46"` on a 128 viewBox (a near circle), a mono `k` at weight 600 in `#0f1116`, the old `on-blue`. The site's mark (`src/components/mb/brand.astro`) and the new OG image are a square `blue` block in a 1px `ink` rule with a heavy `k` in `base` (`#0a0c10`). `public/favicon.ico` was not inspected.
- Suggestion: redraw `favicon.svg` (and regenerate `favicon.ico` from it) as the square mark; AGENTS.md says the brand mark favicon changes only with a `DESIGN.md` update, so the same branch records it there.
- Status: fixed in bdfa1c4
