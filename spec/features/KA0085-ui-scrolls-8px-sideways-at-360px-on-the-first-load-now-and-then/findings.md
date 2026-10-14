# KA0085 - Findings

What was discovered while doing this ticket but is not part of it: bugs, risks, gaps, and suggested changes. Workers add entries on their branch; the coordinator adds the non-blocking notes from reviews. One entry per finding, numbered, never deleted: only its Status changes.

A finding ends in one of three statuses: `fixed` (the branch fixed it; name the commit), `ticket K0000` (a planning ticket carries it), or `dropped (reason)`. `open` lives only until the merge: `h merge` turns every `Status: open` entry into a planning ticket and rewrites its status to `ticket K0000`.

`- Budget:` is optional: set it, in USD, only when the ticket this finding becomes is expected to cost more than the autopilot default, and leave the line out otherwise. `h merge` copies it into the ticket's JSON block as `budget`, which `h ticket status --autopilot` passes to `--budget`, capped at `H_AUTOPILOT_BUDGET_MAX`.

## F1. Under reduced motion every restyle lags one frame on every page

- Kind: bug
- Found by: 2026-10-14-ka0085-360px-scroll-ada4546a (worker), 2026-10-14
- Where: `src/styles/global.css:92-101`
- What: the reduced-motion block sets `transition-duration: 0.01ms !important` on `*`, and `transition-property` defaults to `all`, so every property of every element gets a 0.01ms transition, also where no rule declares one. A media query or `vw` value that changes on resize or rotation therefore keeps its old value for the first frame: on `/ui` resized from 1280px to 360px, `document.getAnimations()` in that frame lists running transitions on `column-gap`/`row-gap` of `.mb-nav`, `padding-*` of `.mb-ui-panel`, `font-size`/`letter-spacing` of `.mb-ui-title`, and `scrollWidth` was 368 (throwaway rAF recorder, every run). KA0085 only stopped the title from overflowing in that frame; any other element whose wide value overflows at a narrow width will do the same, on the public pages too.
- Suggestion: shorten only transitions that are declared, e.g. drop the `transition-duration` override and give the components' own `@media (prefers-reduced-motion: reduce)` blocks the short duration they need, or set `transition-property: none` next to it where nothing listens for `transitionend`; check `contact-form.ts`, `mobile-sheet.ts` and the e2e specs that rely on the 0.01ms transitions (`runningTransitions` in `tests/e2e/ui-catalogue.spec.ts`). The 360px test in `ui-catalogue.spec.ts` (paused animations across the resize) catches a regression on `/ui`.
- Status: ticket KA0086
