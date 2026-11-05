# KA0157 - The process drawings and step marks draw in slowly as the page scrolls, not almost at once

```json
{
  "id": "KA0157",
  "title": "The process drawings and step marks draw in slowly as the page scrolls, not almost at once",
  "date": "2026-11-05"
}
```

## Description

The owner, 2026-11-05, on the home page after KA0152 (screenshot of the process section, steps 01 to 03): "Everything looks good BUT on this section and this images that you added the green elements almost appears instantly, and this is distracting i think there should be nice animation for them".

The green (lime) elements are the drawings' lime layer (`src/components/mb/process-figure.astro:178-199`: a `clip-path` draw-in on `view()` with `animation-range: cover 50vh cover calc(100% - 50vh)`) and the rail fill and step marks (`src/components/mb/step-marker.astro:110-127`). That range is as long as the element itself is tall, so it plays over about as many pixels of scroll as the element's height: KA0152 capped the drawings at 80px high, so the lime layer now draws in over roughly 80px of scroll, which reads as appearing at once. The step mark turns lime over a range the size of the mark.

## Goal

The lime layer of each process drawing, and the step mark beside it, draw in as a calm, visible animation that a visitor sees happen, while every bar of `spec/vision.md` and of KA0152 holds.

- Kind: ux

## Done means

- Each drawing's lime layer draws in over a visible span, at least about 30% of the viewport's height of scroll at 1440 px and at 390 px (or, if the worker shows a time-based draw on entering the view reads better, over 600 ms or more with an ease), in the drawing's own order (the brace after the boxes, the chain along the bars), not all lime strokes at once.
- The step mark turns lime as a short eased change that follows the rail reaching it, not a jump.
- Recordings of a slow scroll through the process at 1440 px and 390 px, before and after, as frame series in this folder (at most 40 frames each), so the owner sees the difference.
- `prefers-reduced-motion: reduce` shows the drawings and marks fully drawn with no motion, as today; nothing moves on its own when the page is idle; no new runtime dependency; no JavaScript animation library.
- An e2e test fails when the draw-in range is shortened back to the element's height (or the time-based draw removed), and the reduced-motion test still holds.
- axe zero violations; Lighthouse mobile Performance 95 or more, the other three 100 (Lighthouse runs in a job with Playwright's headless shell, KA0154's F1 of KA0152).
- The project's checks (`bun run check`, `bun run lint`, `bun run build`) and `bun run test` pass on the last commit.
- The owner sees it on the preview before the merge.

## Scope

In:
- `src/components/mb/process-figure.astro`, `src/components/mb/step-marker.astro`, `src/components/mb/sections/how-i-work.astro` if the range needs it, their e2e specs, `DESIGN.md`'s motion lines, this folder.

Out:
- Anything else on the page; the layout and height of the process section (KA0152).

## Decisions
- 2026-11-05: KA0157 starts: a calm draw-in for the lime drawings and step marks; preview before merge; the owner: "Everything looks good BUT on this section and this images that you added the green elements almoust appears instantly, and this is distructing i think there should be nice animation for them" (KA-D17)
- 2026-11-05: Merge KA0157 to kacperadler.pl main; the owner: "KA-D18 1" (KA-D18)
