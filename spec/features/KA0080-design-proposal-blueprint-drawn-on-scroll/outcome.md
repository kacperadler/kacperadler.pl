# KA0080 - Outcome

- Merged: 2026-10-10, `a7c100d`
- Branch: h/2026-10-10-blueprint-live-644ca020
- Reviews: review-1.md PASS
- Cost: worker $5.78, reviews $0.73; review rounds 1

## What went in

- `src/styles/proposals/blueprint-live/` (`meta.json`, `proposal.css`): the Blueprint na żywo proposal at `/ui/proposal/blueprint-live`, dev only: blueprint's look (with KA0079's hover tag fix) drawn by CSS scroll-driven animations in stages (rule, ticks, width and labels, callout), undrawn on scroll back; the hero draws once on load; fully drawn under reduced motion or without support.
- `tests/e2e/ui-proposals.spec.ts`: it draws on scroll and stands whole without motion.

## Checks on main

- `npm run check`: passed.
- `npm test`: passed.
- CI macOS: off (no H_GITHUB_ACTIONS_TOKEN)

## Left open

- Findings: none; no findings.md on this ticket.
