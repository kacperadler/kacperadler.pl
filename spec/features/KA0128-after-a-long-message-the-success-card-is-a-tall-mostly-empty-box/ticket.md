# KA0128 - After a long message the success card is a tall, mostly empty box

```json
{
  "id": "KA0128",
  "title": "After a long message the success card is a tall, mostly empty box",
  "date": "2026-10-28"
}
```

## Description

a grown message box makes the sheet taller, and the success card fills that height with its small content centred in empty space.

## Goal

After sending a long message, the visitor sees a compact "Wiadomość wysłana" card instead of a tall empty box, and the page does not jump.

- Kind: improvement

Evidence:
- `src/components/mb/sections/contact` form and success card sharing one grid cell
- Found by: coordinator, from desktop-4-success.png and review da1c6a33, 2026-10-28

## Done means

- The fix, with a test that proves it: on success the sheet returns to the empty form's height (or the card keeps its natural height), without a layout jump that moves the page.
- `npm test` and `npm run check` pass. The structure test holds.

## Scope

In:
- on success the sheet returns to the empty form's height (or the card keeps its natural height), without a layout jump that moves the page.

## Decisions

- 2026-10-28: Source: F1 of KA0112
