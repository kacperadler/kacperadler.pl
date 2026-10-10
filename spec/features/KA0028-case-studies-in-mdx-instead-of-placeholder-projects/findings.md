# KA0028 - Findings

What was discovered while doing this ticket but is not part of it: bugs, risks, gaps, and suggested changes. Workers add entries on their branch; the coordinator adds the non-blocking notes from reviews. One entry per finding, numbered, never deleted: only its Status changes.

A finding ends in one of three statuses: `fixed` (the branch fixed it; name the commit), `ticket K0000` (a planning ticket carries it), or `dropped (reason)`. `open` lives only until the merge: `h merge` turns every `Status: open` entry into a planning ticket and rewrites its status to `ticket K0000`.

`- Budget:` is optional: set it, in USD, only when the ticket this finding becomes is expected to cost more than the autopilot default, and leave the line out otherwise. `h merge` copies it into the ticket's JSON block as `budget`, which `h ticket status --autopilot` passes to `--budget`, capped at `H_AUTOPILOT_BUDGET_MAX`.

## F1. The nav comment still points "Realizacje" at the removed `#projects` section

- Kind: cleanup
- Found by: 2026-10-10-case-studies-frame-57492fb9 (worker), 2026-10-10
- Where: `src/data/navigation.ts:8`
- What: the comment says to restore `{ label: "Realizacje", href: "#projects" }` once case studies land. KA0028 removed the `projects` collection; no `#projects` anchor exists on the page, and case studies now live at `/realizacje/<slug>/`, reached from the "Z kim pracowałem" cards.
- Suggestion: once the first case study ships (KA0030-KA0035), decide whether the nav gets a "Realizacje" entry (pointing at `#experience` or a `/realizacje/` list page, see F2) and replace or drop the comment. The case study content stays out.
- Status: open

## F2. `/realizacje/` has no index page

- Kind: improvement
- Found by: 2026-10-10-case-studies-frame-57492fb9 (worker), 2026-10-10
- Where: `src/pages/realizacje/`
- What: KA0028 builds `/realizacje/<slug>/` only; the list of case studies is the links in "Z kim pracowałem". A visitor who trims the URL to `/realizacje/` gets the 404 page.
- Suggestion: once two or more case studies exist, either add `src/pages/realizacje/index.astro` listing them (in the sitemap and `llms*.txt`) or make nginx redirect `/realizacje/` to `/#experience`. Product call which.
- Status: open
