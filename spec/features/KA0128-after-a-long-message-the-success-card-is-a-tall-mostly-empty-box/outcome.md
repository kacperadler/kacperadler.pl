# KA0128 - Outcome

- Merged: 2026-10-28, `d32edd4`
- Branch: h/2026-10-28-ka0128-compact-success-c-a217f217
- Reviews: review-1.md PASS
- Cost: worker $2.99, reviews $0.54; review rounds 1

## What went in

- contact-form.astro: on success the hidden message box drops to its empty height, so after a long message the sheet shrinks back to the empty form's height at its bottom edge and the page does not move.
- contact-form.spec.ts checks the height, the unchanged scroll position and the card filling the sheet; AGENTS.md updated.

## Checks on main

- `npm run check`: passed.
- `npm test`: passed.
- CI macOS: off (no H_GITHUB_ACTIONS_TOKEN)

## Left open

- Tickets from findings: KA0130 (F1).
