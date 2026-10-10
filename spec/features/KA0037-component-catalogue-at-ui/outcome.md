# KA0037 - Outcome

- Merged: 2026-10-10, `140ac4d`
- Branch: h/2026-10-10-ui-catalogue-47d20fec
- Reviews: review-1.md PASS, review-2.md PASS
- Cost: worker $18.87, reviews $1.97; review rounds 2

## What went in

- `src/components/ui/` (badge, tag, status-pill, radio, field, link new; button, card, input, textarea edited): one source for markup the sections repeated; `hero`, `services`, `how-i-work`, `experience`, `contact-form`, `nav`, `footer`, `mobile-sheet` use them, home page unchanged.
- `src/styles/tokens.css`: `--error: #e07a70`, the one error color (6.15:1 on the form panel, 6.7:1 on the page, WCAG AA); the axe exclude for `.field .err` is gone.
- `src/styles/prose.css` (new): @tailwindcss/typography's default values ported to plain CSS, no Tailwind dependency; it wins over the site's own `.prose` where loaded.
- `src/pages/_ui/index.astro` and `astro.config.mjs`: the component catalogue with every variant and forced states, served only by `astro dev` at `/ui`, absent from the build and the sitemap.
- `tests/e2e/ui-catalogue.spec.ts`, `tests/e2e/a11y.spec.ts`: `/ui` renders, axe passes there and on home, forced states paint like real ones, `/ui` is not in the build.
- `DESIGN.md`, `AGENTS.md`: the components, the catalogue, the error token, the prose port.

## Checks on main

- `npm run check`: passed.
- `npm test`: passed.
- CI macOS: off (no H_GITHUB_ACTIONS_TOKEN)

## Left open

- Tickets from findings: KA0052 (F2), KA0053 (F3), KA0054 (F4), KA0055 (F5).
