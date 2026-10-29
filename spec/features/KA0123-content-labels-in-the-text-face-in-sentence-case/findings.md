# KA0123 - Findings

What was discovered while doing this ticket but is not part of it: bugs, risks, gaps, and suggested changes. Workers add entries on their branch; the coordinator adds the non-blocking notes from reviews. One entry per finding, numbered, never deleted: only its Status changes.

A finding ends in one of three statuses: `fixed` (the branch fixed it; name the commit), `ticket K0000` (a planning ticket carries it), or `dropped (reason)`. `open` lives only until the merge: `h merge` turns every `Status: open` entry into a planning ticket and rewrites its status to `ticket K0000`.

`- Budget:` is optional: set it, in USD, only when the ticket this finding becomes is expected to cost more than the autopilot default, and leave the line out otherwise. `h merge` copies it into the ticket's JSON block as `budget`, which `h ticket status --autopilot` passes to `--budget`, capped at `H_AUTOPILOT_BUDGET_MAX`.

## F1. The case study's facts table still labels its rows in 11px mono caps

- Kind: improvement
- Found by: 2026-10-29-ka0123-labels-15157b52 (worker), 2026-10-29
- Where: `src/pages/realizacje/[slug].astro:97-103` (`.mb-case-fact dt`: the role, period and stack rows of every case study page)
- What: KA0123 moved the content labels of the home page (services, cases, the hero's caption, trust, the form, contact links, footer titles) to a 13px Geist caption in sentence case. The case study page's facts table has the same kind of label - read with the content, not a mark of the drawing - and it was not in the ticket's list, so it stays Geist Mono 11px uppercase at 0.12em, the "tiny uppercase letter-spaced label" KA0118 F3 removes elsewhere.
- Suggestion: the same rule as the home page's step facts (`.mb-service-fact dt`): drop the mono, the uppercase and the tracking, 13px at 500 in `--muted`; add `.mb-case-fact dt` to the content labels check in `tests/e2e/design.spec.ts` (on a case study page). The page's section label stays mono.
- Status: open
