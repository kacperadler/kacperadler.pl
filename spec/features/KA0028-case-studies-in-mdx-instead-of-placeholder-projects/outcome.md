# KA0028 - Outcome

- Merged: 2026-10-10, `6feb382`
- Branch: h/2026-10-10-case-studies-frame-57492fb9
- Reviews: review-1.md PASS, review-2.md PASS, review-3.md PASS
- Cost: worker $11.71, reviews $2.83; review rounds 3

## What went in

- `astro.config.mjs`, `src/content.config.ts`: `@astrojs/mdx`; a `caseStudies` collection of `.mdx` files with an optional link to an entry in "Z kim pracowałem"; the `projects` placeholders are gone.
- `src/pages/realizacje/`: a static page per case study and a `/realizacje/` list; `src/data/navigation.ts`, `nav.astro`, `mobile-sheet.astro`: a "Realizacje" menu entry. List and entry exist only once a case study does (none today).
- `src/components/sections/experience.astro`: an entry with a case study links to it; menu links point at `/#section` so they work from any page.
- `src/lib/case-studies.ts`: the build fails on an unknown or duplicated `experience` link.
- `src/styles/global.css`: `.prose` shared by legal pages and case studies.
- `playwright.config.ts`, `tests/`: e2e builds without and with a sample case study and checks both.

## Checks on main

- `npm run check`: passed.
- `npm test`: passed.
- CI macOS: off (no H_GITHUB_ACTIONS_TOKEN)

## Left open

- Findings: none open; no ticket made.
