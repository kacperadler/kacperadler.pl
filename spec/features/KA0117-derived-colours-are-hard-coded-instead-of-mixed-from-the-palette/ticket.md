# KA0117 - Derived colours are hard-coded instead of mixed from the palette

```json
{
  "id": "KA0117",
  "title": "Derived colours are hard-coded instead of mixed from the palette",
  "date": "2026-10-28"
}
```

## Description

good-css "OKLCH color" (`foundations.md`): derive tints from the base, no second hard-coded value. `--v2-line` repeats the ink's RGB, so a change to `--ink` leaves the hairline behind. Measured on `--v2-bg`: today's hairline paints rgb(32, 34, 36); good-css's `color-mix(in oklch, var(--ink) 10%, transparent)` paints rgb(33, 33, 38), a cooler grey; `oklch(from var(--ink) l c h / 0.1)` and `color-mix(in srgb, ...)` paint rgb(32, 34, 36), identical. The srgb mixes are on the destructive button and badge, which only the /ui catalogue renders.

## Goal

Hover and tint colours are mixed from the palette, so changing a base colour changes its family too.

- Kind: cleanup

Evidence:
- `src/styles/tokens.css:47` (`--v2-line: rgba(236, 231, 220, 0.1)`, a copy of `--ink`); `src/components/mb/button.astro:363,424`, `src/components/mb/badge.astro:169` (`color-mix(in srgb, ...)`)
- Found by: 2026-10-28-ka0104-good-css-audit-d0007900 (worker), 2026-10-28

## Done means

- The fix, with a test that proves it: `--v2-line: oklch(from var(--ink) l c h / 0.1)` (relative colour syntax; Chromium renders it, other engines unchecked), `DESIGN.md:107` updated; leave the destructive mixes, nothing on the site shows them. Visible change: none. Cost: 2 lines. Out: rewriting the hex palette in `oklch()` (F14).
- `npm test` and `npm run check` pass. The structure test holds.

## Scope

In:
- `--v2-line: oklch(from var(--ink) l c h / 0.1)` (relative colour syntax; Chromium renders it, other engines unchecked), `DESIGN.md:107` updated; leave the destructive mixes, nothing on the site shows them. Visible change: none. Cost: 2 lines. Out: rewriting the hex palette in `oklch()` (F14).

## Decisions

- 2026-10-28: Source: F13 of KA0104
