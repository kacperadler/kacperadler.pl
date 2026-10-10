# KA0059 - The button's arrow shrinks to nothing in a narrow box

```json
{
  "id": "KA0059",
  "title": "The button's arrow shrinks to nothing in a narrow box",
  "date": "2026-10-10"
}
```

## Description

the icon is a flex item with `width: 14px` and the default `flex-shrink: 1` (plus `max-width: 100%` on every `svg` from `global.css`), so when the button is narrower than its content the arrow gives way first. On `/ui` (no proposal) the Primary · md row renders the arrow at 0×14 px in every state and Primary · sm at about 8×14 px (measured with `getBoundingClientRect()` on `#ui-button ~ .ui-row .btn .btn-icon`); the 160px catalogue cells are the narrow box. The hero has room, so the home page does not show it today; any tight layout (a narrow column, a long label) would.

## Goal

What we are after, what it moves in `spec/vision.md`, and the evidence (file:line, a command and its output). A mechanical, fully specified change (a rename, a moved section, a list of exact edits) adds `- Model: haiku` under Kind; anything with behaviour to judge has no Model line.

- Kind: bug

Evidence:
- `src/components/ui/button.astro` (`.btn :global(.btn-icon)`)
- Found by: 2026-10-10-proposal-modernist-da8a6493 (worker), 2026-10-10

## Done means

- The fix, with a test that proves it: `flex-shrink: 0` on `.btn-icon` (the spinner already has it), and let the catalogue's button cells grow to the button (`.ui-grid` min width) so the forced states show the arrow. Out: the button's look.
- `npm test` and `npm run check` pass. The structure test holds.

## Scope

In:
- `flex-shrink: 0` on `.btn-icon` (the spinner already has it), and let the catalogue's button cells grow to the button (`.ui-grid` min width) so the forced states show the arrow. Out: the button's look.

## Decisions

- 2026-10-10: Source: F1 of KA0041
- 2026-10-10: Dropped by the coordinator: duplicate of KA0058.
