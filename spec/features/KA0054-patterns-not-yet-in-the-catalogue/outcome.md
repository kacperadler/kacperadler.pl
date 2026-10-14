# KA0054 - Outcome

- Merged: 2026-10-14, `4759f70`
- Branch: h/2026-10-14-ka0054-contact-link-step-7f2526ae
- Reviews: review-1.md PASS, review-2.md PASS
- Cost: worker $6.34, reviews $1.07; review rounds 2

## What went in

- `src/components/mb/step-marker.astro` (new): the numbered square on its 1px rail, vertically centred on its card whatever the card's height; the rail runs from the first marker's centre to the last; it fills blue when its card is hovered (forced hover on `/ui` too).
- `src/components/mb/contact-link.astro` (new): a whole-cell link with icon, label and value; `newTab` adds `target="_blank"` and `rel="noopener"`.
- `src/components/mb/sections/how-i-work.astro`, `contact.astro`: use the two components; their style copies are gone; the home page renders as before apart from the centring.
- `src/pages/_ui/catalogue.astro`: "Znacznik etapu" (idle, hover, a three-step rail on cards of unequal height) and "Link kontaktowy" (idle, hover, pressed, focus-visible, side by side, narrow cell).
- `tests/e2e/ui-catalogue.spec.ts`: marker centre within 1px of its card's centre on `/ui` and home at 1440 and 390px; unbroken rail. `DESIGN.md`, `AGENTS.md`: the two components.
- `findings.md`: F1, a flaky motion test (ticket KA0088).

## Checks on main

- `npm run check`: passed.
- `npm test`: passed.
- CI macOS: off (no H_GITHUB_ACTIONS_TOKEN)

## Left open

- Tickets from findings: KA0088 (F1).
