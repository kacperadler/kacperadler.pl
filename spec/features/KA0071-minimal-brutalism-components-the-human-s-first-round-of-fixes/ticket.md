# KA0071 - Minimal brutalism components: the human's first round of fixes

```json
{
  "id": "KA0071",
  "title": "Minimal brutalism components: the human's first round of fixes",
  "date": "2026-10-10",
  "after": [
    "KA0069"
  ]
}
```

## Description

The human clicked through `/ui/mb` (KA0068): "overall it looks great", with these fixes to the components in `src/components/mb/`.

## Goal

The components feel finished: nothing jumps, things that open animate, and small interactions respond.

- Kind: improvement

## Done means

- Checkbox: on hover an unchecked box shows the check icon faintly (low opacity, visible but weak); forced `data-state="hover"` shows the same.
- Radio `choice`: checking it moves nothing; border width (or outline) is the same in every state, and an e2e test compares the chip's bounding box unchecked vs checked.
- Accordion: opening and closing animate (height and the chevron), with `<details>` kept; under `prefers-reduced-motion` they snap.
- Pagination: a way to go to a given page (a small page-number field with a go button, working without JavaScript as a GET form or link), alongside the numbers.
- Tag and status pill become variants of `badge` (`mb/badge.astro`); `tag.astro` and `status-pill.astro` are removed and their uses in `src/components/mb/` and `/ui/mb` move to badge.
- Breadcrumb: the collapsed `…` opens a small menu with the hidden items (native `<details>` or the popover attribute, no JavaScript library), keyboard and screen reader usable, closes on Esc and outside click; e2e covers opening it and following an item.
- Micro-animations: buttons, links, cards, badges, inputs and the nav respond to hover, press and focus with short, subtle motion in the style (hard-shadow shift, underline draw, arrow nudge), all off under `prefers-reduced-motion`.
- Axe zero on `/ui/mb` at 1440 and 360, no sideways scroll at 360, production build byte-identical except what KA0069 already ships; `bun run lint`, `bun run check`, `bun run build`, `bun run test:e2e` pass.

## Scope

In:
- `src/components/mb/`, `src/pages/_ui/mb/`, `tests/e2e/ui-mb.spec.ts`, `DESIGN.md`.

Out:
- The signature (KA0072).

## Decisions

- 2026-10-10: The human, on /ui/mb: 1. checkbox: show the check faintly on hover; 2. choice shifts when checked (border); 3. accordion should animate open and close; 4. breadcrumb (note to follow); 5. pagination lacks going to a given page; 6. tag and status pill: why not badge? Plus: micro-animations missing. The coordinator: tag and status pill become badge variants; after KA0069, which edits the same files; merge after PASS.
- 2026-10-10: The human: breadcrumb `…` should open a dropdown menu of the hidden items.
