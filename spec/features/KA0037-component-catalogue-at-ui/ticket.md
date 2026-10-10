# KA0037 - Component catalogue at /ui

```json
{
  "id": "KA0037",
  "title": "Component catalogue at /ui",
  "date": "2026-10-10"
}
```

## Description

The site's components live in `src/components/ui/` (button, card, input, textarea) and as one-off markup inside sections (links, badges, status pill, tags, radios, nav links, the experience entry). Nothing shows them side by side.

## Goal

One page shows every component with each variant and state, so a redesign can be judged on all of them at once, and a proposal (KA0038) can restyle the same page.

- Kind: improvement

## Done means

- `/ui` lists, each under a heading: button (every variant, sizes, hover, focus-visible, active, disabled, loading), link (inline, nav, footer, with icon), badge and tag (every variant used on the site), card (plain, with hover), input, textarea and radio (empty, filled, focus, error, disabled), the status pill, the section heading pattern (eyebrow + h2 with `<em>`), and a typography block (h1-h4, paragraph, lists, blockquote, code, table) styled by a `.prose` port of @tailwindcss/typography's default values in plain CSS.
- Recurring one-off markup (badge, tag, link styles) becomes a component in `src/components/ui/` only where the catalogue needs one source; sections use it and the home page looks the same (screenshots before and after, pixel-identical or explained).
- States are forced by classes or attributes on the catalogue page (`data-state="hover"` etc.), not only real interaction, so they can be compared at a glance.
- `/ui` exists in `astro dev` and is absent from the production build: `bun run build` produces no `dist/ui/`, nothing links to it, not in the sitemap; e2e (on the dev server or a build flag) checks the page renders and axe finds no violations.
- `bun run lint`, `bun run check`, `bun run build` and `bun run test:e2e` pass.

## Scope

In:
- `src/pages/ui/index.astro`, `src/components/ui/`, a `.prose` stylesheet, the sections that adopt a new ui component, tests, `astro.config.mjs` only for keeping `/ui` out of production.

Out:
- Any visual change to the live site; proposals (KA0038).

## Decisions

- 2026-10-10: The human: redesign before KA0029-KA0035: browse the site on agent:<port>; a /ui page listing our components with variants and states; /ui/proposal/<id> pages to try several directions (minimal, brutalism, modernist, computer, professional, ...); colors stay, the font may change; components card, button, link, badge etc.; typography from Tailwind prose or our own override. He likes Sentry's style and https://www.aibizneslab.pl/, minimalism and brutalism, and wants to find his own unique style.
- 2026-10-10: The coordinator: Tailwind stays out (vision, Not the goal); the prose typography is ported as plain CSS from @tailwindcss/typography's default values, no Tailwind dependency. /ui pages are a dev tool: not in the production build.
- 2026-10-10: Budget raised to 14 USD by the coordinator: the job ran out at 8 USD with a large uncommitted change (six new ui components, 16 files edited, /ui page in progress).
