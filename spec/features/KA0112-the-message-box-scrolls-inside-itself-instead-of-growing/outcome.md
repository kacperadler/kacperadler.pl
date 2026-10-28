# KA0112 - Outcome

- Merged: 2026-10-28, `b7ac93a`
- Branch: h/2026-10-28-ka0112-textarea-grows-857a9e35
- Reviews: review-1.md PASS
- Cost: worker $1.97, reviews $0.44; review rounds 1

## What went in

- textarea.astro: with `field-sizing: content` the message box grows with the text from 5 to 14 lines, then scrolls inside; no resize handle. Browsers without it keep the old 130px box with vertical resize.
- contact-form.spec.ts checks the growth, the cap and that the success card fills the sheet; DESIGN.md describes it.

## Checks on main

- `npm run check`: passed.
- `npm test`: passed.
- CI macOS: off (no H_GITHUB_ACTIONS_TOKEN)

## Left open

- Tickets from findings: KA0128 (F1).
