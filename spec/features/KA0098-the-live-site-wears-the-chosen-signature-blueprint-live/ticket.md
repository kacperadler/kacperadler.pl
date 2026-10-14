# KA0098 - The live site wears the chosen signature, blueprint-live

```json
{
  "id": "KA0098",
  "title": "The live site wears the chosen signature, blueprint-live",
  "date": "2026-10-14",
  "after": [
    "KA0075"
  ]
}
```

## Description

The human chose and approved the blueprint-live signature (KA0081, 2026-10-11: the drawing on scroll, 1.8s pen in the hero, fixed side rulers) and the /ui component fixes (KA0083). The live site already runs minimal brutalism with the KA0083 components, but blueprint-live exists only as `/ui/proposal/blueprint-live` (`src/styles/proposals/blueprint-live/proposal.css`, the inline script in `src/pages/_ui/proposal/[id].astro`). KA0075's rewrite from the brief left the signature out.

## Goal

A client who opens kacperadler.pl sees the engineer's drawing being made as they scroll, the look the human chose so the site reads as his and not a template.

- Kind: improvement

## Done means

- Every public page (home, `/realizacje/`, legal pages, 404) draws as blueprint-live does on its proposal page today, including the new KA0075 sections; under reduced motion the drawing stands complete; with JavaScript off the page stands drawn.
- The proposal-only pages and the other proposals (baseline, blueprint, editorial, live-grid) are removed, or kept dev-only, as the plan proposes and the human picks.
- e2e: the drawn state after scrolling, reduced motion, no JS, no horizontal overflow at 360px, axe at 1440px and 360px. Lighthouse Performance on the home page stays at least what `spec/vision.md` asks.
- `bun run check` and `bun run test` pass.

## Scope

In:
- `src/styles/`, `src/layouts/`, the inline script, the proposal pages.

Out:
- Copy and sections (KA0075).

## Decisions

- 2026-10-14: The human asked whether the chosen UI is part of the redesign; it was not in KA0075. This ticket carries it, after KA0075.
- 2026-10-14: The human approved the ticket and confirmed blueprint-live.
