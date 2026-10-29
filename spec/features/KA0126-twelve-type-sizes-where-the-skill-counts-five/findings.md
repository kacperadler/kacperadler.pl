# KA0126 - Findings

What was discovered while doing this ticket but is not part of it: bugs, risks, gaps, and suggested changes. Workers add entries on their branch; the coordinator adds the non-blocking notes from reviews. One entry per finding, numbered, never deleted: only its Status changes.

A finding ends in one of three statuses: `fixed` (the branch fixed it; name the commit), `ticket K0000` (a planning ticket carries it), or `dropped (reason)`. `open` lives only until the merge: `h merge` turns every `Status: open` entry into a planning ticket and rewrites its status to `ticket K0000`.

`- Budget:` is optional: set it, in USD, only when the ticket this finding becomes is expected to cost more than the autopilot default, and leave the line out otherwise. `h merge` copies it into the ticket's JSON block as `budget`, which `h ticket status --autopilot` passes to `--budget`, capped at `H_AUTOPILOT_BUDGET_MAX`.

## F1. The mono marks still carry four sizes, so `size-count` stays a WARN

- Kind: improvement
- Found by: 2026-10-29-ka0126-type-sizes-f004a3dc (worker), 2026-10-29
- Where: Geist Mono at 11px (`src/components/mb/badge.astro:77`, badges), 12px (`src/components/mb/section-head.astro:103`, the section label; footer copyright), 13px (`src/components/mb/sections/services.astro:97`, a step's `01`), 14px (`src/components/mb/step-marker.astro:97`, the process rail's numbers; the skip link in `src/styles/global.css:91`); the brand mark's `k` in Geist at 15px (`src/components/mb/brand.astro:47`)
- What: after KA0126 the text face keeps 12 / 14 / 16 / 20 besides the headlines and figures, but the Taste Skill `inspect.mjs` still counts 10 sizes on the home page at 1440 (`11, 12, 13, 14, 15, 16, 20, 30, 54, 64`, `size-count` WARN, was 12), because the ticket kept the mono marks and the brand mark at their sizes. The 13px and 15px left are one element each: the service step number and the brand mark.
- Suggestion: if the human wants the WARN gone, fold the mono marks to two sizes (11/12 for labels and badges, 14 for the numbers: the service step number 13 → 14) and the brand mark's `k` 15 → 14 or 16 with `public/favicon.svg` / `favicon.ico` redrawn to match (DESIGN.md: brand mark). Touches the drawing (KA0098) and the brand mark, which AGENTS.md guards; the human decides.
- Status: ticket KA0140
