# KA0140 - The mono marks still carry four sizes, so `size-count` stays a WARN

```json
{
  "id": "KA0140",
  "title": "The mono marks still carry four sizes, so `size-count` stays a WARN",
  "date": "2026-10-29",
  "after": [
    "KA0135"
  ]
}
```

## Description

after KA0126 the text face keeps 12 / 14 / 16 / 20 besides the headlines and figures, but the Taste Skill `inspect.mjs` still counts 10 sizes on the home page at 1440 (`11, 12, 13, 14, 15, 16, 20, 30, 54, 64`, `size-count` WARN, was 12), because the ticket kept the mono marks and the brand mark at their sizes. The 13px and 15px left are one element each: the service step number and the brand mark.

## Goal

The mono marks (11-14px: section numbers, drawing labels, pagination, avatars) and the brand k (15px, also the favicon) fold into the same few sizes as the text, so the page carries one type scale. Small visual change in the drawing-like details.

- Kind: improvement

Evidence:
- Geist Mono at 11px (`src/components/mb/badge.astro:77`, badges), 12px (`src/components/mb/section-head.astro:103`, the section label; footer copyright), 13px (`src/components/mb/sections/services.astro:97`, a step's `01`), 14px (`src/components/mb/step-marker.astro:97`, the process rail's numbers; the skip link in `src/styles/global.css:91`); the brand mark's `k` in Geist at 15px (`src/components/mb/brand.astro:47`)
- Found by: 2026-10-29-ka0126-type-sizes-f004a3dc (worker), 2026-10-29

## Done means

- The fix, with a test that proves it: if the human wants the WARN gone, fold the mono marks to two sizes (11/12 for labels and badges, 14 for the numbers: the service step number 13 → 14) and the brand mark's `k` 15 → 14 or 16 with `public/favicon.svg` / `favicon.ico` redrawn to match (DESIGN.md: brand mark). Touches the drawing (KA0098) and the brand mark, which AGENTS.md guards; the human decides.
- `npm test` and `npm run check` pass. The structure test holds.

## Scope

In:
- if the human wants the WARN gone, fold the mono marks to two sizes (11/12 for labels and badges, 14 for the numbers: the service step number 13 → 14) and the brand mark's `k` 15 → 14 or 16 with `public/favicon.svg` / `favicon.ico` redrawn to match (DESIGN.md: brand mark). Touches the drawing (KA0098) and the brand mark, which AGENTS.md guards; the human decides.

## Decisions

- 2026-10-29: Source: F1 of KA0126
- 2026-10-29: The human approved it ("KA0140 zatwierdzam"), against the recommendation to drop; the favicon k follows the brand k.
