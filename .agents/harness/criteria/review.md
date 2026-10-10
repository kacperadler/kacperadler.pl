# Review

## The question

Does the branch do what its ticket asks, with every check below green, without breaking what `spec/vision.md` says stays true?

## PASS when all hold

- These pass, the same commands `.github/workflows/ci.yml` runs (after `bun install --frozen-lockfile`):
  - `bun run lint`
  - `bun run check`
  - `bunx prettier --check "**/*.astro"`
  - `bun run build`
  - `bun run test:e2e`
- A change in behaviour has a new or updated spec in `tests/e2e/`.
- A change to tokens (`src/styles/tokens.css`), the brand mark or the palette updates `DESIGN.md`.
- When the branch touches `Dockerfile`, `nginx.conf` or `src/pages/og-default.png.ts`: `docker build -t kacperadler-pl-test .` succeeds.
- The branch stays inside its ticket's scope.

## FAIL when any one holds

- Any command above fails.
- The branch breaks a rule in `CLAUDE.md` `## Don't` (the `/v2` and v2-layout wording there is stale; the rule behind it still holds).
- The diff adds an em-dash (U+2014) anywhere: copy, docs, comments, generated text.
- The diff breaks a line of `spec/vision.md` `## What stays true`: adds cookies or a third-party tracker, English copy, a light theme, motion that ignores `prefers-reduced-motion`, or content that needs JavaScript to show.
- The diff brings in something `spec/vision.md` `## Not the goal` names: Tailwind, an SSR adapter, a CMS, React or another islands framework, always-on foreground animation.

## How code here should look

As `.agents/harness/criteria/styleguide.md` says, with `CLAUDE.md` `## Konwencje` and `DESIGN.md` behind it.

## What a worker branch usually looks like

- A few commits, Conventional Commits with a scope, as in `git log` (`feat(hero): ...`, `fix(button): ...`); copy in separate `copy(<section>): ...` commits.
- Changes in `src/components/sections/`, `src/components/ui/`, `src/content/`, `src/styles/`, `src/scripts/`, and the matching spec in `tests/e2e/`.

## Not reasons to FAIL

- Stale text in `CLAUDE.md`, `README.md` or `project-plan.md` the branch did not touch (KA0002).
- Outdated dependencies (KA0003).
- `npm test` failing because `package.json` has no `test` script (KA0001 findings, F1).
- Em-dashes already in files, on lines the branch did not add.
- The `[glob-loader] No files found` warning for the empty `src/content/blog`.
