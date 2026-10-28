# KA0102 - The 404 page's rule is the one line the pen does not draw

```json
{
  "id": "KA0102",
  "title": "The 404 page's rule is the one line the pen does not draw",
  "date": "2026-10-28"
}
```

## Description

The 404 page opens with its own `ink` rule over the mono `404` (`.mb-not-found-inner`, `border-top`), not a `section-head.astro`, so on that page only the rulers and the footer draw; the rule over the message stands from the start. Every other page opens with a section head, whose rule runs out as a dimension line.

## Goal

The 404 page's top rule looks like the rest of the blueprint: a dimension line with ticks like every section head. Since a483399 nothing below the first screen draws on scroll, so the open question is only the static look, not the animation.

- Kind: improvement

Evidence:
- `src/pages/404.astro:38`
- Found by: 2026-10-28-ka0098-blueprint-live-li-4aa472de (worker), 2026-10-28

## Done means

- The fix, with a test that proves it: Give `.mb-not-found-inner` the section head's drawing (the rule by `background-size` over `--bl-e`, ticks, the dimension), or build the 404 on `section-head.astro` with `404` as its label. Out: the blueprint elsewhere, which this ticket carries.
- `npm test` and `npm run check` pass. The structure test holds.

## Scope

In:
- Give `.mb-not-found-inner` the section head's drawing (the rule by `background-size` over `--bl-e`, ticks, the dimension), or build the 404 on `section-head.astro` with `404` as its label. Out: the blueprint elsewhere, which this ticket carries.

## Decisions

- 2026-10-28: Source: F1 of KA0098
- 2026-10-28: The human approved it.
