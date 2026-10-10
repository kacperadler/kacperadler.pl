# KA0002 - Findings

What was discovered while doing this ticket but is not part of it: bugs, risks, gaps, and suggested changes. Workers add entries on their branch; the coordinator adds the non-blocking notes from reviews. One entry per finding, numbered, never deleted: only its Status changes.

A finding ends in one of three statuses: `fixed` (the branch fixed it; name the commit), `ticket K0000` (a planning ticket carries it), or `dropped (reason)`. `open` lives only until the merge: `h merge` turns every `Status: open` entry into a planning ticket and rewrites its status to `ticket K0000`.

`- Budget:` is optional: set it, in USD, only when the ticket this finding becomes is expected to cost more than the autopilot default, and leave the line out otherwise. `h merge` copies it into the ticket's JSON block as `budget`, which `h ticket status --autopilot` passes to `--budget`, capped at `H_AUTOPILOT_BUDGET_MAX`.

## F1. `DESIGN.md` still describes `/v2` and the theme toggle

- Kind: cleanup
- Found by: 2026-10-10-docs-and-agents-md-508a76bc (worker), 2026-10-10
- Where: `DESIGN.md:3-4`, `DESIGN.md:100`, `DESIGN.md:102-116` (`## Themes`), `DESIGN.md:138`, `DESIGN.md:163`, `DESIGN.md:222`, `DESIGN.md:231`
- What: `DESIGN.md` says v1 is in production at `/` and v2 is built on `/v2`; that forced themes work through `[data-theme]` set by a theme toggle (`localStorage` key `ka:theme`); that the dot grid sits on `body.v2-body`; that the spotlight selector group lives in `src/pages/v2.astro`; and asks for both light and dark values on every new token. Since `6e1b55e` v2 is at `/`, the site is dark-only (`color-scheme: dark` in `src/styles/tokens.css`), the dot grid is on `.bg-stage` in `src/layouts/base-layout.astro`, and the spotlight selectors are in `src/styles/global.css`. KA0002's scope named only `CLAUDE.md`/`AGENTS.md`, `README.md`, `project-plan.md` and `wrangler.toml`, so `DESIGN.md` was left as it is.
- Suggestion: bring `DESIGN.md` to the code (drop the `/v2` and theming text, point at `base-layout.astro` and `global.css`, decide whether the light values in tokens stay documented); then drop the `DESIGN.md` exceptions added to `.agents/harness/criteria/styleguide.md`, `review.md` and `retro.md`. Its em-dashes are KA0001 F3.
- Status: ticket KA0008

## F2. The privacy policy says the site stores a theme preference in `localStorage`

- Kind: bug
- Found by: 2026-10-10-docs-and-agents-md-508a76bc (worker), 2026-10-10
- Where: `src/pages/polityka-prywatnosci.md:45`, `src/pages/polityka-prywatnosci.md:91`, `src/pages/regulamin.md:30`
- What: The privacy policy tells visitors the site saves `ka:theme` (`light` / `dark`) in `localStorage`, and the terms require a browser with `localStorage`. The theme toggle was removed in `6e1b55e`; `grep localStorage|ka:theme` over `src/` finds no code that reads or writes it, only these legal pages. Legal copy that describes processing which does not happen is a compliance risk.
- Suggestion: remove the `localStorage` paragraphs from the privacy policy (the site stores nothing in the browser), drop `localStorage` from the terms' technical requirements, and bump `lastUpdated` on both; copy commits per page.
- Status: ticket KA0009

## F3. Code comments still point at `v2-layout` and `body.v2-body`

- Kind: cleanup
- Found by: 2026-10-10-docs-and-agents-md-508a76bc (worker), 2026-10-10
- Where: `src/components/layout/footer.astro:69-70`, `src/components/layout/mobile-sheet.astro:50-51`
- What: The comments say the glass treatment "lives in v2-layout via body.v2-body ... override" and that "v1 stays solid". Both files are gone: the overrides are at the bottom of `src/layouts/base-layout.astro` as plain `.site-footer` / `.sheet` rules.
- Suggestion: reword both comments to point at `base-layout.astro`; no CSS change.
- Status: ticket KA0010

## F4. Claude Code may no longer load the agent conventions

- Kind: risk
- Found by: 2026-10-10-docs-and-agents-md-508a76bc (worker), 2026-10-10
- Where: `AGENTS.md` (was `CLAUDE.md`), `.claude/settings.json`
- What: [INFERENCE] The repository keeps a `.claude/` config, so Kacper may run Claude Code here directly. Claude Code loads `CLAUDE.md` into context; whether it also loads `AGENTS.md` was not checked. If it does not, a session started outside the harness works without the conventions.
- Suggestion: Kacper decides whether a one-line `CLAUDE.md` containing `@AGENTS.md` (an import, not a second copy) is wanted; KA0002 removed `CLAUDE.md` as the ticket asks.
- Status: dropped (the human: AGENTS.md only, no CLAUDE.md; ticket KA0011 dropped)

## F5. `@/stores` path alias with no `src/stores`

- Kind: cleanup
- Found by: 2026-10-10-docs-and-agents-md-508a76bc (worker), 2026-10-10
- Where: `tsconfig.json:13`, `astro.config.mjs:24`
- What: Both configs map `@/stores` to `src/stores`, which does not exist (nanostores was planned in `project-plan.md` but never added). The alias is dead config; `AGENTS.md` and `README.md` no longer list it.
- Suggestion: remove the alias from both files; `project-plan.md` Faza 0 lists it as history and stays as it is.
- Status: ticket KA0012

## F6. Biome ignores spec/build.json, outside the ticket's scope

- Kind: cleanup
- Found by: 2026-10-10-review-docs-and-agents-m-467f5a1a (review), 2026-10-10
- Where: `biome.jsonc`
- What: the branch added `!spec/build.json`; lint passes without it on today's tree.
- Suggestion: none.
- Status: dropped (harmless: the board is harness-written, and `h ticket` rewrites it in its own format)
