# KA0070 - Under reduced motion the mobile sheet opens without focus on its close button

```json
{
  "id": "KA0070",
  "title": "Under reduced motion the mobile sheet opens without focus on its close button",
  "date": "2026-10-10"
}
```

## Description

with `prefers-reduced-motion: reduce`, opening the menu on the home page at 360px leaves focus on `<body>` instead of the "Zamknij menu" button; the sheet itself is visible and Tab then wraps inside it. Cause: global.css sets `transition-duration: 0.01ms !important` on every element, and an element with no `transition` of its own has `transition-property: all`, so the sheet's children fade their inherited `visibility` in over 0.01ms and are still `hidden` at the moment `scripts/mobile-sheet.ts` calls `focus()`. Reproduced with Playwright (`reducedMotion: "reduce"`, viewport 360x800, `/` on `bun dev`, click `[data-menu-open]`, read `document.activeElement`): `<body>`; without reduced motion it is the close button. `tests/e2e/mobile-sheet.spec.ts` runs without reduced motion, so it does not see it.

## Goal

What we are after, what it moves in `spec/vision.md`, and the evidence (file:line, a command and its output). A mechanical, fully specified change (a rename, a moved section, a list of exact edits) adds `- Model: haiku` under Kind; anything with behaviour to judge has no Model line.

- Kind: bug

Evidence:
- `src/styles/global.css:92-100`, `src/components/layout/mobile-sheet.astro:63-90`
- Found by: 2026-10-10-mb-components-394266f9 (worker), 2026-10-10

## Done means

- The fix, with a test that proves it: in the reduced-motion block of `layout/mobile-sheet.astro`, set `transition-property: none` on `.sheet :global(*)` as `mb/mobile-sheet.astro` does (KA0068), and run the focus assertions of `mobile-sheet.spec.ts` under `reducedMotion: "reduce"` too. KA0069 replaces the sheet with the mb one, so this can also be dropped if KA0069 lands first.
- `npm test` and `npm run check` pass. The structure test holds.

## Scope

In:
- in the reduced-motion block of `layout/mobile-sheet.astro`, set `transition-property: none` on `.sheet :global(*)` as `mb/mobile-sheet.astro` does (KA0068), and run the focus assertions of `mobile-sheet.spec.ts` under `reducedMotion: "reduce"` too. KA0069 replaces the sheet with the mb one, so this can also be dropped if KA0069 lands first.

## Decisions

- 2026-10-10: Source: F1 of KA0068
- 2026-10-10: The coordinator: KA0069 replaces the old sheet with mb/mobile-sheet.astro, which has the fix; drop this ticket once KA0069 merges if the bug is gone.
- 2026-10-10: Dropped by the coordinator: KA0069 replaced the old sheet with mb/mobile-sheet.astro; the reduced-motion focus test passes and its review mutation confirmed it.
