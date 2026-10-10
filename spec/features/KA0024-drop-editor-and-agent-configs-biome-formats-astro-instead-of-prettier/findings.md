# KA0024 - Findings

What was discovered while doing this ticket but is not part of it: bugs, risks, gaps, and suggested changes. Workers add entries on their branch; the coordinator adds the non-blocking notes from reviews. One entry per finding, numbered, never deleted: only its Status changes.

A finding ends in one of three statuses: `fixed` (the branch fixed it; name the commit), `ticket K0000` (a planning ticket carries it), or `dropped (reason)`. `open` lives only until the merge: `h merge` turns every `Status: open` entry into a planning ticket and rewrites its status to `ticket K0000`.

`- Budget:` is optional: set it, in USD, only when the ticket this finding becomes is expected to cost more than the autopilot default, and leave the line out otherwise. `h merge` copies it into the ticket's JSON block as `budget`, which `h ticket status --autopilot` passes to `--budget`, capped at `H_AUTOPILOT_BUDGET_MAX`.

## F1. Biome needs two passes on the Umami block in `base-head.astro`

- Kind: risk
- Found by: 2026-10-10-one-formatter-no-editor-89d9af4a (worker), 2026-10-10
- Where: `src/components/layout/base-head.astro:100-148`
- What: The Umami script is one Astro expression that opens with a block comment: `{/* Umami analytics ... */ import.meta.env.PROD && (<script ... />)}`. On the Prettier-formatted file, `bunx biome format --write src` (Biome 2.5.15) dedented it by two spaces, and the next `bunx biome format src` still reported a format error for the same lines; a second `--write` dedented it once more and from then on reported no fixes. The first pass is not a fixed point, so a file that `lint-staged` formatted once can still fail `bun run lint` in CI when this pattern comes back. The committed file is at the fixed point (`bun run lint`: 63 files, no errors).
- Suggestion: move the comment out of the expression (into the frontmatter, or its own `{/* */}` before the `{import.meta.env.PROD && ...}` expression) so Biome formats it in one pass; check with one `--write` then `bun run lint`. Nothing else in the file changes.
- Status: fixed in 9459048

## F2. `biome.jsonc` ignores an `example.html` that does not exist

- Kind: cleanup
- Found by: 2026-10-10-one-formatter-no-editor-89d9af4a (worker), 2026-10-10
- Where: `biome.jsonc:10`
- What: `"!**/example.html"` has been in the Biome ignore list since `1eb8b24` (Faza 0). `git ls-files` lists no `example.html` and none is on disk; the line excludes nothing.
- Suggestion: delete the line. The other ignores stay.
- Status: fixed in 3f383f8

## F3. `.editorconfig` duplicates what Biome already decides

- Kind: cleanup
- Found by: 2026-10-10-one-formatter-no-editor-89d9af4a (worker), 2026-10-10
- Where: `.editorconfig`
- What: `.editorconfig` (2-space indent, LF, UTF-8, final newline) is read only by editors: Biome's `formatter.useEditorconfig` defaults to `false` (its schema in `node_modules/@biomejs/biome/configuration_schema.json`) and neither `biome.jsonc` nor `ultracite/biome/core` turns it on. The same settings live in `ultracite/biome/core` (`indentStyle: space`, `indentWidth: 2`, `lineEnding: lf`), and `lint-staged` plus `bun run lint` enforce them. KA0024 removed the per-editor configs; this one is editor-neutral, so it was left for the human.
- Suggestion: the human decides whether to delete `.editorconfig` (Biome is the one source of formatting) or keep it as a fallback for editors without the Biome extension. If deleted, `trim_trailing_whitespace = false` for `*.md` goes with it (Biome does not format Markdown).
- Status: fixed in bbb6431 (the human: delete `.editorconfig`)

## F4. `.dockerignore` does not match the current tree

- Kind: cleanup
- Found by: 2026-10-10-one-formatter-no-editor-89d9af4a (worker), 2026-10-10
- Where: `.dockerignore`
- What: The Dockerfile does `COPY . .` (line 22) in the build stage. `.dockerignore` lists `.vscode/` and `.claude/` but not `.zed/`, and does not exclude `spec/` or `.agents/`; its `*.md` matches root files only, so `spec/**/*.md` and `.agents/**/*.md` go into the build context. Only `dist/` reaches the nginx image (line 36), so the result is a larger build context and a cache bust on every ticket edit, not a different image [INFERENCE: not measured with `docker build`].
- Suggestion: list `.zed/`, `spec/` and `.agents/` in `.dockerignore` and check with `docker build -t kacperadler-pl-test .`, as `AGENTS.md` asks for Docker changes.
- Status: fixed in c8d227d
