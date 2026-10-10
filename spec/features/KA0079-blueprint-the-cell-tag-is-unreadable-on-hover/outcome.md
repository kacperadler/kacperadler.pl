# KA0079 - Outcome

- Merged: 2026-10-10, `5677b49`
- Branch: h/2026-10-10-blueprint-tag-hover-8d4dabb7
- Reviews: review-1.md PASS
- Cost: worker $1.35, reviews $0.38; review rounds 1

## What went in

- `src/styles/proposals/blueprint/proposal.css`: the cell tag overrides the card's 3px `::before` rule (`right: auto; height: auto`, `translateY(-50%)` on hover), so its blue box wraps `01.1 ↔ 565` and sits centred on the top rule at rest.
- `tests/e2e/ui-proposals.spec.ts`: at 1440 and 360, every hovered card's tag text fits its opaque box, contrast at least 4.5:1, axe zero.

## Checks on main

- `npm run check`: passed.
- `npm test`: passed.
- CI macOS: off (no H_GITHUB_ACTIONS_TOKEN)

## Left open

- Findings: none; no findings.md on this ticket.
