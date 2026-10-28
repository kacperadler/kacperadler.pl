# KA0116 - A global rule strips every transition under reduced motion

```json
{
  "id": "KA0116",
  "title": "A global rule strips every transition under reduced motion",
  "date": "2026-10-28"
}
```

## Description

good-css "Opt-in motion" (`motion.md`): build the state, put only the movement inside `prefers-reduced-motion: no-preference`, and never strip motion afterwards with a global `0.01ms` rule; colour and opacity fades are not motion and may stay. The site does the reverse twice: a global block and one `reduce` block per component, both also killing the 0.12s colour fades. Visible change: under reduced motion, hover and focus colours fade in 0.12s instead of switching; nothing for everyone else.

## Goal

Reduced motion removes movement but keeps harmless colour and opacity fades.

- Kind: cleanup

Evidence:
- `src/styles/global.css:95-104` (the global block); 22 `prefers-reduced-motion: reduce` blocks in 21 files that set `transition: none` (e.g. `mobile-sheet.astro:188-195`, `link.astro:213-224`), against 7 `no-preference` blocks (`rg -c`, outside /ui); `src/styles/global.css:9-11` (`scroll-behavior: smooth` outside a motion query)
- Found by: 2026-10-28-ka0104-good-css-audit-d0007900 (worker), 2026-10-28

## Done means

- The fix, with a test that proves it: move each transform transition (button face, nav underline `link.astro:101-113`, sheet arrow `mobile-sheet.astro:166-175`, case arrow `link.astro:159,204-210`, skip link `global.css:63`, accordion chevron) and `scroll-behavior: smooth` into `no-preference` blocks, then delete the 22 `reduce` blocks and the global one. Cost: 21 component files, [INFERENCE] about 100 lines removed, `blueprint.spec.ts` and `mobile-sheet.spec.ts` reduced-motion cases rerun. Keep today's blocks if reduced motion is meant to mean no fades either: that is the human's call.
- `npm test` and `npm run check` pass. The structure test holds.

## Scope

In:
- move each transform transition (button face, nav underline `link.astro:101-113`, sheet arrow `mobile-sheet.astro:166-175`, case arrow `link.astro:159,204-210`, skip link `global.css:63`, accordion chevron) and `scroll-behavior: smooth` into `no-preference` blocks, then delete the 22 `reduce` blocks and the global one. Cost: 21 component files, [INFERENCE] about 100 lines removed, `blueprint.spec.ts` and `mobile-sheet.spec.ts` reduced-motion cases rerun. Keep today's blocks if reduced motion is meant to mean no fades either: that is the human's call.

## Decisions

- 2026-10-28: Source: F12 of KA0104
