# KA0036 - Outcome

- Merged: 2026-10-10, `a8f5655`
- Branch: h/2026-10-10-software-engineer-title-257297e0
- Reviews: none
- Cost: worker $0.79, reviews $0.00; review rounds 0

## What went in

- `src/data/site-config.ts`: `role` is "Inżynier oprogramowania"; the title, status card, avatar alt, JSON-LD, OG image and `llms*.txt` follow it.
- `src/components/layout/footer.astro`: the tagline reads the role from `siteConfig`.

## Checks on main

- `npm run check`: passed.
- `npm test`: passed.
- CI macOS: off (no H_GITHUB_ACTIONS_TOKEN)

## Left open

- Tickets from findings: KA0050 (F1, folded into KA0047), KA0051 (F2).
