# KA0145 - New colour palette: Galactic Blue, True Blue and Lime Green

```json
{
  "id": "KA0145",
  "title": "New colour palette: Galactic Blue, True Blue and Lime Green",
  "date": "2026-11-05"
}
```

## Description

The owner gave the site a new palette (2026-11-05, `palette.png` in this folder): Galactic Blue `#04183B` (4, 24, 59), True Blue `#2C92E5` (44, 146, 229) and Lime Green `#7ED321` (126, 211, 33), as CSS `--galactic-blue`, `--true-blue`, `--lime-green`. The site stays dark-only; its colours move from the near-black surfaces and the pale blue accent to this palette.

## Goal

Today the palette is near-black surfaces (`--v2-bg: #0a0c10`, `--v2-panel: #14171c`, `--v2-panel-elevated: #1a1e26`), warm ink (`--ink: #ece7dc`) and one pale accent (`--blue: #8eaed8`), in `src/styles/tokens.css:20-47`, described in `DESIGN.md`. The owner wants the three colours above to be the site's palette.

How they are used (the owner's call, recorded in Decisions):
- Galactic Blue is the substrate: `--v2-bg`, with the panels and the elevated panel as lighter steps of the same hue.
- True Blue replaces the accent `--blue` (links, ids, focus rings, the accent text); `--blue-2` becomes a lighter step of it.
- Lime Green is the second accent, for the main call to action (the contact form's send button and the header CTA) and small highlights, never body text.
- Text on a True Blue or Lime Green fill is Galactic Blue, never white: white on True Blue is 3.31:1, under 4.5:1.

Contrast measured with the WCAG formula: True Blue on Galactic Blue 5.30:1, Lime Green on Galactic Blue 9.36:1, the ink `#ece7dc` on Galactic Blue 14.20:1, the muted `#9d9c95` on Galactic Blue 6.36:1, the error `#e07a70` on Galactic Blue 5.99:1. Every text pairing stays at 4.5:1 or more on each surface it sits on, the panels included.

The vision's bars hold: Lighthouse mobile Accessibility 100, axe zero violations, dark-only.

- Kind: ux

## Done means

- `src/styles/tokens.css` defines `--galactic-blue`, `--true-blue` and `--lime-green` with the owner's values, and the surface, accent and CTA tokens use them as above; no component sets a new hex value of its own.
- The home page, a case-study page and the contact form show the new palette at 1440 px and 390 px; screenshots of each, before and after, are in this folder.
- Every text the change touches is at 4.5:1 or more against its background, and a focus ring or an input border at 3:1 or more; axe reports zero violations on the e2e pages.
- `DESIGN.md` describes the new palette and where each colour is used.
- The project's checks and its e2e suite pass.

## Scope

In:
- `src/styles/tokens.css`: the three colours and the tokens that use them.
- `src/styles/global.css`, and a component only where it sets a colour outside the tokens.
- `DESIGN.md`: the palette section.

Out:
- Layout, type and copy: unchanged.
- A light theme: not the goal (vision).

## Decisions
