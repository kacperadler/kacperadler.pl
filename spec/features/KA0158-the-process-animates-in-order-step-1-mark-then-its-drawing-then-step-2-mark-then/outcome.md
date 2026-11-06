# KA0158 - Outcome

- Merged: 2026-11-06, `72aa697`
- Branch: arthur/2026-11-05-worker-dbbe606f
- Reviews: review-1.md PASS
- Cost: worker $10.18, reviews $0.99; review rounds 1

## What went in

- src/components/mb/sections/how-i-work.astro: the list declares the shared `--mb-how` timeline (inset 0) and cuts the run into consecutive slots (mark, drawing, rail), with separate start, end and slot sizes for desktop and phone; it passes each step's ranges to the marker and drawing, times the connector to the mark's middle, sets `--mb-step` and `--mb-how-count`, and sets the 32 px desktop rail reach.
- src/components/mb/step-marker.astro: the lime rail is two pieces (into the mark, out of it); the pieces and the mark take their timeline and ranges from `--mb-step-timeline` and `--mb-step-*-from/-to`, falling back to their own timelines (follow the middle line) when used alone.
- src/components/mb/process-figure.astro: the drawing's timeline and range come from `--mb-figure-timeline` and `--mb-figure-from/-to`, falling back to its own timeline; pieces keep their share of the range.
- tests/e2e/home.spec.ts: the rail-fill test counts the 8 rail pieces from empty to full; a new test at 1440 and 390 pins strict order, every mark and drawing animating whole on screen, the rail pieces, the connector, the drawing span floor, piece order and the eased mark; the layout test pins where the rail into each mark starts.
- DESIGN.md: the component table and the motion line describe the in-order play on one timeline and the drawing's share of scroll at 1440 and 390.
- AGENTS.md: the how-i-work line describes the in-order play, the slots, on-screen playback and `/ui` standalone behaviour.
- src/pages/_ui/catalogue.astro: the step-marker and drawing notes say the home page plays them in order on the list's timeline.
- spec/features/KA0158-the-process-animates-in-order-step-1-mark-then-its-drawing-then-step-2-mark-then/findings.md: F1 (Lighthouse on uncompressed HTML) and F2 (desktop draw span).
- spec/features/KA0158-the-process-animates-in-order-step-1-mark-then-its-drawing-then-step-2-mark-then/frames/record.mjs: records 40 frames each at 1440×900 and 390×844 at KA0157's scroll positions, and with `compare` writes the before/after image.
- spec/features/KA0158-the-process-animates-in-order-step-1-mark-then-its-drawing-then-step-2-mark-then/frames/frames.json: each frame's file, viewport and scroll position.
- spec/features/KA0158-the-process-animates-in-order-step-1-mark-then-its-drawing-then-step-2-mark-then/frames/compare-d-14.png: the same desktop scroll position, before (KA0157 `after-d-14`) and after, side by side.
- spec/features/KA0158-the-process-animates-in-order-step-1-mark-then-its-drawing-then-step-2-mark-then/frames/after-d-01.png: desktop frame 1 of the slow scroll after the change.
- spec/features/KA0158-the-process-animates-in-order-step-1-mark-then-its-drawing-then-step-2-mark-then/frames/after-d-02.png: desktop frame 2.
- spec/features/KA0158-the-process-animates-in-order-step-1-mark-then-its-drawing-then-step-2-mark-then/frames/after-d-03.png: desktop frame 3.
- spec/features/KA0158-the-process-animates-in-order-step-1-mark-then-its-drawing-then-step-2-mark-then/frames/after-d-04.png: desktop frame 4.
- spec/features/KA0158-the-process-animates-in-order-step-1-mark-then-its-drawing-then-step-2-mark-then/frames/after-d-05.png: desktop frame 5.
- spec/features/KA0158-the-process-animates-in-order-step-1-mark-then-its-drawing-then-step-2-mark-then/frames/after-d-06.png: desktop frame 6.
- spec/features/KA0158-the-process-animates-in-order-step-1-mark-then-its-drawing-then-step-2-mark-then/frames/after-d-07.png: desktop frame 7.
- spec/features/KA0158-the-process-animates-in-order-step-1-mark-then-its-drawing-then-step-2-mark-then/frames/after-d-08.png: desktop frame 8.
- spec/features/KA0158-the-process-animates-in-order-step-1-mark-then-its-drawing-then-step-2-mark-then/frames/after-d-09.png: desktop frame 9.
- spec/features/KA0158-the-process-animates-in-order-step-1-mark-then-its-drawing-then-step-2-mark-then/frames/after-d-10.png: desktop frame 10.
- spec/features/KA0158-the-process-animates-in-order-step-1-mark-then-its-drawing-then-step-2-mark-then/frames/after-d-11.png: desktop frame 11.
- spec/features/KA0158-the-process-animates-in-order-step-1-mark-then-its-drawing-then-step-2-mark-then/frames/after-d-12.png: desktop frame 12.
- spec/features/KA0158-the-process-animates-in-order-step-1-mark-then-its-drawing-then-step-2-mark-then/frames/after-d-13.png: desktop frame 13.
- spec/features/KA0158-the-process-animates-in-order-step-1-mark-then-its-drawing-then-step-2-mark-then/frames/after-d-14.png: desktop frame 14.
- spec/features/KA0158-the-process-animates-in-order-step-1-mark-then-its-drawing-then-step-2-mark-then/frames/after-d-15.png: desktop frame 15.
- spec/features/KA0158-the-process-animates-in-order-step-1-mark-then-its-drawing-then-step-2-mark-then/frames/after-d-16.png: desktop frame 16.
- spec/features/KA0158-the-process-animates-in-order-step-1-mark-then-its-drawing-then-step-2-mark-then/frames/after-d-17.png: desktop frame 17.
- spec/features/KA0158-the-process-animates-in-order-step-1-mark-then-its-drawing-then-step-2-mark-then/frames/after-d-18.png: desktop frame 18.
- spec/features/KA0158-the-process-animates-in-order-step-1-mark-then-its-drawing-then-step-2-mark-then/frames/after-d-19.png: desktop frame 19.
- spec/features/KA0158-the-process-animates-in-order-step-1-mark-then-its-drawing-then-step-2-mark-then/frames/after-d-20.png: desktop frame 20.
- spec/features/KA0158-the-process-animates-in-order-step-1-mark-then-its-drawing-then-step-2-mark-then/frames/after-d-21.png: desktop frame 21.
- spec/features/KA0158-the-process-animates-in-order-step-1-mark-then-its-drawing-then-step-2-mark-then/frames/after-d-22.png: desktop frame 22.
- spec/features/KA0158-the-process-animates-in-order-step-1-mark-then-its-drawing-then-step-2-mark-then/frames/after-d-23.png: desktop frame 23.
- spec/features/KA0158-the-process-animates-in-order-step-1-mark-then-its-drawing-then-step-2-mark-then/frames/after-d-24.png: desktop frame 24.
- spec/features/KA0158-the-process-animates-in-order-step-1-mark-then-its-drawing-then-step-2-mark-then/frames/after-d-25.png: desktop frame 25.
- spec/features/KA0158-the-process-animates-in-order-step-1-mark-then-its-drawing-then-step-2-mark-then/frames/after-d-26.png: desktop frame 26.
- spec/features/KA0158-the-process-animates-in-order-step-1-mark-then-its-drawing-then-step-2-mark-then/frames/after-d-27.png: desktop frame 27.
- spec/features/KA0158-the-process-animates-in-order-step-1-mark-then-its-drawing-then-step-2-mark-then/frames/after-d-28.png: desktop frame 28.
- spec/features/KA0158-the-process-animates-in-order-step-1-mark-then-its-drawing-then-step-2-mark-then/frames/after-d-29.png: desktop frame 29.
- spec/features/KA0158-the-process-animates-in-order-step-1-mark-then-its-drawing-then-step-2-mark-then/frames/after-d-30.png: desktop frame 30.
- spec/features/KA0158-the-process-animates-in-order-step-1-mark-then-its-drawing-then-step-2-mark-then/frames/after-d-31.png: desktop frame 31.
- spec/features/KA0158-the-process-animates-in-order-step-1-mark-then-its-drawing-then-step-2-mark-then/frames/after-d-32.png: desktop frame 32.
- spec/features/KA0158-the-process-animates-in-order-step-1-mark-then-its-drawing-then-step-2-mark-then/frames/after-d-33.png: desktop frame 33.
- spec/features/KA0158-the-process-animates-in-order-step-1-mark-then-its-drawing-then-step-2-mark-then/frames/after-d-34.png: desktop frame 34.
- spec/features/KA0158-the-process-animates-in-order-step-1-mark-then-its-drawing-then-step-2-mark-then/frames/after-d-35.png: desktop frame 35.
- spec/features/KA0158-the-process-animates-in-order-step-1-mark-then-its-drawing-then-step-2-mark-then/frames/after-d-36.png: desktop frame 36.
- spec/features/KA0158-the-process-animates-in-order-step-1-mark-then-its-drawing-then-step-2-mark-then/frames/after-d-37.png: desktop frame 37.
- spec/features/KA0158-the-process-animates-in-order-step-1-mark-then-its-drawing-then-step-2-mark-then/frames/after-d-38.png: desktop frame 38.
- spec/features/KA0158-the-process-animates-in-order-step-1-mark-then-its-drawing-then-step-2-mark-then/frames/after-d-39.png: desktop frame 39.
- spec/features/KA0158-the-process-animates-in-order-step-1-mark-then-its-drawing-then-step-2-mark-then/frames/after-d-40.png: desktop frame 40.
- spec/features/KA0158-the-process-animates-in-order-step-1-mark-then-its-drawing-then-step-2-mark-then/frames/after-m-01.png: phone frame 1 of the slow scroll after the change.
- spec/features/KA0158-the-process-animates-in-order-step-1-mark-then-its-drawing-then-step-2-mark-then/frames/after-m-02.png: phone frame 2.
- spec/features/KA0158-the-process-animates-in-order-step-1-mark-then-its-drawing-then-step-2-mark-then/frames/after-m-03.png: phone frame 3.
- spec/features/KA0158-the-process-animates-in-order-step-1-mark-then-its-drawing-then-step-2-mark-then/frames/after-m-04.png: phone frame 4.
- spec/features/KA0158-the-process-animates-in-order-step-1-mark-then-its-drawing-then-step-2-mark-then/frames/after-m-05.png: phone frame 5.
- spec/features/KA0158-the-process-animates-in-order-step-1-mark-then-its-drawing-then-step-2-mark-then/frames/after-m-06.png: phone frame 6.
- spec/features/KA0158-the-process-animates-in-order-step-1-mark-then-its-drawing-then-step-2-mark-then/frames/after-m-07.png: phone frame 7.
- spec/features/KA0158-the-process-animates-in-order-step-1-mark-then-its-drawing-then-step-2-mark-then/frames/after-m-08.png: phone frame 8.
- spec/features/KA0158-the-process-animates-in-order-step-1-mark-then-its-drawing-then-step-2-mark-then/frames/after-m-09.png: phone frame 9.
- spec/features/KA0158-the-process-animates-in-order-step-1-mark-then-its-drawing-then-step-2-mark-then/frames/after-m-10.png: phone frame 10.
- spec/features/KA0158-the-process-animates-in-order-step-1-mark-then-its-drawing-then-step-2-mark-then/frames/after-m-11.png: phone frame 11.
- spec/features/KA0158-the-process-animates-in-order-step-1-mark-then-its-drawing-then-step-2-mark-then/frames/after-m-12.png: phone frame 12.
- spec/features/KA0158-the-process-animates-in-order-step-1-mark-then-its-drawing-then-step-2-mark-then/frames/after-m-13.png: phone frame 13.
- spec/features/KA0158-the-process-animates-in-order-step-1-mark-then-its-drawing-then-step-2-mark-then/frames/after-m-14.png: phone frame 14.
- spec/features/KA0158-the-process-animates-in-order-step-1-mark-then-its-drawing-then-step-2-mark-then/frames/after-m-15.png: phone frame 15.
- spec/features/KA0158-the-process-animates-in-order-step-1-mark-then-its-drawing-then-step-2-mark-then/frames/after-m-16.png: phone frame 16.
- spec/features/KA0158-the-process-animates-in-order-step-1-mark-then-its-drawing-then-step-2-mark-then/frames/after-m-17.png: phone frame 17.
- spec/features/KA0158-the-process-animates-in-order-step-1-mark-then-its-drawing-then-step-2-mark-then/frames/after-m-18.png: phone frame 18.
- spec/features/KA0158-the-process-animates-in-order-step-1-mark-then-its-drawing-then-step-2-mark-then/frames/after-m-19.png: phone frame 19.
- spec/features/KA0158-the-process-animates-in-order-step-1-mark-then-its-drawing-then-step-2-mark-then/frames/after-m-20.png: phone frame 20.
- spec/features/KA0158-the-process-animates-in-order-step-1-mark-then-its-drawing-then-step-2-mark-then/frames/after-m-21.png: phone frame 21.
- spec/features/KA0158-the-process-animates-in-order-step-1-mark-then-its-drawing-then-step-2-mark-then/frames/after-m-22.png: phone frame 22.
- spec/features/KA0158-the-process-animates-in-order-step-1-mark-then-its-drawing-then-step-2-mark-then/frames/after-m-23.png: phone frame 23.
- spec/features/KA0158-the-process-animates-in-order-step-1-mark-then-its-drawing-then-step-2-mark-then/frames/after-m-24.png: phone frame 24.
- spec/features/KA0158-the-process-animates-in-order-step-1-mark-then-its-drawing-then-step-2-mark-then/frames/after-m-25.png: phone frame 25.
- spec/features/KA0158-the-process-animates-in-order-step-1-mark-then-its-drawing-then-step-2-mark-then/frames/after-m-26.png: phone frame 26.
- spec/features/KA0158-the-process-animates-in-order-step-1-mark-then-its-drawing-then-step-2-mark-then/frames/after-m-27.png: phone frame 27.
- spec/features/KA0158-the-process-animates-in-order-step-1-mark-then-its-drawing-then-step-2-mark-then/frames/after-m-28.png: phone frame 28.
- spec/features/KA0158-the-process-animates-in-order-step-1-mark-then-its-drawing-then-step-2-mark-then/frames/after-m-29.png: phone frame 29.
- spec/features/KA0158-the-process-animates-in-order-step-1-mark-then-its-drawing-then-step-2-mark-then/frames/after-m-30.png: phone frame 30.
- spec/features/KA0158-the-process-animates-in-order-step-1-mark-then-its-drawing-then-step-2-mark-then/frames/after-m-31.png: phone frame 31.
- spec/features/KA0158-the-process-animates-in-order-step-1-mark-then-its-drawing-then-step-2-mark-then/frames/after-m-32.png: phone frame 32.
- spec/features/KA0158-the-process-animates-in-order-step-1-mark-then-its-drawing-then-step-2-mark-then/frames/after-m-33.png: phone frame 33.
- spec/features/KA0158-the-process-animates-in-order-step-1-mark-then-its-drawing-then-step-2-mark-then/frames/after-m-34.png: phone frame 34.
- spec/features/KA0158-the-process-animates-in-order-step-1-mark-then-its-drawing-then-step-2-mark-then/frames/after-m-35.png: phone frame 35.
- spec/features/KA0158-the-process-animates-in-order-step-1-mark-then-its-drawing-then-step-2-mark-then/frames/after-m-36.png: phone frame 36.
- spec/features/KA0158-the-process-animates-in-order-step-1-mark-then-its-drawing-then-step-2-mark-then/frames/after-m-37.png: phone frame 37.
- spec/features/KA0158-the-process-animates-in-order-step-1-mark-then-its-drawing-then-step-2-mark-then/frames/after-m-38.png: phone frame 38.
- spec/features/KA0158-the-process-animates-in-order-step-1-mark-then-its-drawing-then-step-2-mark-then/frames/after-m-39.png: phone frame 39.
- spec/features/KA0158-the-process-animates-in-order-step-1-mark-then-its-drawing-then-step-2-mark-then/frames/after-m-40.png: phone frame 40.

## Checks on main

- `bun install --frozen-lockfile`: passed.
- `npm run check`: passed.
- `npm test`: passed.

## Left open

- Tickets from findings: KA0159 (F1), KA0160 (F2), KA0161 (F3).
