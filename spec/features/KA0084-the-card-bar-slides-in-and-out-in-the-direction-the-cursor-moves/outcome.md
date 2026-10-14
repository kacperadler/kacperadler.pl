# KA0084 - Outcome

- Merged: 2026-10-14, `ca27cd4`
- Branch: h/2026-10-14-ka0084-card-bar-directio-38e01c48
- Reviews: none; merged unreviewed (--unreviewed): no PASS on 96bf0f5 (last PASS: none, 3 commits since)
- Cost: worker $5.56, reviews $0.47; review rounds 0

## What went in

- `src/components/mb/card.astro`: a short script reads where the mouse enters and leaves a card; the top bar slides in from that side and out toward the exit side (top/bottom picks the nearer side), with the same speed, easing and lag. Touch, keyboard, no JS and reduced motion keep left-to-right.
- `src/components/mb/button.astro`: Secondary no longer gets a border on hover; the face only lifts.
- `src/components/mb/field.astro`: the required `*` is in the error colour and sits 2px after the label text.
- `src/pages/_ui/catalogue.astro`: a "Kierunek" row with a 3-card grid. `DESIGN.md`, `AGENTS.md`: the above described.
- `tests/e2e/ui-catalogue.spec.ts`: bar direction both ways, top/bottom entry, keyboard after a mouse pass, Secondary hover border, asterisk colour and gap. Merged without review at the human's word.

## Checks on main

- `npm run check`: passed.
- `npm test`: passed.
- CI macOS: off (no H_GITHUB_ACTIONS_TOKEN)

## Left open

- Findings: none; no findings.md on this ticket.
