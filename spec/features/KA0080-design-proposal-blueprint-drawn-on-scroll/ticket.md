# KA0080 - Design proposal: blueprint drawn on scroll

```json
{
  "id": "KA0080",
  "title": "Design proposal: blueprint drawn on scroll",
  "date": "2026-10-10",
  "after": [
    "KA0079"
  ]
}
```

## Description

The human likes the `blueprint` proposal (KA0072) and asked for one more: blueprint's style, drawn while you scroll, as `live-grid` (KA0077) does. Start from both folders in `src/styles/proposals/`; blueprint is the look, live-grid gives the motion.

## Goal

The human sees the engineer's drawing being drawn as he scrolls, and can pick it, drop it or take parts of it.

- Kind: improvement
- Model: anthropic/claude-opus-5-5

## Done means

- `src/styles/proposals/blueprint-live/` (`meta.json` name "Blueprint na żywo", two-sentence description, references; `proposal.css`) at `/ui/proposal/blueprint-live`, home and catalogue, palette only, no new font.
- Everything blueprint shows (dimension lines with real widths, item numbers, CAD hover with grips, `§` labels, title block, rulers, legend) draws in on scroll with CSS scroll-driven animations: rules and dimension lines run out, cell frames trace, ticks and labels appear after their line; scrolling back undraws; it includes KA0079's fix (the hover tag readable on its blue box).
- Under `prefers-reduced-motion` and in browsers without scroll-driven animations everything is drawn at once; no always-on animation.
- Axe zero on the page, no sideways scroll at 360, production build unchanged; the final message says what draws when; no screenshots.
- `bun run lint`, `bun run check`, `bun run build` and `bun run test:e2e` pass.

## Scope

In:
- `src/styles/proposals/blueprint-live/`.

Out:
- Other proposals (copy from them, do not edit), the live site.

## Decisions

- 2026-10-10: The human: "add a blueprint and live-grid combination: the blueprint style, but drawn while scrolling". After KA0079 so it copies the fixed hover tag; merge after PASS.
