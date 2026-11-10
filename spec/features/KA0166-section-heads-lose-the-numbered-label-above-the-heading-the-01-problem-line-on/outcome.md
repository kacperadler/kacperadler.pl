# KA0166 - Outcome

- Merged: 2026-11-10, `d5b48c5`
- Branch: arthur/2026-11-10-worker-b3acd0e9
- Reviews: review-1.md PASS
- Cost: worker $5.70, reviews $1.41; review rounds 1

## What went in

- `AGENTS.md`: the section-head line describes no label (KA0166) and says its space above the heading stays (KA-D24).
- `DESIGN.md`: the section label is gone from the tokens, palette, type, layout, pages and drawing text; sections are named by name instead of "§ NN"; the Sections line gives the kept heading position (24px + the 18.6px line + 32/24/16px).
- `src/components/mb/page-frame.astro`: the comment says each section head counts `mb-section` up and the cards read it.
- `src/components/mb/section-head.astro`: no `label` prop, markup or styles; the top padding (`--mb-head-top` plus 32px, 24px on a poster, 16px at 880px and below) keeps the heading where it stood under the label; it still counts `mb-section` and resets `bl-cell`.
- `src/components/mb/sections/about.astro`: `<SectionHead poster>` with no label.
- `src/components/mb/sections/cases.astro`: `<SectionHead poster>` with no label.
- `src/components/mb/sections/contact.astro`: `<SectionHead poster>` with no label.
- `src/components/mb/sections/faq.astro`: `<SectionHead poster>` with no label.
- `src/components/mb/sections/how-i-work.astro`: `<SectionHead poster>` with no label.
- `src/components/mb/sections/problems.astro`: `<SectionHead poster>` with no label.
- `src/components/mb/sections/services.astro`: `<SectionHead poster>` with no label.
- `src/layouts/legal-layout.astro`: the h1 section head has no label.
- `src/pages/404.astro`: the h1 section head has no label.
- `src/pages/_ui/catalogue.astro`: the section-head description has no label; the `.mb-ui-counter` wrappers and their rule are removed.
- `src/pages/realizacje/[...index].astro`: the h1 section head has no label.
- `src/pages/realizacje/[slug].astro`: the h1 section head has no label.
- `src/styles/global.css`: the blueprint comment no longer lists the § label.
- `tests/e2e/blueprint.spec.ts`: the head-drawing check no longer reads a label; the 404 test checks the head starts with its h1.
- `tests/e2e/design.spec.ts`: the `.mb-section-label` rows are gone from the notes and drawing-mark lists.
- `tests/e2e/home.spec.ts`: checks that each of the 7 home section heads holds only its h2 and lede, and pins the gap from the dimension line to each heading (home page 59.6px at 390px, 67.6px at 1440px; legal page 59.6px and 75.6px).
- `tests/e2e/nav-active.spec.ts`: the comment says the headline, not the label, shows under the header.

## Checks on main

- `bun install --frozen-lockfile`: passed.
- `npm run check`: passed.
- `npm test`: passed.

## Left open

- Findings: none; no findings.md on this ticket.
