# KA0043 - Design proposal: professional

```json
{
  "id": "KA0043",
  "title": "Design proposal: professional",
  "date": "2026-10-10",
  "after": [
    "KA0038"
  ]
}
```

## Description

KA0038 builds `/ui/proposal/<id>`. This ticket adds the `professional` proposal: calm and corporate: refined sans, quiet cards with soft depth, clear hierarchy, conservative motion, trust over flair.

## Goal

The human sees how the site looks in a professional direction (a direction the human named) on every component and the home page, and can pick it, drop it or take parts of it.

- Kind: improvement

## Done means

- `src/styles/proposals/professional/` with its CSS and `meta.json` (name "Professional", a two-sentence description, references); `/ui/proposal/professional` renders the catalogue and the home copy in it; colors only from the site's palette; any new font self-hosted with its license.
- Every component and state of the catalogue is styled deliberately in this direction, not left at the default; text contrast meets WCAG AA (axe zero on the proposal page).
- Screenshots of `/ui/proposal/professional` (catalogue and home, desktop and mobile, viewport-high slices) and a short note on the choices made, in the final message.
- `bun run lint`, `bun run check`, `bun run build` and `bun run test:e2e` pass.

## Scope

In:
- `src/styles/proposals/professional/`, fonts under `public/fonts/` if the proposal needs one.

Out:
- Other proposals, the frame (KA0038), the live site.

## Decisions

- 2026-10-10: The human: redesign before KA0029-KA0035: browse the site on agent:<port>; a /ui page listing our components with variants and states; /ui/proposal/<id> pages to try several directions (minimal, brutalism, modernist, computer, professional, ...); colors stay, the font may change; components card, button, link, badge etc.; typography from Tailwind prose or our own override. He likes Sentry's style and https://www.aibizneslab.pl/, minimalism and brutalism, and wants to find his own unique style.
- 2026-10-10: The coordinator: Tailwind stays out (vision, Not the goal); the prose typography is ported as plain CSS from @tailwindcss/typography's default values, no Tailwind dependency. /ui pages are a dev tool: not in the production build.
- 2026-10-10: After KA0038.
