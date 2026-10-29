# KA0136 - Outcome

- Merged: 2026-10-29, `e63db3a`
- Branch: h/2026-10-29-ka0136-www-680e2089
- Reviews: review-1.md PASS
- Cost: worker $0.84, reviews $0.47; review rounds 1

## What went in

- Umami counts pageviews only on kacperadler.pl: `analytics.domains` is the apex alone, since www now redirects permanently (Dokploy, set by the human).
- analytics.spec.ts expects `data-domains="kacperadler.pl"`; AGENTS.md says the same.

## Checks on main

- `npm run check`: passed.
- `npm test`: passed.
- CI macOS: off (no H_GITHUB_ACTIONS_TOKEN)

## Left open

- Tickets from findings: KA0138 (F1).
