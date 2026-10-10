# KA0008 - Outcome

- Merged: 2026-10-10, `977143c`
- Branch: h/2026-10-10-design-md-dark-only-at-78ab9b6c
- Reviews: review-1.md PASS
- Cost: worker $1.11, reviews $0.32; review rounds 1

## What went in

- `DESIGN.md`: one dark site at `/`: no `/v2`, theme toggle or light values; frontmatter colors are what `tokens.css` renders; `## Dark only` maps each token to its property; the dot grid and spotlight point at `base-layout.astro` and `global.css`.
- `.agents/harness/criteria/styleguide.md`, `review.md`, `retro.md`: no "DESIGN.md is stale" exceptions.

## Checks on main

- `npm run check`: passed.
- CI macOS: off (no H_GITHUB_ACTIONS_TOKEN)

## Left open

- Tickets from findings: KA0017 (F1), KA0018 (F2, dropped: KA0016 covers it).
