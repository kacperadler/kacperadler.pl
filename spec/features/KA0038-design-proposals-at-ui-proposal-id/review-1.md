# KA0038 - Review 1

- Job: 2026-10-10-review-proposal-frame-68ecabef
- Branch: h/2026-10-10-proposal-frame-bfdbe7b6
- Commit reviewed: cd92c52706bb5ba743bd6f2651f4ae060aa9b3ab
- Verdict: PASS

## Final message

## Findings

None. Implementation matches ticket and focus area.

## Verification detail (focus: base-layout proposal prop + /ui, /ui/proposal staying out of build)

- `src/layouts/base-layout.astro:59` sets `data-proposal={proposal}`; `proposal` is `undefined` on every production page (`index.astro`, `404.astro`, legal pages never pass it). Astro omits attributes whose value is `undefined`. Confirmed directly: built `dist/index.html` has `<html lang="pl">`, no `data-proposal` anywhere.
- `astro.config.mjs`'s `uiCatalogue` integration only calls `injectRoute` when `command === "dev"` (now for `/ui`, `/ui/proposal`, `/ui/proposal/[id]`). Confirmed: `bun run build` produced exactly 4 pages, no `dist/ui/` directory, and `tests/e2e/ui-proposals.spec.ts`'s "production build has no proposal pages" test gets 404/404/404 against the preview server.
- Mutation check: stripped `data-proposal={proposal}` down to a bare `<html lang=...>` and reran the proposal spec. 3 of 10 tests failed exactly as expected (scope assertion, CSS-precedence assertion, switcher assertion), 7 passed — the suite does catch removal of this behavior. Restored the file with `git checkout --`.

## Notes (non-blocking)

- `catalogue.astro` extraction from the old `index.astro` is a faithful content move (unwrap `<BaseLayout><main>` → bare `<div class="ui-page">`) with no markup/logic drift; diffed byte-for-byte against the pre-change file to confirm.
- Worker's claim that two `<h1>`s exist on a proposal page (hero + catalogue sample) and axe reports nothing: confirmed, axe test in the new spec passes with WCAG 2.1 A/AA tags.
- `baseline/proposal.css`'s `biome-ignore-all` for `noEmptySource` is justified and scoped to that one file.

## Checks run (in this worktree, not origin)

- `bun install --frozen-lockfile`: 358 packages, ok.
- `bun run lint`: 81 files, no fixes needed.
- `bun run check`: 0 errors/warnings/hints.
- `bun run build`: 4 pages, no `dist/ui/`, `<html lang="pl">` with no `data-proposal` attribute.
- `bun run test:e2e`: 49 passed.
- Mutation (`data-proposal` attribute removed from base-layout): 3 tests fail as expected; reverted.
- `git diff` scanned for U+2014 (em-dash): none added.
- `git diff --stat`: no touches to `Dockerfile`, `nginx.conf`, `og-default.png.ts`, `tokens.css`, or `DESIGN.md` — no docker-build or DESIGN.md update required for this range.

PASS
