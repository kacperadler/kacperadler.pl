# KA0081 - Blueprint-live: the rulers stand still as in blueprint

```json
{
  "id": "KA0081",
  "title": "Blueprint-live: the rulers stand still as in blueprint",
  "date": "2026-10-11"
}
```

## Description

In the blueprint-live proposal (KA0080) the rulers on the frame's left and right edges move their ticks with the page as it scrolls (`bl-sheet` on `.mb-frame::before/::after`, `src/styles/proposals/blueprint-live/proposal.css`). In blueprint (`src/styles/proposals/blueprint/`) they stand still, and the human wants them that way here too. The human's photo: `rulers-moving.jpg`.

## Goal

The rulers in blueprint-live stand still while the page scrolls, as in blueprint; they still draw down once on load.

- Kind: bug

## Done means

- On `/ui/proposal/blueprint-live`, the rulers' ticks stay in the same place on screen while the page scrolls (the `bl-sheet` scroll animation and its keyframes are gone); the draw-down on load stays; under `prefers-reduced-motion` they stand complete.
- Every piece that draws on scroll (rules, dimension lines, cell frames, ticks, labels) draws once when it comes on screen and then stays drawn: scrolling back up or down never undraws it. This replaces KA0080's "scrolling back undraws". If CSS alone cannot keep it, a small script in `src/pages/_ui/proposal/[id].astro` that marks a piece drawn is allowed, only for blueprint-live; without the script or under `prefers-reduced-motion` everything stands drawn.
- The proposal's header comment no longer says the ticks travel with the sheet or that scrolling back undraws.
- An e2e test scrolls a section into view, then back above it, and checks its rule is still fully drawn.
- A piece does not follow the scroll position: once its element is whole on screen (or, when taller than the screen, fills it), the piece plays its drawing to the end by itself in under a second and stays; a piece never stops half-drawn, and its drawing takes the same time whether the page is scrolled slowly or fast. An e2e test scrolls a cell fully into view, does not scroll further, and checks its frame reaches fully drawn.
- An e2e test scrolls `/ui/proposal/blueprint-live` and checks the rulers' computed `mask-position` is the same before and after the scroll.
- `bun run lint`, `bun run check`, `bun run build`, `bun run test:e2e` pass.

## Scope

In:
- `src/styles/proposals/blueprint-live/`, `tests/e2e/ui-proposals.spec.ts`, `src/pages/_ui/proposal/[id].astro` only if a script is needed.

Out:
- Other proposals, the live site.

## Decisions

- 2026-10-11: The human: the lines on the right and left in blueprint-live are not static, while in blueprint they are (photo); taken as approval.
- 2026-10-11: The human: a line drawn on scroll should stay once its element was on screen, not vanish when scrolling back up; the side rulers draw in and then stand still (second photo `rulers-moving-2.jpg`). Added to this ticket, same file.
- 2026-10-11: The human: content on screen should draw to the end once the whole element is on screen; the drawing plays to completion instead of following the scroll.
- 2026-10-11: The human: the animation must not depend on scroll speed.
- 2026-10-11: The human: no budget limit for this job after it hit $5.
