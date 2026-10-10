# KA0003 - Findings

What was discovered while doing this ticket but is not part of it: bugs, risks, gaps, and suggested changes. Workers add entries on their branch; the coordinator adds the non-blocking notes from reviews. One entry per finding, numbered, never deleted: only its Status changes.

A finding ends in one of three statuses: `fixed` (the branch fixed it; name the commit), `ticket K0000` (a planning ticket carries it), or `dropped (reason)`. `open` lives only until the merge: `h merge` turns every `Status: open` entry into a planning ticket and rewrites its status to `ticket K0000`.

`- Budget:` is optional: set it, in USD, only when the ticket this finding becomes is expected to cost more than the autopilot default, and leave the line out otherwise. `h merge` copies it into the ticket's JSON block as `budget`, which `h ticket status --autopilot` passes to `--budget`, capped at `H_AUTOPILOT_BUDGET_MAX`.

## F1. astro-icon 1.2 warns on every build about a missing `src/icons`

- Kind: cleanup
- Found by: 2026-10-10-deps-and-astro-7-3f9b93b9 (worker), 2026-10-10
- Where: `astro.config.mjs` (`icon()`), `node_modules/astro-icon/dist/vite-plugin-astro-icon.js:30`
- What: `bun run build` prints `[WARN] [astro-icon] Failed to load icons from "src/icons": ENOENT` because the project has no local icon folder (all icons come from `@iconify-json/lucide`). The 1.2.0 plugin logs the failed `readdir` as a warning. Output is unaffected; the warning is noise in every build and CI log.
- Suggestion: find the astro-icon option that skips local icons (or point `iconDir` at an existing folder) so the build is warning-free; no icon changes.
- Status: open

## F2. `@types/node` 26 typechecks against a newer Node than CI and Docker run

- Kind: risk
- Found by: 2026-10-10-deps-and-astro-7-3f9b93b9 (worker), 2026-10-10
- Where: `package.json` (`@types/node`), `.github/workflows/ci.yml` (`node-version: "22"`)
- What: the ticket asked for every package on its latest release, so `@types/node` moved 25 → 26, while CI builds on Node 22. A Node 23-26 API used in `src/` or a config would typecheck and then fail at build time on Node 22.
- Suggestion: either pin `@types/node` to the runtime major (`^22`) and accept that `bun outdated` lists it, or move CI to the Node major the types describe once it is LTS.
- Status: open
