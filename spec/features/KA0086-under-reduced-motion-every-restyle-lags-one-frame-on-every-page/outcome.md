# KA0086 - Outcome

- Merged: 2026-10-14, `128929f`
- Branch: h/2026-10-14-ka0086-reduced-motion-la-639ffec2
- Reviews: review-1.md PASS
- Cost: worker $1.61, reviews $0.54; review rounds 1

## What went in

- `src/styles/global.css`: under reduced motion transitions are turned off (`transition-property: none`), not shortened, so a resize or state change shows its final style in the same frame on every page; animations still collapse to 0.01ms.
- `src/components/mb/mobile-sheet.astro`, `src/pages/_ui/catalogue.astro`: the workarounds for the one-frame lag (the sheet's per-child override, KA0085's `overflow-wrap` on the `/ui` title) removed.
- `tests/e2e/design.spec.ts`: on every page, under reduced motion, a 1440 to 360px resize leaves no running transition and no sideways scroll. `ui-catalogue.spec.ts`: the 360px test expects no transitions in the first frame.
- `DESIGN.md` (Motion): reduced motion turns transitions off, and why.

## Checks on main

- `npm run check`: passed.
- `npm test`: passed.
- CI macOS: off (no H_GITHUB_ACTIONS_TOKEN)

## Left open

- Findings: none; no findings.md on this ticket.
