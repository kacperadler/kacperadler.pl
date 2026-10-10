# KA0019 - Outcome

- Merged: 2026-10-10, `40e700a`
- Branch: h/2026-10-10-focus-in-mobile-sheet-b69e556b
- Reviews: review-1.md PASS
- Cost: worker $1.05, reviews $0.71; review rounds 1

## What went in

- `src/scripts/mobile-sheet.ts`: opening the mobile menu focuses its close button and makes the page behind it inert; Tab wraps inside; every close clears inert and returns focus to the hamburger.
- `tests/e2e/mobile-sheet.spec.ts`: asserts focus on open, the Tab lap and wrap, and focus back after close by X, link and Escape.

## Checks on main

- `npm run check`: passed.
- `npm test`: passed.
- CI macOS: off (no H_GITHUB_ACTIONS_TOKEN)

## Left open

- Findings: none; no findings.md on this ticket.
