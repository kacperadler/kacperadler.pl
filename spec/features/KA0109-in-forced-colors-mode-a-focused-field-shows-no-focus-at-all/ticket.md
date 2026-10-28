# KA0109 - In forced-colors mode a focused field shows no focus at all

```json
{
  "id": "KA0109",
  "title": "In forced-colors mode a focused field shows no focus at all",
  "date": "2026-10-28",
  "after": [
    "KA0112"
  ]
}
```

## Description

good-css "One focus ring with `:focus-visible`" (`interaction.md`): a component that draws its ring with `box-shadow` keeps `outline-color: transparent`, never `outline: none`. The fields set `outline: none` and show focus with the blue hard shadow. Measured on the focused email field with Playwright `forcedColors: "active"`: `outline-style: none`, `box-shadow: none`, so nothing marks the field the visitor is typing in (Windows High Contrast users). Normal mode is unchanged by the fix.

## Goal

A visitor using Windows high-contrast mode sees which form field has focus.

- Kind: bug

Evidence:
- `src/components/mb/input.astro:31,49-52`; `src/components/mb/textarea.astro:27,45-48`; `src/components/mb/pagination.astro:269`
- Found by: 2026-10-28-ka0104-good-css-audit-d0007900 (worker), 2026-10-28

## Done means

- The fix, with a test that proves it: replace `outline: none` with `outline: 2px solid transparent` in the three places, so forced colors repaint it as a visible ring. Cost: 3 lines, an a11y spec case under `forcedColors: "active"` that the focused field has a non-`none` outline.
- `npm test` and `npm run check` pass. The structure test holds.

## Scope

In:
- replace `outline: none` with `outline: 2px solid transparent` in the three places, so forced colors repaint it as a visible ring. Cost: 3 lines, an a11y spec case under `forcedColors: "active"` that the focused field has a non-`none` outline.

## Decisions

- 2026-10-28: Source: F5 of KA0104
- 2026-10-28: The human approved it; runs one at a time after KA0112 (shared CSS files).
- 2026-10-28: The coordinator accepted the worker's variant: drop `outline: none` from the base rules and put `outline: 2px solid transparent` in each focus rule, because the literal swap framed every resting field in forced colors and the focused one least (screenshot rejected-base-rule.png).
