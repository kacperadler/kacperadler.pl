# KA0103 - Review 1

- Job: 2026-10-28-review-ka0103-3fad62f8
- Branch: h/2026-10-28-ka0103-4e3e9c16
- Commit reviewed: aac74febcd8ec4e3740ffed93debdafc28ffba53
- Verdict: PASS

## Final message

## Findings

None blocking.

## Notes (non-blocking)

- Commit message uses `fix(KA0103): ...` as scope; the review guide's example convention uses a component/section scope (`fix(button): ...`). Not a FAIL criterion, just a minor style deviation.
- The `visibilitychange` listener in `base-head.astro` stays attached (`once: true`) even after the `PerformanceObserver` callback already fires `go()`; a later visibility change calls `afterFrames()` redundantly. Harmless (dataset write is idempotent, already `"go"`), not exercised as a bug.
- Worker's final message honestly flags that the "hidden before paint" fallback test can't prove real Chrome background-tab `requestAnimationFrame` throttling behaviour in headless mode `[INFERENCE]` — acknowledged limitation, not a hidden claim.

## Checks run (in this worktree, range `438dec7..aac74fe`)

- `bun install --frozen-lockfile` — ok.
- `bun run lint` — "Checked 111 files in 826ms. No fixes applied."
- `bun run check` — "0 errors, 0 warnings, 0 hints" (95 files).
- `bun run build` — completed, static + server output built.
- `bun run test:e2e` — **180 passed** (3.9m), matches worker's claim.
- Baseline (unmutated) `bunx playwright test tests/e2e/blueprint.spec.ts -g "come in as one sequence" --repeat-each=15 --retries=0`: **30 passed** (15 × 2 widths).
- **Mutation** (the one the Focus asked me to check): replaced the `PerformanceObserver`/`afterFrames` logic in `base-head.astro` with an unconditional, immediate `root.dataset.blEnter = "go"` (entrance starts before first paint is ever reported) — same command: **30/30 failed**, all at `expect(a.sincePaint).toBeGreaterThanOrEqual(0)` with negative deltas (e.g. `-13.18`). File restored via `git checkout --` immediately after (confirmed `git status --short` clean, diff against pre-mutation backup empty).
- `grep` for U+2014 across the diff: none found.
- `git status --short` after all checks: clean.

Mutation independently confirms the Done-means requirement ("still failing when the entrance starts before the first paint") — the worker's claimed row in their mutation table is reproducible exactly as described. All CI-equivalent commands green, docs (`AGENTS.md`, `DESIGN.md`, `global.css` comment) updated consistently with the code change, diff stays inside ticket scope (head script start signal + its test + docs), no `AGENTS.md` Don't violations, no vision.md violations.

PASS
