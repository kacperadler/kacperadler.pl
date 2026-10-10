# KA0072 - A signature of Kacper's own in the minimal brutalism style

```json
{
  "id": "KA0072",
  "title": "A signature of Kacper's own in the minimal brutalism style",
  "date": "2026-10-10",
  "after": [
    "KA0069"
  ]
}
```

## Description

The human likes minimal brutalism a lot but misses something of his own: not repetitive or boring, so a client who lands on the site knows it is Kacper's and remembers it.

## Goal

The minimal brutalism design gets a unique character a visitor links with Kacper, chosen by the human from three proposals.
- Model: anthropic/claude-opus-5-5

- Kind: improvement

## Done means

- Three proposals on top of the new design (after KA0069 `baseline` is minimal brutalism), each in `src/styles/proposals/<id>/` at `/ui/proposal/<id>`, home and catalogue, palette kept, every state deliberate, axe zero, motion off under `prefers-reduced-motion`, production build unchanged:
  - `blueprint`: the engineer's drawing: dimension lines, coordinates and annotations on the ruled cells, section marks like a technical spec sheet.
  - `editorial`: a broken, asymmetric grid: cells of uneven spans, oversized numerals, vertical text on the edges, a running section index.
  - `live-grid`: the grid is alive: lines draw in as sections enter, a cursor crosshair with coordinates on the frame, small system readouts (availability, location, time) in the cells.
- Each in its own job on Opus, one commit set per proposal; the final message names what makes it recognisable; no screenshots, the human clicks through on the dev server.
- `bun run lint`, `bun run check`, `bun run build` and `bun run test:e2e` pass.

## Scope

In:
- `src/styles/proposals/<id>/`, fonts next to it if needed.

Out:
- The live site (the chosen direction becomes its own ticket), a pixel monogram.

## Decisions

- 2026-10-10: The human: "the style is great and I like it a lot, but it lacks something mine, so it is not repetitive and boring; a client enters and knows it is mine".
- 2026-10-10: The human: not a pixel monogram; the design itself should be more unique. The coordinator: three proposals (blueprint, editorial, live-grid) on top of the new design, after KA0069; merge after PASS.
