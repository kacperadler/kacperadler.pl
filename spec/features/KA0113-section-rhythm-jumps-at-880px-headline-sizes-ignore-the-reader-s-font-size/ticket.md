# KA0113 - Section rhythm jumps at 880px; headline sizes ignore the reader's font size

```json
{
  "id": "KA0113",
  "title": "Section rhythm jumps at 880px; headline sizes ignore the reader's font size",
  "date": "2026-10-28",
  "after": [
    "KA0128"
  ]
}
```

## Description

good-css "Fluid sizes with `clamp()`" (`foundations.md`): fluid values in one token, preferred value `rem + vw`, bounds in `rem`. Today the gap between sections drops by 48px in one step when the window crosses 880px, and the headline clamps use px bounds and a bare `vw`, so a reader who sets a larger default font in the browser gets the same headlines (and, with the body in px, the same body text). Two clamp tokens for the gaps keep 136/48 at 1440 and 88/32 at 390 and interpolate in between; rem bounds let headlines follow the reader's setting.

## Goal

Section spacing and headline sizes change smoothly with the screen width and follow the reader's font-size setting.

- Kind: improvement

Evidence:
- `src/styles/tokens.css:58-59,95-100` (`--mb-section-gap` 136px → 88px, `--mb-block-gap` 48px → 32px at 880px); `src/components/mb/sections/hero.astro:170`, `src/components/mb/section-head.astro:119`, `src/pages/404.astro:55` (`clamp(px, vw, px)`); `src/styles/global.css:16` (`body { font-size: 16px }`)
- Found by: 2026-10-28-ka0104-good-css-audit-d0007900 (worker), 2026-10-28

## Done means

- The fix, with a test that proves it: `--mb-section-gap` and `--mb-block-gap` as `clamp(rem, rem + vw, rem)` worked out from the 390 and 1160 points, the 880px block removed; the three headline clamps rewritten in `rem + vw`. Cost: about 8 lines, `DESIGN.md` updated with the tokens; 1440 and 390 stay pixel-identical for the gaps, widths in between change. Out: converting the 99 px font sizes of the components to a fluid scale (F16).
- `npm test` and `npm run check` pass. The structure test holds.

## Scope

In:
- `--mb-section-gap` and `--mb-block-gap` as `clamp(rem, rem + vw, rem)` worked out from the 390 and 1160 points, the 880px block removed; the three headline clamps rewritten in `rem + vw`. Cost: about 8 lines, `DESIGN.md` updated with the tokens; 1440 and 390 stay pixel-identical for the gaps, widths in between change. Out: converting the 99 px font sizes of the components to a fluid scale (F16).

## Decisions

- 2026-10-28: Source: F9 of KA0104
- 2026-10-28: The human approved it; runs one at a time after KA0109 (shared CSS files).
