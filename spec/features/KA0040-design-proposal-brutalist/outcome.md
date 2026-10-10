# KA0040 - Outcome

- Merged: 2026-10-10, `9ae67a7`
- Branch: h/2026-10-10-proposal-brutalist-dfb37297
- Reviews: review-1.md PASS
- Cost: worker $6.21, reviews $0.54; review rounds 1

## What went in

- `src/styles/proposals/brutalist/` (`meta.json`, `proposal.css`, Space Grotesk latin and latin-ext with `OFL.txt`): the Brutalist proposal at `/ui/proposal/brutalist`, dev only: zero radius, 2-3px cream borders, a line grid, hard offset shadows and colour flips for states; the font stays out of the production build.
- `tests/e2e/ui-proposals.spec.ts`: axe now runs on every proposal folder, not only `baseline`.

## Checks on main

- `npm run check`: passed.
- `npm test`: passed.
- CI macOS: off (no H_GITHUB_ACTIONS_TOKEN)

## Left open

- Findings: none; no findings.md on this ticket.
