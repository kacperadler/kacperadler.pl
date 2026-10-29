# KA0127 - Outcome

- Merged: 2026-10-29, `9aaa0d7`
- Branch: h/2026-10-29-ka0127-logos-4b88a47a
- Reviews: review-1.md FAIL, review-2.md PASS
- Cost: worker $2.37, reviews $0.94; review rounds 2

## What went in

- trust.astro and cases.astro: the grey resting logo style moved inside the (hover: hover) and (pointer: fine) query, so phones show the client logos in colour; a mouse still sees grey until hover.
- touch-hover.spec.ts checks both sides; AGENTS.md and DESIGN.md say so. The About experience logos stay grey, by the human's decision.

## Checks on main

- `npm run check`: passed.
- `npm test`: passed.
- CI macOS: off (no H_GITHUB_ACTIONS_TOKEN)

## Left open

- Tickets from findings: KA0141 (F1).
