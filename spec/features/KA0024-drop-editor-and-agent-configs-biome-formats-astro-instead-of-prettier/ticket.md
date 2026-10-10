# KA0024 - Drop editor and agent configs, Biome formats .astro instead of Prettier

```json
{
  "id": "KA0024",
  "title": "Drop editor and agent configs, Biome formats .astro instead of Prettier",
  "date": "2026-10-10"
}
```

## Description

`.claude/settings.json`, `.vscode/{extensions,launch,settings}.json` and `.zed/settings.json` are tracked. `.astro` files are formatted by Prettier with `prettier-plugin-astro` (`.prettierrc`, `.prettierignore`, `lint-staged`, CI `bunx prettier --check`) only because Biome did not format Astro templates; Biome 2.5 has `html.experimentalFullSupportEnabled`, which formats `.astro`.

## Goal

One formatter and no per-editor or per-agent config in the repository: fewer tools to keep in step, and the repo says only what the site needs.

- Kind: cleanup

## Done means

- `.claude/`, `.vscode/`, `.zed/` are removed from git and ignored in `.gitignore`.
- Biome formats and lints `.astro` (full HTML support on in `biome.jsonc`); `prettier`, `prettier-plugin-astro`, `.prettierrc`, `.prettierignore` are gone; `lint-staged` and `.github/workflows/ci.yml` call Biome only; the `astroCompressHTML` rule in `AGENTS.md` goes with Prettier. If Biome's `.astro` formatting breaks markup (the build output differs beyond whitespace in `dist/` HTML, or e2e fails), stop and report instead of keeping Prettier silently.
- Running the formatter once over all `.astro` files is its own commit; `dist/` HTML before and after compared and only whitespace differs.
- Look over the rest of the repository for leftovers (tracked files nothing uses, stale config, scripts, placeholders) and record each as a finding with a proposed action; delete nothing beyond this ticket's list.
- `bun run lint`, `bun run check`, `bun run build` and `bun run test:e2e` pass (and the Biome format check that replaces `prettier --check`, once KA0024 is in).

## Scope

In:
- `.claude/`, `.vscode/`, `.zed/`, `.gitignore`, `.prettierrc`, `.prettierignore`, `package.json`, `bun.lock`, `biome.jsonc`, `.husky/pre-commit`, `.github/workflows/ci.yml`, `src/**/*.astro` (formatting only), the Prettier and editor lines in `AGENTS.md` and `README.md`.

Out:
- `project-plan.md` and the README rewrite (KA0025).

## Decisions

- 2026-10-10: The human: focus on developing KA first; remove `.claude`, `.vscode`, `.zed`; with Biome, Prettier is not needed; look over the repo for what to clean and what to keep; drop `project-plan.md`, turn what is left into tickets, and improve `README.md`.
- 2026-10-10: The human: delete .editorconfig (F3); the coordinator folds F1, F2, F4 into this branch too.
- 2026-10-10: The human: merge after PASS.
