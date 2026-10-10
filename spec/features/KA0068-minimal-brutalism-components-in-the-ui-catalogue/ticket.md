# KA0068 - Minimal brutalism components in the /ui catalogue

```json
{
  "id": "KA0068",
  "title": "Minimal brutalism components in the /ui catalogue",
  "date": "2026-10-10",
  "after": [
    "KA0067"
  ]
}
```

## Description

`src/styles/proposals/minimal-brutalism/proposal.css` restyles the current components from outside, as an override. The human wants the real components built for this direction in the /ui catalogue first, and the landing reworked from them at the end (KA0069).

## Goal

Every component the landing needs exists in minimal brutalism as a component of its own, with its states, in the /ui catalogue, ready for KA0069 to use.

- Kind: improvement
- Plan: tak

## Done means

- A dev-only catalogue page `/ui/mb` renders each minimal brutalism component with every variant and state forced (as `/ui` does): button, link, badge, tag, card/cell grid, input, textarea, radio, field with error, status pill, section head (numbered label, headline left, lede right), page frame, and the typography block; plus the home sections composed from them.
- The components live in `src/components/mb/` with their own styles and tokens taken from `proposal.css` (palette only, Geist and Geist Mono); no production page imports them yet, the production build is unchanged (no `dist/ui`, home HTML identical).
- Text contrast meets WCAG AA: axe zero on `/ui/mb` at 1440px and 360px, no sideways scroll at 360px; motion respects `prefers-reduced-motion`.
- e2e covers `/ui/mb` rendering, axe, and that it is absent from the build.
- `bun run lint`, `bun run check`, `bun run build` and `bun run test:e2e` pass.

## Scope

In:
- `src/components/mb/`, `src/pages/_ui/mb/`, `astro.config.mjs` only for the dev route, tests, `DESIGN.md` and `AGENTS.md` lines.

Out:
- Changing any production page or `src/components/ui/` (KA0069 does that).

## Decisions

- 2026-10-10: The human: "minimal-brutalism I like a lot; delete the rest and make a branch where we build its components in the UI tab, to rework our landing at the end". The coordinator: the work goes in steps KA0067, KA0068, KA0069 on main; until KA0069 everything new is dev-only (/ui), so production does not change before the landing switch, which is what a separate branch would give; merge after PASS.
