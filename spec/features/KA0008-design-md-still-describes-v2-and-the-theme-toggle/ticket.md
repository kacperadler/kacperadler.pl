# KA0008 - `DESIGN.md` still describes `/v2` and the theme toggle

```json
{
  "id": "KA0008",
  "title": "`DESIGN.md` still describes `/v2` and the theme toggle",
  "date": "2026-10-10"
}
```

## Description

`DESIGN.md` says v1 is in production at `/` and v2 is built on `/v2`; that forced themes work through `[data-theme]` set by a theme toggle (`localStorage` key `ka:theme`); that the dot grid sits on `body.v2-body`; that the spotlight selector group lives in `src/pages/v2.astro`; and asks for both light and dark values on every new token. Since `6e1b55e` v2 is at `/`, the site is dark-only (`color-scheme: dark` in `src/styles/tokens.css`), the dot grid is on `.bg-stage` in `src/layouts/base-layout.astro`, and the spotlight selectors are in `src/styles/global.css`. KA0002's scope named only `CLAUDE.md`/`AGENTS.md`, `README.md`, `project-plan.md` and `wrangler.toml`, so `DESIGN.md` was left as it is.

## Goal

`DESIGN.md`, the design source agents read before touching the look, describes the dark-only site at `/` as it is, with no `/v2`, theme toggle or light theme.

- Kind: cleanup

Evidence:
- `DESIGN.md:3-4`, `DESIGN.md:100`, `DESIGN.md:102-116` (`## Themes`), `DESIGN.md:138`, `DESIGN.md:163`, `DESIGN.md:222`, `DESIGN.md:231`
- Found by: 2026-10-10-docs-and-agents-md-508a76bc (worker), 2026-10-10

## Done means

- `DESIGN.md` describes one dark site at `/`: no `/v2`, `v1`, theme toggle, `data-theme`, `ka:theme` or light values; the dot grid points at `.bg-stage` in `base-layout.astro`, the spotlight selectors at `global.css`; new tokens need a dark value only. `grep -n 'v2\|data-theme\|ka:theme\|light' DESIGN.md` finds no theming or v2 text.
- The `DESIGN.md` staleness exceptions in `.agents/harness/criteria/styleguide.md`, `review.md` and `retro.md` are removed.
- No em-dash added.
- `bun run lint`, `bun run check`, `bunx prettier --check "**/*.astro"`, `bun run build` and `bun run test:e2e` pass.

## Scope

In:
- `DESIGN.md`, `.agents/harness/criteria/styleguide.md`, `review.md`, `retro.md`.

Out:
- `src/styles/tokens.css` and any CSS.

## Decisions

- 2026-10-10: Source: F1 of KA0002
- 2026-10-10: The human: no light theme and no v2 in the app; this ticket removes their remaining mentions, approved on that reading.
