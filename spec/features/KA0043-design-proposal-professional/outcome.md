# KA0043 - Outcome

- Merged: 2026-10-10, `86692e8`
- Branch: h/2026-10-10-proposal-professional-943bf522
- Reviews: review-1.md PASS
- Cost: worker $4.23, reviews $0.57; review rounds 1

## What went in

- `src/styles/proposals/professional/` (`meta.json`, `proposal.css`, Inter woff2 files with `OFL.txt`): the Professional proposal at `/ui/proposal/professional`, dev only: Inter alone, solid panels with a hairline and a faint navy glow, no glass, spotlight or ribbons, left-aligned headings, 200ms color and shadow motion; palette tokens only, the font stays out of the production build.

## Checks on main

- `npm run check`: passed.
- `npm test`: passed.
- CI macOS: off (no H_GITHUB_ACTIONS_TOKEN)

## Left open

- Tickets from findings: KA0062 (F1), KA0063 (F2).
