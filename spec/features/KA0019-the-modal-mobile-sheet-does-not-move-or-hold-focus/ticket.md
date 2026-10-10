# KA0019 - The modal mobile sheet does not move or hold focus

```json
{
  "id": "KA0019",
  "title": "The modal mobile sheet does not move or hold focus",
  "date": "2026-10-10",
  "after": [
    "KA0022"
  ]
}
```

## Description

KA0015 made the sheet `role="dialog"` with `aria-modal="true"`, but `setOpen` only toggles `data-mobile-sheet`, `aria-hidden`, `aria-expanded` and body overflow: it never moves focus into the dialog on open and sets no `inert` on the page behind it. After a click on the hamburger, focus stays on the trigger, which sits behind the modal; Tab can reach the page under the overlay. Only Escape returns focus (to the trigger). KA0015's Scope left the menu's behaviour out.

## Goal

Keyboard and screen-reader users can use the open mobile menu: focus goes into it and stays there until it closes (vision: axe zero, a11y 100).

- Kind: bug

Evidence:
- `src/scripts/mobile-sheet.ts:29` (`setOpen`)
- Found by: 2026-10-10-mobile-menu-accessible-n-264b11e8 (worker), 2026-10-10

## Done means

- On open, focus moves to the close button and the page behind the sheet is `inert`; on close (X, a link, or Escape) `inert` is removed and focus returns to the trigger. `tests/e2e/mobile-sheet.spec.ts` asserts focus on open, Tab staying inside the sheet, and focus back on the trigger after close by X. The look stays as is.
- `bun run lint`, `bun run check`, `bunx prettier --check "**/*.astro"`, `bun run build` and `bun run test:e2e` pass.

## Scope

In:
- `src/components/layout/mobile-sheet.astro` (its script) and the script that opens it, `tests/e2e/mobile-sheet.spec.ts`.

## Decisions

- 2026-10-10: Source: F1 of KA0015
- 2026-10-10: Approved under the human's standing word (every KA finding approved until the final report).
