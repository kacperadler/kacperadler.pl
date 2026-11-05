# KA0158 - Review 1

- Job: 2026-11-06-review-92cd94cd
- Branch: arthur/2026-11-05-worker-dbbe606f
- Commit reviewed: 5d69afe3b9753da0216f0a7d8cc1ecc1330124ef
- Verdict: PASS

## Final message

The branch passes. The process now plays strictly in the ticket's order (mark 01, drawing 01, rail to mark 02, mark 02 … drawing 05) on one shared timeline, `view-timeline: --mb-how` on the step list. I found nothing that fails it.

Why I'm satisfied:
- **Timeline order.** In `src/components/mb/sections/how-i-work.astro`, each step's mark, drawing and rail get back-to-back slots computed from one unit. The drawing starts exactly where the mark ends (`--mb-figure-from: var(--mb-step-dot-to)`), and the rail runs from the end of the drawing to the next mark's start. On desktop the rail piece out of one mark and the piece into the next fill together over the same slot. On the phone they split it, one after the other. No slot overlaps another.
- **Drawings and marks.** `step-marker.astro` and `process-figure.astro` take their timeline and ranges from CSS variables and fall back to their own timelines when used alone, which keeps the old behaviour on `/ui`. Each drawing still draws its pieces in order, as KA0157 set up.
- **Reduced motion.** Every new rule sits inside `prefers-reduced-motion: no-preference` and `@supports (animation-timeline: view())`, including the phone block. Under reduced motion or without view timelines, everything shows filled and drawn, and its test passes.
- **Accessibility.** The two new rail pieces sit inside the marker, which is already hidden from screen readers (`aria-hidden="true"`). No focusable or text content was added.
- **Rules.** No em-dashes, no JavaScript, no new dependency, no rounded corners, gradients or always-on motion.
- **New e2e test.** It is meaningful: it fails when any part starts before the one before it is complete, when a mark or drawing animates off screen, or when the rail pieces or connector go out of sync. My hand mutation confirmed it catches an overlap.

## Notes
- (risk) `tests/e2e/home.spec.ts:943-944`: **lower drawing floor.** The minimum scroll per drawing drops from KA0157's 30% of the viewport to 18% at 1440 px and 28% at 390 px. With strict order and every part whole on screen, a drawing gets about 21–23% at 1440 px. The worker recorded this as F2; the owner should judge it on the preview.
- (risk) `spec/features/KA0158-…/findings.md` F1: **Lighthouse 94 locally.** The worker reports 94 against the uncompressed `bun run preview` and 99 when served gzipped, as nginx does in production; the ticket needs 95. I did not run Lighthouse. Owner's call.
- (minor) `src/pages/_ui/catalogue.astro:1357-1395`: **outside the listed scope.** The ticket's scope doesn't name this file. The change is only two notes that keep the `/ui` description in line with the components' new behaviour.

## Checks I ran
- `bun run lint`: 131 files checked, no errors.
- `bun run check`: 0 errors, 0 warnings, 0 hints.
- `bunx playwright test tests/e2e/home.spec.ts -g "process|rail|reduced"`: 6 passed. These cover the layout and rail start, the rail fill, the in-order test at 1440 and 390 px, reduced motion, and the button under the steps.
- **Extra viewports (throwaway, restored):** I added 1280×720, 1366×650, 1920×1080, 360×640 and 768×1024 to the in-order test with a 10% drawing floor. All 7 passed: no order or off-screen failures beyond the two pinned sizes.
- **Hand mutation (restored):** I made each drawing start at its mark's start instead of its end. The in-order test failed at both sizes with "drawing 1 at 0.027 before mark 1 is complete".
- **Images:** I viewed all 80 frames as two contact sheets, plus `compare-d-14.png`. They show the parts filling in order; in the comparison image, the before side shows drawings 02 and 03 drawing while mark 01 is barely filled, and the after side shows mark 01, drawing 01 and mark 02 complete with drawing 02 just starting.
- No `mutate` script exists in this project.
- I did not run the full e2e suite, `bun run build` or Lighthouse; per your instruction I relied on the worker's results for those. The playwright run did rebuild `dist/` before serving.
- The checkout is clean after the throwaway edits.

PASS