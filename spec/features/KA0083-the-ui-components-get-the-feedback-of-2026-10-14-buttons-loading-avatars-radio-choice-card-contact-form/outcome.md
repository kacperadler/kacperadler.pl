# KA0083 - Outcome

- Merged: 2026-10-14, `d2b3973`
- Branch: h/2026-10-14-ka0083-worker-63fce832
- Reviews: review-1.md PASS
- Cost: worker $14.35, reviews $1.83; review rounds 1

## What went in

- `src/components/mb/button.astro`: the white layer is its own still box behind every variant (Outline included, with a solid fill); the face lifts 1px on hover and sits on the layer on press, 2px gap; the loading label slides out left and the spinner in from the right, and back, at a fixed width; the arrow icon no longer moves on hover.
- `avatar-group.astro`: even overlap, ring between avatars, matching "+N" counter. `radio.astro`: round, refined choice. `card.astro`: the bar slides in left to right and out to the right, slower.
- `contact-form.astro`, `src/scripts/contact-form.ts`: focus highlights only the field; while sending, every field is disabled with a visible style.
- `src/pages/_ui/catalogue.astro`: all states, plus a demo button that loads for a few seconds and returns. `src/styles/tokens.css`, `DESIGN.md`, `AGENTS.md`: tokens and docs for the above.
- `tests/e2e/ui-catalogue.spec.ts`, `tests/e2e/contact-form.spec.ts`: hover/press layer and face, loading order, round radio, card bar direction, disabled form, no whole-form highlight; screenshots in the ticket folder.

## Checks on main

- `npm run check`: passed.
- `npm test`: passed.
- CI macOS: off (no H_GITHUB_ACTIONS_TOKEN)

## Left open

- Tickets from findings: KA0085 (F1).
