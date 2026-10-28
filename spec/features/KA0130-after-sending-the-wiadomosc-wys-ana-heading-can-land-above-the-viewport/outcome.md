# KA0130 - Outcome

- Merged: 2026-10-28, `f64413f`
- Branch: h/2026-10-28-ka0130-success-in-view-18f4b55d
- Reviews: review-1.md PASS
- Cost: worker $2.66, reviews $0.68; review rounds 1

## What went in

- contact-form.ts: after a send, revealSuccess focuses the success card without scrolling, and scrolls it in only when "Wiadomość wysłana." is out of view or behind the header (centring the heading when the card is taller than the space under the header); contact-form.astro makes the card focusable.
- contact-form.spec.ts covers the heading above the screen, behind the header, already visible, and a short viewport; AGENTS.md records the rule.

## Checks on main

- `npm run check`: passed.
- `npm test`: passed.
- CI macOS: off (no H_GITHUB_ACTIONS_TOKEN)

## Left open

- Nothing: F1 dropped.
