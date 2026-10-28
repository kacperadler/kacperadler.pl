# KA0108 - Outcome

- Merged: 2026-10-28, `a1ead45`
- Branch: h/2026-10-28-ka0108-ios-form-zoom-a732fb46
- Reviews: review-1.md FAIL, review-2.md PASS, review-3.md PASS
- Cost: worker $3.51, reviews $1.41; review rounds 3

## What went in

- input.astro, textarea.astro and the pagination page-jump input use `max(16px, 1rem)`, so iOS Safari does not zoom the page when a field is tapped.
- global.css sets `-webkit-text-size-adjust: 100%` on the root, so text keeps its size in landscape; the 404 page centres in `100svh`, the visible screen.
- tests/e2e/ios-safari.spec.ts checks the field sizes (three on the home page, with Firma), the text-size-adjust and the 404's height; AGENTS.md records the iOS Safari convention.

## Checks on main

- `npm run check`: passed.
- `npm test`: passed.
- CI macOS: off (no H_GITHUB_ACTIONS_TOKEN)

## Left open

- The human's iPhone check (F1); nothing else.
