# KA0081 - Outcome

- Merged: 2026-10-11, `c73d020`
- Branch: h/2026-10-11-ka0081-static-rulers-5d56c4d5
- Reviews: review-1.md PASS, review-2.md PASS, review-3.md PASS
- Cost: worker $15.25, reviews $2.15; review rounds 3

## What went in

- `src/styles/proposals/blueprint-live/proposal.css`: the side rulers draw down once on load and then stand still (no scroll animation); every part draws on a fixed 1.8s pen once it is on screen, each stage eased on its own, and stays drawn; no script or reduced motion shows the drawing complete.
- `src/styles/proposals/blueprint-live/meta.json`: the description matches the new drawing.
- `src/pages/_ui/proposal/[id].astro`: an inline script, only on blueprint-live, marks the page live and marks each part drawn once it is whole on screen (or fills it, or was skipped by a fast scroll).
- `tests/e2e/ui-proposals.spec.ts`: rulers do not move on scroll, a part on screen draws to the end without further scrolling, drawn parts stay after scrolling back, everything drawn without script or motion.

## Checks on main

- `npm run check`: passed.
- `npm test`: passed.
- CI macOS: off (no H_GITHUB_ACTIONS_TOKEN)

## Left open

- Tickets from findings: KA0082 (F1).
