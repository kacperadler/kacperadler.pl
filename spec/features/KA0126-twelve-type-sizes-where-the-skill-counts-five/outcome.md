# KA0126 - Outcome

- Merged: 2026-10-29, `543eb60`
- Branch: h/2026-10-29-ka0126-type-sizes-f004a3dc
- Reviews: review-1.md PASS
- Cost: worker $7.15, reviews $1.01; review rounds 1

## What went in

- The Geist text uses three main sizes, 14px small, 16px body, 20px lead (13→14, 15/17→16, 18/22→20); the 12px optional hint and xs button stay; headlines, hero figures, mono marks and the brand k are unchanged.
- DESIGN.md: body-lg 20px, caption 14px, a paragraph on the scale.

## Checks on main

- `npm run check`: passed.
- `npm test`: passed.
- CI macOS: off (no H_GITHUB_ACTIONS_TOKEN)

## Left open

- Tickets from findings: KA0140 (F1).
