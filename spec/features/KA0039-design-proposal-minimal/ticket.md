# KA0039 - Design proposal: minimal

```json
{
  "id": "KA0039",
  "title": "Design proposal: minimal",
  "date": "2026-10-10",
  "after": [
    "KA0038"
  ]
}
```

## Description

KA0038 builds `/ui/proposal/<id>`. This ticket adds the `minimal` proposal: as little as carries the content: a lot of whitespace, one type family, hairline or no borders, no shadows, restrained motion.

## Goal

The human sees how the site looks in a minimal direction (Minimalism the human likes) on every component and the home page, and can pick it, drop it or take parts of it.

- Kind: improvement
- Model: anthropic/claude-opus-5-5

## Done means

- `src/styles/proposals/minimal/` with its CSS and `meta.json` (name "Minimal", a two-sentence description, references); `/ui/proposal/minimal` renders the catalogue and the home copy in it; colors only from the site's palette; any new font self-hosted with its license.
- Every component and state of the catalogue is styled deliberately in this direction, not left at the default; text contrast meets WCAG AA (axe zero on the proposal page).
- The proposal is reachable at `/ui/proposal/minimal` on the dev server, and the final message gives a short note on the choices made; no screenshots are sent to the human.
- `bun run lint`, `bun run check`, `bun run build` and `bun run test:e2e` pass.

## Scope

In:
- `src/styles/proposals/minimal/`, fonts under `public/fonts/` if the proposal needs one.

Out:
- Other proposals, the frame (KA0038), the live site.

## Decisions

- 2026-10-10: The human: redesign before KA0029-KA0035: browse the site on agent:<port>; a /ui page listing our components with variants and states; /ui/proposal/<id> pages to try several directions (minimal, brutalism, modernist, computer, professional, ...); colors stay, the font may change; components card, button, link, badge etc.; typography from Tailwind prose or our own override. He likes Sentry's style and https://www.aibizneslab.pl/, minimalism and brutalism, and wants to find his own unique style.
- 2026-10-10: The coordinator: Tailwind stays out (vision, Not the goal); the prose typography is ported as plain CSS from @tailwindcss/typography's default values, no Tailwind dependency. /ui pages are a dev tool: not in the production build.
- 2026-10-10: After KA0038.
- 2026-10-10: The human: proposals are made with Opus (h spawn --model anthropic/claude-opus-5-5).
- 2026-10-10: The human: merge what passes review and run on autopilot; he only sees the design proposals to confirm or reject the direction (merge after PASS).
- 2026-10-10: The human: no screenshots; he clicks through all proposals at once on the dev server (agent:4321) from links.
