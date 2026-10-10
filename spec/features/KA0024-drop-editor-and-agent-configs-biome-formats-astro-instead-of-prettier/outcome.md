# KA0024 - Outcome

- Merged: 2026-10-10, `478c000`
- Branch: h/2026-10-10-one-formatter-no-editor-89d9af4a
- Reviews: review-1.md PASS, review-2.md PASS
- Cost: worker $3.32, reviews $1.09; review rounds 2

## What went in

- `.claude/`, `.vscode/`, `.zed/`, `.editorconfig`: removed from git; the editor folders are ignored.
- `biome.jsonc`, `package.json`, `bun.lock`, `.husky/pre-commit`, `.github/workflows/ci.yml`: Biome formats and lints `.astro` too; Prettier, its Astro plugin and their configs are gone; `bun run lint` is the format check.
- `src/**/*.astro`: reformatted by Biome once; the built HTML differs only in whitespace that does not render.
- `.dockerignore`: matches the tree (no editor, `spec/` or `.agents/` in the image); `docker build` passes.
- `AGENTS.md`, `README.md`, `astro.config.mjs`, `.agents/harness/criteria/review.md`: no Prettier left.

## Checks on main

- `npm run check`: passed.
- `npm test`: passed.
- CI macOS: off (no H_GITHUB_ACTIONS_TOKEN)

## Left open

- Findings F1-F4 fixed on the branch; F5 dropped (one transient e2e failure under load).
