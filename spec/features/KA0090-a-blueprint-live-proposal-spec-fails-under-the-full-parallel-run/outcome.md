# KA0090 - Outcome

- Merged: 2026-10-14, `43a16d1`
- Branch: h/2026-10-14-ka0090-ui-proposals-flak-498e28d8
- Reviews: none
- Cost: worker $1.61, reviews $0.00; review rounds 0

## What went in

- `tests/e2e/ui-proposals.spec.ts`: the "cell under the cursor is selected whole" test waits until every CSS transition in the card (pseudo-elements included) has finished before it reads the tag's contrast; the flake was the tag's 0.12s hover colour transition, not the drawing animation. Proposal CSS unchanged.

## Checks on main

- `npm run check`: passed.
- `npm test`: passed.
- CI macOS: off (no H_GITHUB_ACTIONS_TOKEN)

## Left open

- Findings: none; no findings.md on this ticket.
