# KA0083 - Findings

What was discovered while doing this ticket but is not part of it: bugs, risks, gaps, and suggested changes. Workers add entries on their branch; the coordinator adds the non-blocking notes from reviews. One entry per finding, numbered, never deleted: only its Status changes.

A finding ends in one of three statuses: `fixed` (the branch fixed it; name the commit), `ticket K0000` (a planning ticket carries it), or `dropped (reason)`. `open` lives only until the merge: `h merge` turns every `Status: open` entry into a planning ticket and rewrites its status to `ticket K0000`.

## F1. /ui scrolls 8px sideways at 360px on the first load, now and then

- Kind: bug
- Found by: 2026-10-14-ka0083-worker-63fce832 (worker), 2026-10-14
- Where: `tests/e2e/ui-catalogue.spec.ts:171` ("does not scroll sideways at 360px"), `src/components/mb/button.astro` (`.mb-btn-face`, `.mb-btn-spinner`)
- What: in the last two full runs after the still-layer change (`42f6d48`), the test failed on its first try with `scrollWidth` 368 at a 360px viewport, then passed on retry. Before that change it passed in a full run. Once the page settles, `scrollWidth` is 360 (three loads checked with a throwaway script); the elements reaching past 360px are the button spinners waiting off to the right inside the face, which `overflow-x: clip` hides once the page settles. [INFERENCE] On the dev server's first load the styles arrive after the first paint, so for a moment the spinners stick out before the clip applies.
- Suggestion: find which element sets the 368px width during the first frames (record `scrollWidth` and the elements that stick out on every frame after `goto`), then contain it, for example with `contain: paint` on `.mb-btn-face`. Out: the hidden spinner's position and the slide directions stay.
- Status: ticket KA0085

## F2. The 360px sideways scroll (F1) is likely caused by this branch's spinner hiding

- Kind: bug
- Found by: 2026-10-14-review-ka0083-worker-ed6c09fc (review 1 note), 2026-10-14
- Where: `src/components/mb/button.astro` (`.mb-btn-spinner`, `.mb-btn-face`)
- What: base hid the spinner with `display: none`; the branch uses `visibility: hidden` + `translateX`, relying on `overflow-x: clip`. In Astro dev the scoped CSS arrives after first paint, so the spinner is briefly laid out unclipped. Review: 1 flake in 6 full runs on the branch, 0 in 1 run on base; single-test runs pass on both.
- Status: ticket KA0085
