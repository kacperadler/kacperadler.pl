# KA0071 - Review 1

- Job: 2026-10-10-review-mb-fixes-round-1-35d5dc14
- Branch: h/2026-10-10-mb-fixes-round-1-182a7c93
- Commit reviewed: dca8926249b89601ffc7728b7bdfbc506d933da8
- Verdict: PASS

## Final message

Working tree clean, no residue from mutation testing.

## Findings

None that block merge.

## Notes (non-blocking)

- `breadcrumb.astro:60` (`menuId` derived from item content hash): two collapsed breadcrumbs with identical items on one page would share one `popover` id. Documented by the worker in both the code comment and the final message; no current page uses breadcrumb twice, so not a live bug. Acceptable as a stated limit.
- `src/pages/realizacje/[slug].astro` touched outside the ticket's declared Scope (`src/components/mb/`, `src/pages/_ui/mb/`, `tests/e2e/ui-mb.spec.ts`, `DESIGN.md`). Forced: deleting `tag.astro` (required by the ticket) breaks this caller; the diff is a minimal, mechanical swap to `Badge variant="tag"`. Consistent with AGENTS.md's cutover rule ("migrate every caller").
- Ticket names `src/pages/_ui/mb/` and `tests/e2e/ui-mb.spec.ts`; the repo's actual paths are `src/pages/_ui/` and `tests/e2e/ui-catalogue.spec.ts` (pre-existing, not renamed by this branch). Worker used the real paths, correctly favoring code over stale ticket text.

## Checks run (in this worktree, against base `5bd77bf8` and tip `dca8926`)

- `bun install --frozen-lockfile`: clean.
- `bun run lint`: 94 files, no fixes needed.
- `bun run check`: 0 errors, 0 warnings, 0 hints.
- `bun run build`: 4 pages, completes; `dist/` has no `/ui`, `/ui/proposal` route (confirmed via `find dist -iname '*ui*'` → empty) — `/ui`'s `prerender = false` only matters inside the dev-only injected route (`astro.config.mjs`'s `uiCatalogue` integration gates injection on `command === "dev"`); the static build never discovers `src/pages/_ui/`, so no adapter is invoked and the vision.md "no server runtime beyond the lead-store route" line holds.
- `bun run test:e2e`: 76 passed (full run, ~80s). An earlier background run of mine was cut short by a tool timeout and surfaced one spurious failure (sideways-scroll at 360px, mid-interrupt artifact); a clean full run immediately after passed 76/76, matching the worker's claim.
- Production-build diff vs base (`diff -rq` on two independent `bun run build` outputs): only `index.html`, `404.html`, `polityka-prywatnosci/index.html`, `regulamin/index.html` (shared `base-layout.*.css`) and the `index.*.css` bundle differ. `sitemap-0.xml`, `llms.txt`, `llms-full.txt`, `robots.txt` byte-identical. Diffed `index.html` content: JSON-LD block, Umami script tag, form `data-state`/aria wiring all unchanged; the only content-level differences are `.mb-tag`/`.mb-status-pill` → `.mb-badge-tag`/`.mb-badge-status` class swaps and the new CSS declarations (transitions, `::before` rule, press states). Matches the worker's claim.
- Mutation testing (throwaway edits, reverted with `git checkout --`, confirmed `git status --short` clean after): removed checkbox hover-opacity → caught; restored 600-weight on checked chip → caught (bounding-box/weight test); broke the reduced-motion accordion selector → caught; switched breadcrumb `popover="auto"` to `"manual"` → caught (Esc/outside-click no longer closes); removed the jump input's `max` → caught (browser no longer refuses out-of-range). All five Done-means behaviors have tests that actually fail without the fix.
- Scanned full diff for em-dash (U+2014) additions: none.
- Verified no dangling references to deleted `tag.astro`/`status-pill.astro` anywhere in `src/`.
- `DESIGN.md` updated for the new badge variants and the press-motion model, consistent with the styleguide's token/behavior-change requirement.
- `Dockerfile`/`nginx.conf`/`og-default.png.ts` untouched by this diff: docker build check not required.

PASS
