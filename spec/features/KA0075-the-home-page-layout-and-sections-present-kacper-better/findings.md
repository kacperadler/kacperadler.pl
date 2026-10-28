# KA0075 - Findings

What was discovered while doing this ticket but is not part of it: bugs, risks, gaps, and suggested changes. Workers add entries on their branch; the coordinator adds the non-blocking notes from reviews. One entry per finding, numbered, never deleted: only its Status changes.

A finding ends in one of three statuses: `fixed` (the branch fixed it; name the commit), `ticket K0000` (a planning ticket carries it), or `dropped (reason)`. `open` lives only until the merge: `h merge` turns every `Status: open` entry into a planning ticket and rewrites its status to `ticket K0000`.

`- Budget:` is optional: set it, in USD, only when the ticket this finding becomes is expected to cost more than the autopilot default, and leave the line out otherwise. `h merge` copies it into the ticket's JSON block as `budget`, which `h ticket status --autopilot` passes to `--budget`, capped at `H_AUTOPILOT_BUDGET_MAX`.

## F1. The `sm` card has the default card's padding

- Kind: bug
- Found by: 2026-10-14-ka0075-preview-fixes-opu-7d8611e5 (worker), 2026-10-14
- Where: `src/components/mb/card.astro:151`
- What: the card's comment says `size` "sm" halves the padding, and DESIGN.md says "32px padding (16px on `sm`)", but no rule sets `--mb-card-pad` for `.mb-card-sm`: commit fc0f732 (KA0071) removed the `.mb-card-sm { --mb-card-pad: var(--v2-space-md); gap: 12px; }` block with the box-shadow hover. So every `sm` cell (contact links, the about link cells, the experience list, the trust bar) has 32px padding on the desktop, and below 880px it keeps 32px while the `default` card drops to 16px. KA0075 set the trust bar's mobile padding locally (`trust.astro`) and left the shared rule alone, because restoring it changes every `sm` cell on the site.
- Suggestion: restore `.mb-card-sm { --mb-card-pad: var(--v2-space-md); }` in `card.astro`, check the catalogue (/ui) and the home page's `sm` cells at 1440px and 390px, then drop the trust bar's local padding override. Or, if 32px is now the intended look, change the comment and DESIGN.md to say so.
- Status: ticket KA0100

## F2. The editorial proposal stacks a section's content blocks on top of each other

- Kind: bug
- Found by: 2026-10-14-ka0075-preview-fixes-opu-7d8611e5 (worker), 2026-10-14
- Where: `src/styles/proposals/editorial/proposal.css:63`
- What: on `/ui/proposal/editorial` (dev only) every child of a section's container except the head gets `grid-row: 4`, so a section with more than one content block draws them in the same grid cell, one over the other: problems (the table and the closing line with its button), examples (the table and its button), cases (the table and `Wszystkie realizacje` when built), and, since KA0075's critique round, process (the steps and the new call button). The contact sheet hit the same rule when its form and links became two siblings; KA0075 wrapped them in one `.mb-contact-sheet`, which `ui-proposals.spec.ts` ("a form on /ui/proposal/editorial sends nothing to the lead store") caught.
- Suggestion: place only the first content block in row 4 and let the rest flow into rows after it (for example `grid-row: auto` on `> :not(.mb-section-head) ~ :not(.mb-section-head)`), then check every section on `/ui/proposal/editorial` at 1440px and 390px.
- Status: ticket KA0101

## F3. main had moved by a docs-only commit before the merge

- Kind: note
- Found by: 2026-10-28-review-ka0075-preview-fi-6b43e469 (review), 2026-10-28
- Where: main `121fc8f`
- What: main's tip was a bookkeeping ticket.md commit not on the branch; the branch base `fd694b9` was docs-only too, so no code diverged.
- Status: dropped (no action: the merge went in cleanly)

## F4. No unit test of checkLead rejecting a duplicate project type

- Kind: note
- Found by: 2026-10-28-review-ka0075-preview-fi-6b43e469 (review), 2026-10-28
- Where: `src/lib/lead.ts`, `tests/e2e/contact-form.spec.ts:223`
- What: checkLead's rejection of a project type sent twice has no isolated test, but the e2e contract test "a project type twice" drives it through the real /api/lead.
- Status: dropped (covered end to end by the /api/lead contract test)
