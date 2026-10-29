# KA0131 - Outcome

- Merged: 2026-10-29, `541417a`
- Branch: h/2026-10-29-ka0131-umami-in-tests-cf4e0bc9
- Reviews: review-1.md PASS, review-2.md PASS
- Cost: worker $2.41, reviews $0.91; review rounds 2

## What went in

- The e2e browser cannot resolve the Umami host (`--host-resolver-rules` in playwright.config.ts), so test runs send no pageviews to the production statistics.
- The Umami script tag carries `data-domains` (kacperadler.pl and www), so a local preview or the Docker image on localhost sends nothing either.
- analytics.spec.ts checks both.

## Checks on main

- `npm run check`: passed.
- `npm test`: passed.
- CI macOS: off (no H_GITHUB_ACTIONS_TOKEN)

## Left open

- Tickets from findings: KA0136 (F1).
