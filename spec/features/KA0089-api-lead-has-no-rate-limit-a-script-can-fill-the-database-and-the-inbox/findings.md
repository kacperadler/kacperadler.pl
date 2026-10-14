# KA0089 - Findings

What was discovered while doing this ticket but is not part of it: bugs, risks, gaps, and suggested changes. Workers add entries on their branch; the coordinator adds the non-blocking notes from reviews. One entry per finding, numbered, never deleted: only its Status changes.

A finding ends in one of three statuses: `fixed` (the branch fixed it; name the commit), `ticket K0000` (a planning ticket carries it), or `dropped (reason)`. `open` lives only until the merge: `h merge` turns every `Status: open` entry into a planning ticket and rewrites its status to `ticket K0000`.

`- Budget:` is optional: set it, in USD, only when the ticket this finding becomes is expected to cost more than the autopilot default, and leave the line out otherwise. `h merge` copies it into the ticket's JSON block as `budget`, which `h ticket status --autopilot` passes to `--budget`, capped at `H_AUTOPILOT_BUDGET_MAX`.

## F1. A blueprint-live proposal spec fails under the full parallel run

- Kind: bug
- Found by: 2026-10-14-ka0089-api-rate-limit-259a6610 (worker), 2026-10-14
- Where: `tests/e2e/ui-proposals.spec.ts:775` ("a cell under the cursor is selected whole while it is still drawing")
- What: in one local `CI= bun run test` (161 tests, default worker count) it failed after 1.3s while the other 160 passed; run alone with `--repeat-each 3` it passed 3 of 3. The test runs against `astro dev` and touches none of this ticket's files (`nginx.conf`, the new Docker spec), so it looks timing-dependent under load [INFERENCE: the failure output was not inspected beyond its title].
- Suggestion: read the failing assertion from a loaded run (`--repeat-each` with all workers) and wait on the drawing state instead of a fixed timing; the proposal's own behaviour stays as it is.
- Status: ticket KA0090

## F2. Review notes on the burst count and the KA0078 overlap

- Kind: note
- Found by: 2026-10-14-review-ka0089-api-rate-l-a8578631 and -8a6237ba (review notes), 2026-10-14
- Where: `nginx.conf`, `spec/features/*/review-N.md`
- What: review 1 noted `burst=5` let the 7th post through, against Done means; review 2 noted em-dashes in harness-written review files and the nginx.conf overlap with KA0078.
- Status: dropped (burst set to 4 at the human's word in b43803e; review files are harness records; the KA0078 overlap is resolved at its merge)
