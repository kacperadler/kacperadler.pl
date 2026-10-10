# KA0038 - Design proposals at /ui/proposal/<id>

```json
{
  "id": "KA0038",
  "title": "Design proposals at /ui/proposal/<id>",
  "date": "2026-10-10",
  "after": [
    "KA0037"
  ]
}
```

## Description

KA0037 builds `/ui`, the component catalogue. The human wants to try several design directions on the same components before choosing one.

## Goal

Each direction can be seen on the real components and a real page, side by side, without touching the live site; the human picks one, or a mix.

- Kind: improvement

## Done means

- `/ui/proposal/<id>` renders the full `/ui` catalogue plus a copy of the home page (all sections, real content) with one proposal applied; `/ui/proposal` lists the proposals with a one-line description and a link each; a switcher on every proposal page moves between them and back to the current design.
- A proposal is one folder `src/styles/proposals/<id>/` with a CSS file (and its fonts, if any, self-hosted woff2 with their license) that overrides tokens and component styles under a scope (`[data-proposal="<id>"]`) and a `meta.json` (name, description, references). Colors stay the site's palette (`src/styles/tokens.css`); a proposal changes font, type scale, radius, borders, shadows, spacing, layout rhythm and component shapes.
- Adding a proposal needs only its folder; one sample proposal `baseline` (the current design) ships so the frame is tested; dev-only like `/ui` (no `dist/ui/`), axe zero on the sample, e2e covers the list, the switcher and one proposal page.
- `bun run lint`, `bun run check`, `bun run build` and `bun run test:e2e` pass.

## Scope

In:
- `src/pages/ui/proposal/`, `src/styles/proposals/`, the proposal loader, the home sections only to accept a proposal scope, tests.

Out:
- The directions themselves (KA0039-KA0044); the live site.

## Decisions

- 2026-10-10: The human: redesign before KA0029-KA0035: browse the site on agent:<port>; a /ui page listing our components with variants and states; /ui/proposal/<id> pages to try several directions (minimal, brutalism, modernist, computer, professional, ...); colors stay, the font may change; components card, button, link, badge etc.; typography from Tailwind prose or our own override. He likes Sentry's style and https://www.aibizneslab.pl/, minimalism and brutalism, and wants to find his own unique style.
- 2026-10-10: The coordinator: Tailwind stays out (vision, Not the goal); the prose typography is ported as plain CSS from @tailwindcss/typography's default values, no Tailwind dependency. /ui pages are a dev tool: not in the production build.
- 2026-10-10: After KA0037.
