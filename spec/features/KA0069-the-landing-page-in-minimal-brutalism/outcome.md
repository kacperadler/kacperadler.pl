# KA0069 - Outcome

- Merged: 2026-10-10, `1928b85`
- Branch: h/2026-10-10-landing-in-mb-d0b2016c
- Reviews: review-1.md FAIL, review-2.md PASS
- Cost: worker $16.59, reviews $1.99; review rounds 2

## What went in

- `src/layouts/base-layout.astro` and every page (home, 404, legal, `/realizacje/`, case study): built on the `src/components/mb/` frame and sections; content, Umami events, form states, SEO tags, sitemap and `llms*.txt` unchanged.
- Deleted: `src/components/ui/`, `sections/`, `contact/`, the old header, footer, nav and sheet, `spotlight.ts`, `nav-scroll.ts`, `prose.css`, the old catalogue, `/ui/mb`, the `minimal-brutalism` proposal; old rules in `global.css`.
- `src/styles/tokens.css`: unused tokens removed, the `--mb-*` tokens moved in.
- `/ui` shows the new components; `/ui/proposal` stays dev only with `baseline` as the new design; dev pages load no `contact-form.ts`.
- `src/components/mb/header.astro`, `mobile-sheet.astro`: the header fits 360px, the sheet focuses its close button under reduced motion.
- `tests/e2e/`: mb pages, no old style, narrow header, proposals, and dev pages that send no lead (`send-a-lead.ts`).
- `DESIGN.md`, `AGENTS.md`: minimal brutalism is the site's design.

## Checks on main

- `npm run check`: passed.
- `npm test`: passed.
- CI macOS: off (no H_GITHUB_ACTIONS_TOKEN)

## Left open

- F3 joins KA0066 (flaky 360px test). KA0070 dropped: fixed here.

- Tickets from findings: KA0073 (F1), KA0074 (F2).
