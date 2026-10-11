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
- The proposal's header comment no longer says the ticks travel with the sheet.
- An e2e test scrolls `/ui/proposal/blueprint-live` and checks the rulers' computed `mask-position` is the same before and after the scroll.
- `bun run lint`, `bun run check`, `bun run build`, `bun run test:e2e` pass.

## Scope

In:
- `src/styles/proposals/blueprint-live/`, `tests/e2e/ui-proposals.spec.ts`.

Out:
- Other proposals, the live site.

## Decisions

- 2026-10-11: The human: the lines on the right and left in blueprint-live are not static, while in blueprint they are (photo); taken as approval.
