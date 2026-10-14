# KA0085 - Outcome

- Merged: 2026-10-14, `66b0825`
- Branch: h/2026-10-14-ka0085-360px-scroll-ada4546a
- Reviews: review-1.md PASS
- Cost: worker $1.63, reviews $0.57; review rounds 1

## What went in

- `src/pages/_ui/catalogue.astro`: the `/ui` title (`.mb-ui-title`) may break a long word, so in the one frame after a resize to 360px, when reduced motion still shows the wide size, "komponentów" no longer pushes the page to 368px. The settled page looks the same.
- `tests/e2e/ui-catalogue.spec.ts`: "does not scroll sideways at 360px" pauses animations before the resize, so that first frame is measured every run, then checks the settled page.
- `findings.md`: F1, reduced motion makes every restyle lag one frame on every page (ticket KA0086).

## Checks on main

- `npm run check`: passed.
- `npm test`: passed.
- CI macOS: off (no H_GITHUB_ACTIONS_TOKEN)

## Left open

- Tickets from findings: KA0086 (F1).
