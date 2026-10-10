# KA0079 - Blueprint: the cell tag is unreadable on hover

```json
{
  "id": "KA0079",
  "title": "Blueprint: the cell tag is unreadable on hover",
  "date": "2026-10-10"
}
```

## Description

In the blueprint proposal (`src/styles/proposals/blueprint/proposal.css:151-185`), hovering a card (and every component styled like one) turns its item tag (`01.1`) into `01.1 ↔ 565` with dark ink text, but the blue fill does not sit behind the text: the text lands on the dark card and can hardly be read. The human's photos: `before-hover.jpg` (rest) and `on-hover.jpg` (hover, the tag at the top left under the blue rule).

## Goal

On hover the tag reads clearly: a blue box that wraps the whole `01.1 ↔ 565` text, dark text on it, as the proposal describes.

- Kind: bug

## Done means

- On hover and forced hover, the tag's background box covers all of its text on every card-like component (services, experience, process steps, contact cells, catalogue samples), at 1440px and 360px; text on it meets WCAG AA (axe zero on `/ui/proposal/blueprint` with a cell hovered).
- An e2e test hovers a card on `/ui/proposal/blueprint` and checks the tag's text box lies inside its background box and the colors differ.
- `bun run lint`, `bun run check`, `bun run build`, `bun run test:e2e` pass.

## Scope

In:
- `src/styles/proposals/blueprint/`, `tests/e2e/ui-proposals.spec.ts`.

Out:
- Other proposals, the live site.

## Decisions

- 2026-10-10: The human: likes blueprint; on hover the tag at the top of cards is dark and barely visible (photos). Merge after PASS.
