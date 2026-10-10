# KA0071 - Outcome

- Merged: 2026-10-10, `6bddfbb`
- Branch: h/2026-10-10-mb-fixes-round-1-182a7c93
- Reviews: review-1.md PASS
- Cost: worker $10.57, reviews $1.82; review rounds 1

## What went in

- `src/components/mb/checkbox.astro`: an unchecked box shows the check at 35% on hover and forced hover.
- `src/components/mb/radio.astro`: the choice chip keeps a 1px frame and weight 500 in every state.
- `src/components/mb/accordion*.astro`: CSS height and chevron animation on open and close, snapping under reduced motion.
- `src/components/mb/pagination.astro`: optional `jump` GET form ("Strona", "Idź"); `/ui` renders on request to read `?strona=`.
- `src/components/mb/breadcrumb.astro`: the `…` opens a native popover menu of hidden items.
- `src/components/mb/badge.astro`: `tag` and `status` variants; `tag.astro` and `status-pill.astro` removed, callers moved (services, hero, sheet, `/ui`, `realizacje/[slug]`).
- Buttons, links, cards, badges, inputs, nav: short hover, press and focus motion, off under reduced motion.
- `tests/e2e/`: chip weight and box, badge variants, accordion, breadcrumb menu, page jump, reduced motion.

## Checks on main

- `npm run check`: passed.
- `npm test`: passed.
- CI macOS: off (no H_GITHUB_ACTIONS_TOKEN)

## Left open

- Tickets from findings: KA0078 (F1).
