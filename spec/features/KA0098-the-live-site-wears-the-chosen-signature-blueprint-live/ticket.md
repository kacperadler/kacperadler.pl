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
- Model: anthropic/claude-fable-5-1

## Direction

Read before any change, in this order: `spec/vision.md` (who the site is for and what stays true), KA0075's `brief.md` (the positioning: AI Engineer and technology partner for small and mid-sized firms, one action, a 30-minute call; plain language, numbers over adjectives, no jargon in headings) and `tresc.md` (the human's approved copy), `DESIGN.md` (minimal brutalism: ruled cells, square corners, mono labels, Geist), and KA0072, KA0080, KA0081 (why blueprint-live: the human wanted the site to be unmistakably his, "a client enters and knows it is mine", an engineer's drawing made as you scroll, calm and smooth, never tied to scroll speed).

You may go beyond carrying the CSS over: when the signature reads better with a change to layout, spacing, a component or a line of copy, make it, keeping the brief's positioning and tone. Each copy change is its own `copy(...)` commit, and your final message lists every copy change and every departure from tresc.md with its reason, so the human can accept or revert each one.

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
- 2026-10-14: The human: this design update runs on Opus (anthropic/claude-opus-5-5); it matters.
- 2026-10-14: The human: the worker runs on Fable 5.1; it may adjust layout, components and propose or make copy changes, with the full direction (style, aim, positioning) in hand.
- 2026-10-28: The human lifted the worker's budget limit (resume with no limit) after two runs spent $10 with no commits.
- 2026-10-28: The human finds too many lines drawing while scrolling and asked to see option 2: only the hero draws, on page load; every other part of every page stands drawn from the start (no drawing on scroll). Built as one revertable commit to judge on the preview.
