# KA0086 - Under reduced motion every restyle lags one frame on every page

```json
{
  "id": "KA0086",
  "title": "Under reduced motion every restyle lags one frame on every page",
  "date": "2026-10-14"
}
```

## Description

the reduced-motion block sets `transition-duration: 0.01ms !important` on `*`, and `transition-property` defaults to `all`, so every property of every element gets a 0.01ms transition, also where no rule declares one. A media query or `vw` value that changes on resize or rotation therefore keeps its old value for the first frame: on `/ui` resized from 1280px to 360px, `document.getAnimations()` in that frame lists running transitions on `column-gap`/`row-gap` of `.mb-nav`, `padding-*` of `.mb-ui-panel`, `font-size`/`letter-spacing` of `.mb-ui-title`, and `scrollWidth` was 368 (throwaway rAF recorder, every run). KA0085 only stopped the title from overflowing in that frame; any other element whose wide value overflows at a narrow width will do the same, on the public pages too.

## Goal

With reduced motion on, a resize or state change shows its final style in the same frame on every page, so no element can briefly overflow or flash an old style; reduced motion still means no movement.

- Kind: bug

Evidence:
- `src/styles/global.css:92-101`
- Found by: 2026-10-14-ka0085-360px-scroll-ada4546a (worker), 2026-10-14

## Done means

- The fix, with a test that proves it: shorten only transitions that are declared, e.g. drop the `transition-duration` override and give the components' own `@media (prefers-reduced-motion: reduce)` blocks the short duration they need, or set `transition-property: none` next to it where nothing listens for `transitionend`; check `contact-form.ts`, `mobile-sheet.ts` and the e2e specs that rely on the 0.01ms transitions (`runningTransitions` in `tests/e2e/ui-catalogue.spec.ts`). The 360px test in `ui-catalogue.spec.ts` (paused animations across the resize) catches a regression on `/ui`.
- `npm test` and `npm run check` pass. The structure test holds.

## Scope

In:
- shorten only transitions that are declared, e.g. drop the `transition-duration` override and give the components' own `@media (prefers-reduced-motion: reduce)` blocks the short duration they need, or set `transition-property: none` next to it where nothing listens for `transitionend`; check `contact-form.ts`, `mobile-sheet.ts` and the e2e specs that rely on the 0.01ms transitions (`runningTransitions` in `tests/e2e/ui-catalogue.spec.ts`). The 360px test in `ui-catalogue.spec.ts` (paused animations across the resize) catches a regression on `/ui`.

## Decisions

- 2026-10-14: Source: F1 of KA0085
- 2026-10-14: The human approved the ticket.
