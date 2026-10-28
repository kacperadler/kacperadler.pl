# KA0113 - Outcome

- Merged: 2026-10-28, `40a35d6`
- Branch: h/2026-10-28-ka0113-fluid-rhythm-8676d02f
- Reviews: review-1.md PASS
- Cost: worker $5.73, reviews $1.09; review rounds 1

## What went in

- tokens.css: the section and block gaps grow smoothly from 390 to 1160px (88/32px to 136/48px) in rem, with no jump at 880px.
- hero.astro and section-head.astro: headline sizes use rem-based clamps over the same range, so they follow the reader's font size; capped at 12vw/13vw so a large default font never scrolls the page sideways. Between 390 and 1160px headlines are somewhat larger than before.
- design.spec.ts checks the sizes and no sideways scroll; DESIGN.md records the scale.

## Checks on main

- `npm run check`: passed.
- `npm test`: passed.
- CI macOS: off (no H_GITHUB_ACTIONS_TOKEN)

## Left open

- Nothing: F1, F2 dropped.
