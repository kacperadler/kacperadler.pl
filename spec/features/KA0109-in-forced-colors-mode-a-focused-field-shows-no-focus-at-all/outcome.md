# KA0109 - Outcome

- Merged: 2026-10-28, `8d9d6c5`
- Branch: h/2026-10-28-ka0109-forced-colors-foc-fc77cf00
- Reviews: review-1.md PASS
- Cost: worker $1.59, reviews $0.45; review rounds 1

## What went in

- input.astro, textarea.astro and the pagination "Strona" field: the base rules no longer set `outline: none`; each focus rule sets `outline: 2px solid transparent`, so in Windows high-contrast mode the focused field gets a visible ring and the resting fields none, while normal mode looks as before.
- a11y.spec.ts checks both modes on the form fields and the pagination field.

## Checks on main

- `npm run check`: passed.
- `npm test`: passed.
- CI macOS: off (no H_GITHUB_ACTIONS_TOKEN)

## Left open

- Tickets from findings: KA0129 (F1).
