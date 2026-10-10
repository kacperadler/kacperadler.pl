# KA0006 - Findings

What was discovered while doing this ticket but is not part of it: bugs, risks, gaps, and suggested changes. Workers add entries on their branch; the coordinator adds the non-blocking notes from reviews. One entry per finding, numbered, never deleted: only its Status changes.

A finding ends in one of three statuses: `fixed` (the branch fixed it; name the commit), `ticket K0000` (a planning ticket carries it), or `dropped (reason)`. `open` lives only until the merge: `h merge` turns every `Status: open` entry into a planning ticket and rewrites its status to `ticket K0000`.

## F1. Em-dash left in the KA0001 review record

- Kind: cleanup
- Found by: 2026-10-10-em-dashes-out-3868f505 (worker), 2026-10-10
- Where: `spec/features/KA0001-onboarding-vision-and-criteria-for-kacperadler-pl/review-1.md`
- What: the file still contains U+2014 em-dashes. The KA0006 Done-means grep covers only `src` and `DESIGN.md`, so this file was left as is. Reproduce: `grep -rn $'\u2014' spec`.
- Suggestion: decide whether a historical review record should be rewritten or kept verbatim; if rewritten, replace with ` - ` in a separate commit. Out of KA0006 scope.
- Status: open
