# KA0157 - Review 1

- Job: 2026-11-05-review-7d0484e0
- Branch: arthur/2026-11-05-worker-ccd03ded
- Commit reviewed: 1192d6fa3bfcfc2601f8954c016e1c6aac5c607c
- Verdict: PASS

## Final message

## KA0157 review: PASS

No blocking findings. The range does what the ticket's Done-means asks, on the parts I could judge from the code:

- **Drawing span is at least 30% of the viewport.** `src/components/mb/process-figure.astro:228-229` sets `animation-range: cover calc(20vh + (100% - 70vh) * from) … to`. The draw runs from the drawing's top at 80% of the viewport to its bottom on the middle line, which is 30vh plus the drawing's height of scroll. `--mb-from` / `--mb-to` cut it into pieces in each drawing's order, each eased (`ease-in-out`) and uncovered left to right.
- **The mark fills eased and follows the rail.** In `src/components/mb/step-marker.astro:135-151`, the lime `::before` scales top to bottom, eased, over `cover 50vh → 50vh + dot size`. That is from the mark's top edge on the middle line to its bottom edge on it. The number switches with `step-start` at 50%.
- **Reduced motion still shows everything drawn.** Every animated rule sits inside `prefers-reduced-motion: no-preference` and `@supports (animation-timeline: view())`. Outside them the mark keeps its lime fill and dark number, and the drawing's pieces have no clip-path. The reduced-motion test now checks every piece (`clip-path: none`) and that no animation runs.
- **Nothing plays on its own, and nothing new is pulled in.** All motion is scroll-driven CSS. There is no JavaScript animation and no new dependency.
- **The new test catches the regression the ticket names.** Shortening the drawing range back to the element's height makes it fail at both 1440 and 390 (see Checks).
- **Accessibility.** The markup is unchanged and both components stay `aria-hidden`.
- **Docs.** `DESIGN.md:203,249`, `AGENTS.md` and `catalogue.astro` describe the new behaviour.
- **Frames.** There are 160 valid PNGs, 40 per series, matching the ticket's limit. That is 80 at 1440×900 and 80 at 390×844. I checked all 160 by type and size but looked only at `after-d-14.png` with my own eyes, so I did not read every binary file line by line as my role asks. That one frame matches the worker's description: mark 01 filling from the top and the plan's chain half drawn. `record.mjs` is a plain Playwright recorder.

## Notes
- (minor) `src/components/mb/step-marker.astro:136-151`: the number is hard to read for a moment mid-fill. Up to 50% of the fill the number is light ink, partly over lime. After 50% it is dark, partly over the dark background. The mark is decorative (`aria-hidden`) and the step's title carries its meaning, so axe does not flag it.
- (minor) `tests/e2e/home.spec.ts:1040`: the ease check compares the scale with linear progress only while the fill is under 0.4. That is enough to catch a linear fill but does not pin the curve.

## Checks
- `bunx playwright test tests/e2e/home.spec.ts -g "process"`: 6 passed (29.8s), including the new tests at 1440 and 390 and the reduced-motion test.
- **Mutation by hand:** I set the drawing range back to the element's height (`50vh + (100% - 100vh)`) and ran the new tests plus the reduced-motion test. Both new tests failed with `drawing 1`; the reduced-motion test passed. I restored the file with `git checkout`, and `git status` was clean afterwards.
- **Frames:** `file *.png` reports 160 PNGs: 80 at 1440×900 and 80 at 390×844.
- **Not rerun, per your instruction:** the full suite, `bun run check`, lint, build, Lighthouse and axe. Their results come from the worker's message, not from me.

PASS