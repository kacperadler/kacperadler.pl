# KA0015 - Outcome

- Merged: 2026-10-10, `c12cd49`
- Branch: h/2026-10-10-mobile-menu-accessible-n-264b11e8
- Reviews: review-1.md PASS
- Cost: worker $0.62, reviews $0.35; review rounds 1

## What went in

- `src/components/layout/mobile-sheet.astro`: the sheet is a dialog named "Menu mobilne" (`role="dialog"`, `aria-modal`); the look is unchanged.
- `tests/e2e/mobile-sheet.spec.ts`: opens the menu at 375 px, asserts the dialog's name and zero axe violations on it.

## Checks on main

- `npm run check`: passed.
- CI macOS: off (no H_GITHUB_ACTIONS_TOKEN)

## Left open

- Tickets from findings: KA0019 (F1), KA0020 (F2, dropped: KA0016 covers it).
