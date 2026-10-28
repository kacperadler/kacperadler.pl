# KA0101 - The editorial proposal stacks a section's content blocks on top of each other

```json
{
  "id": "KA0101",
  "title": "The editorial proposal stacks a section's content blocks on top of each other",
  "date": "2026-10-28"
}
```

## Description

on `/ui/proposal/editorial` (dev only) every child of a section's container except the head gets `grid-row: 4`, so a section with more than one content block draws them in the same grid cell, one over the other: problems (the table and the closing line with its button), examples (the table and its button), cases (the table and `Wszystkie realizacje` when built), and, since KA0075's critique round, process (the steps and the new call button). The contact sheet hit the same rule when its form and links became two siblings; KA0075 wrapped them in one `.mb-contact-sheet`, which `ui-proposals.spec.ts` ("a form on /ui/proposal/editorial sends nothing to the lead store") caught.

## Goal

The dev-only editorial proposal on /ui/proposal/editorial draws each content block of a section below the previous one instead of on top of it, so the proposal can be judged as a real page again.

- Kind: bug

Evidence:
- `src/styles/proposals/editorial/proposal.css:63`
- Found by: 2026-10-14-ka0075-preview-fixes-opu-7d8611e5 (worker), 2026-10-14

## Done means

- The fix, with a test that proves it: place only the first content block in row 4 and let the rest flow into rows after it (for example `grid-row: auto` on `> :not(.mb-section-head) ~ :not(.mb-section-head)`), then check every section on `/ui/proposal/editorial` at 1440px and 390px.
- `npm test` and `npm run check` pass. The structure test holds.

## Scope

In:
- place only the first content block in row 4 and let the rest flow into rows after it (for example `grid-row: auto` on `> :not(.mb-section-head) ~ :not(.mb-section-head)`), then check every section on `/ui/proposal/editorial` at 1440px and 390px.

## Decisions

- 2026-10-28: Source: F2 of KA0075
