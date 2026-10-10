# KA0015 - The mobile menu has no accessible name

```json
{
  "id": "KA0015",
  "title": "The mobile menu has no accessible name",
  "date": "2026-10-10"
}
```

## Description

KA0003's Biome 2.5 forbids `aria-label` on a plain `div`, so `src/components/layout/mobile-sheet.astro` lost `aria-label="Menu mobilne"`. The mobile menu now has no accessible name for screen readers.

## Goal

The vision keeps axe at zero violations and a11y at 100: the opened mobile menu is announced with a name, as a dialog or navigation landmark, and lint stays green.

- Kind: bug

## Done means

- The mobile sheet has a role that takes a name (`role="dialog"` with `aria-modal`, or a `<nav>`), named "Menu mobilne"; an e2e spec opens the menu at mobile width and asserts the accessible name and zero axe violations on the open menu.
- `bun run lint`, `bun run check`, `bunx prettier --check "**/*.astro"`, `bun run build` and `bun run test:e2e` pass.

## Scope

In:
- `src/components/layout/mobile-sheet.astro`, a spec in `tests/e2e/`.

Out:
- Any other change to the menu's look or behaviour.

## Decisions

- 2026-10-10: Source: review note on KA0003 (2026-10-10-review-deps-and-astro-7-3f9b93b9's first review); waits for the human's approval.
- 2026-10-10: The human approved it.
