# KA0151 - The process section is about twice as tall as before

```json
{
  "id": "KA0151",
  "title": "The process section is about twice as tall as before",
  "date": "2026-11-05"
}
```

## Description

F2 of KA0146 (spec/features/KA0146-redesign-inspired-by-the-skills-section-of-safwatk-com-on-the-new-palette/findings.md).

- Kind: ux
- Found by: 2026-11-05-worker-aab5e8bd (worker), 2026-11-05
- Where: `src/components/mb/sections/how-i-work.astro` (`row-gap: 280px`)
- What: each process card grew by its drawing (370-420px tall at 900-1440px), and keeping the stagger (each card starting 0.8-1 of the way down the one before, the layout test) needs a same-side gap of about 0.6 of a card, so the gap went from 128px to 280px. The home page went from 8342px to 11807px at 1440px (jury `report.json`, desktop height).
- Suggestion: if the owner finds it long on the preview, lower the drawings' viewBox height (400×120 to about 400×80) and the gap with it, or let the stagger overlap more (relax the 0.8 bound); the drawing itself stays.

## Goal

<!-- What we are after, what it moves in spec/vision.md, and the evidence (file:line, a command and its output). -->

- Kind: ux

## Done means

<!-- Each observable result, and the test that proves it; the project's checks pass. -->

## Scope

In:
<!-- - `path/to/file.ts`: what changes there. -->

Out:
<!-- - What this ticket does not do, and which ticket does. -->

## Decisions

- 2026-11-05: Source: F2 of KA0146
