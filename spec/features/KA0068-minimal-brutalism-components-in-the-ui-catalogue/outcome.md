# KA0068 - Outcome

- Merged: 2026-10-10, `a271183`
- Branch: h/2026-10-10-mb-components-394266f9
- Reviews: review-1.md PASS
- Cost: worker $14.42, reviews $0.95; review rounds 1

## What went in

- `src/components/mb/`: the minimal brutalism components, one `.astro` file each with scoped CSS and `tokens.css` (`--mb-*` from the palette): button, spinner, badge, alert, avatar and group, separator, label, checkbox, radio, input, textarea, field, field set, accordion, breadcrumb, pagination, link, tag, status pill, card, cell grid, section head, prose; variants and sizes from shadcn/ui, no new dependency.
- `src/components/mb/` frame and sections: brand, header, footer, mobile sheet (focus reaches the close button under reduced motion), contact form, and hero, services, how I work, experience, contact with today's copy, data, ids and script hooks.
- `src/pages/_ui/mb/` and `astro.config.mjs`: `/ui/mb`, dev only, home sections then 20 catalogue sections with forced states; no `contact-form.ts` there; `/ui` links to it. The production build is byte-identical.
- `tests/e2e/ui-mb.spec.ts`: rendering, forced vs real states, accordion and aria-current, axe at 1440 and 360, no sideways scroll, absent from the build; `ui-proposals.spec.ts` names its link.
- `DESIGN.md`, `AGENTS.md`: tokens, the variant map and the prop renames KA0069 needs.

## Checks on main

- `npm run check`: passed.
- `npm test`: passed.
- CI macOS: off (no H_GITHUB_ACTIONS_TOKEN)

## Left open

- Tickets from findings: KA0070 (F1).
