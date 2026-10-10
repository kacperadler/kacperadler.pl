# KA0017 - Outcome

- Merged: 2026-10-10, `bba607f`
- Branch: h/2026-10-10-drop-light-dark-pairs-c39e3372
- Reviews: review-1.md PASS
- Cost: worker $1.24, reviews $0.61; review rounds 1

## What went in

- `src/styles/tokens.css`, `global.css` and 9 components and layouts: one dark value per color, no `light-dark()` left; computed colors and screenshots byte-identical before and after.
- `AGENTS.md`, a comment in `src/pages/og-default.png.ts`: no longer speak of light/dark pairs.

## Checks on main

- `npm run check`: passed.
- CI macOS: off (no H_GITHUB_ACTIONS_TOKEN)

## Left open

- Findings: none; no findings.md on this ticket.
