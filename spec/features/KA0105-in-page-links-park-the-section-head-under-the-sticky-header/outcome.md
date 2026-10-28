# KA0105 - Outcome

- Merged: 2026-10-28, `2a54f5c`
- Branch: h/2026-10-28-ka0105-good-css-top-3-a7ede390
- Reviews: review-1.md PASS
- Cost: worker $4.15, reviews $0.65; review rounds 1

## What went in

- tokens.css holds the header height (`--mb-header`) per width; global.css parks every in-page link target 8px under the sticky header and sets text-wrap: pretty on running text, so no lone last word.
- header.astro uses that height and goes to two rows below 360px; mobile-sheet.astro scrolls on a landscape phone so the button stays reachable.
- e2e specs cover the anchor landing, the wrap and the landscape sheet; AGENTS.md and DESIGN.md describe them. This also carries KA0106 and KA0107.

## Checks on main

- `npm run check`: passed.
- `npm test`: passed.
- CI macOS: off (no H_GITHUB_ACTIONS_TOKEN)

## Left open

- Nothing: F1, F2 dropped.
