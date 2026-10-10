# KA0001 - Outcome

- Merged: 2026-10-10, `87eb449`
- Branch: h/2026-10-10-onboard-kacperadler-pl-6c85f5ea
- Reviews: review-1.md PASS, review-2.md PASS
- Cost: worker $2.17, reviews $0.68; review rounds 2

## What went in

- `spec/vision.md`: the portfolio and its offer (with AI agents, automation and training, without email templates), what stays true (Lighthouse, axe, no JS needed, reduced motion, dark-only, no trackers, Polish, Dokploy), the directions (SQLite lead store through one on-demand Astro API route, case studies then blog in Markdown/MDX) and Not the goal (Cloudflare among them).
- `.agents/harness/criteria/review.md`: a branch passes the five CI commands; it fails on a `## Don't` rule, an em-dash, a break of what stays true, or anything under Not the goal.
- `.agents/harness/criteria/styleguide.md`: points to `CLAUDE.md` and `DESIGN.md`, adds ticket scope, `copy(...)` commits, e2e for behaviour, `docker build` for Docker/nginx changes, Markdown/MDX content, no em-dashes.
- `.agents/harness/criteria/audit.md`, `retro.md`: what gets a ticket and what a retro looks for; `autopilot.md` pre-approves nothing.

## Checks on main

- `npm run check`: passed.
- CI macOS: off (no H_GITHUB_ACTIONS_TOKEN)

## Left open

- Tickets from findings: KA0004 (F1), KA0005 (F2), KA0006 (F3); F4 dropped, F5 fixed.
