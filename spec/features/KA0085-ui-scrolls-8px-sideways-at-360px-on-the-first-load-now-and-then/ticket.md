# KA0085 - /ui scrolls 8px sideways at 360px on the first load, now and then

```json
{
  "id": "KA0085",
  "title": "/ui scrolls 8px sideways at 360px on the first load, now and then",
  "date": "2026-10-14"
}
```

## Description

in the last two full runs after the still-layer change (`42f6d48`), the test failed on its first try with `scrollWidth` 368 at a 360px viewport, then passed on retry. Before that change it passed in a full run. Once the page settles, `scrollWidth` is 360 (three loads checked with a throwaway script); the elements reaching past 360px are the button spinners waiting off to the right inside the face, which `overflow-x: clip` hides once the page settles. [INFERENCE] On the dev server's first load the styles arrive after the first paint, so for a moment the spinners stick out before the clip applies.

## Goal

`/ui` never scrolls sideways at 360px, on the first load too, and the 360px test passes every run, not only on retry.

- Kind: bug

Evidence:
- `tests/e2e/ui-catalogue.spec.ts:171` ("does not scroll sideways at 360px"), `src/components/mb/button.astro` (`.mb-btn-face`, `.mb-btn-spinner`)
- Found by: 2026-10-14-ka0083-worker-63fce832 (worker), 2026-10-14
- KA0083 review 1 (F2 of KA0083): likely cause is KA0083 hiding `.mb-btn-spinner` with `visibility: hidden` + `translateX` instead of `display: none`, so before the scoped CSS loads in dev the spinner sticks out; 1 flake in 6 full runs on the branch, 0 on base.

## Done means

- The fix, with a test that proves it: find which element sets the 368px width during the first frames (record `scrollWidth` and the elements that stick out on every frame after `goto`), then contain it, for example with `contain: paint` on `.mb-btn-face`. Out: the hidden spinner's position and the slide directions stay.
- `npm test` and `npm run check` pass. The structure test holds.

## Scope

In:
- find which element sets the 368px width during the first frames (record `scrollWidth` and the elements that stick out on every frame after `goto`), then contain it, for example with `contain: paint` on `.mb-btn-face`. Out: the hidden spinner's position and the slide directions stay.

## Decisions

- 2026-10-14: Source: F1 of KA0083
- 2026-10-14: The human approved the ticket.
