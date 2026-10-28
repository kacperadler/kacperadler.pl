# KA0112 - The message box scrolls inside itself instead of growing

```json
{
  "id": "KA0112",
  "title": "The message box scrolls inside itself instead of growing",
  "date": "2026-10-28",
  "after": [
    "KA0110"
  ]
}
```

## Description

good-css "Textarea that grows with its content" (`interaction.md`): `field-sizing: content` with `min-height` / `max-height` in `lh`. Today a longer message scrolls inside a 130px box (or the visitor drags the corner); with it the box grows line by line up to the cap, and the contact sheet grows with it. Chrome 123, Safari 26.2, Firefox 152; older browsers keep today's box.

## Goal

The contact message box grows with the text instead of scrolling inside itself.

- Kind: improvement

Evidence:
- `src/components/mb/textarea.astro:17-34` (`min-height: 130px`, `resize: vertical`)
- Found by: 2026-10-28-ka0104-good-css-audit-d0007900 (worker), 2026-10-28

## Done means

- The fix, with a test that proves it: `field-sizing: content; min-height: 5lh; max-height: 14lh` (values to tune), keep `resize` or drop it. The form and the success card share one grid cell so the sheet keeps its height after sending (AGENTS.md, contact); a taller form makes a taller cell and the success card fills it, which the review checks. Cost: 3 lines. Out: the animated wrapper with a ResizeObserver (it would add a script and a second slide).
- `npm test` and `npm run check` pass. The structure test holds.

## Scope

In:
- `field-sizing: content; min-height: 5lh; max-height: 14lh` (values to tune), keep `resize` or drop it. The form and the success card share one grid cell so the sheet keeps its height after sending (AGENTS.md, contact); a taller form makes a taller cell and the success card fills it, which the review checks. Cost: 3 lines. Out: the animated wrapper with a ResizeObserver (it would add a script and a second slide).

## Decisions

- 2026-10-28: Source: F8 of KA0104
- 2026-10-28: The human approved it; runs one at a time after KA0110 (shared CSS files).
