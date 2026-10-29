# KA0134 - Review 1

- Job: 2026-10-29-review-ka0134-webkit-22a189f0
- Branch: h/2026-10-29-ka0134-webkit-13aa1d8d
- Commit reviewed: f289e5c3c0daeb3e451a5221372a098354500756
- Verdict: PASS

## Final message

## Findings

None blocking.

## Notes

- `tests/e2e/mobile-sheet.spec.ts`: two of the three ticket-named "Chromium-side simulations" survive (`dispatchEvent("click")` for focus, computed `overflow` for scroll-lock), now run in both engines instead of going as the ticket's Done means literally says ("the Chromium-side simulations can then go"). Verified with Docker WebKit + mutation testing (below) that Playwright's Linux WebKit genuinely cannot expose either regression without them (focuses a clicked button unlike real Safari; drives no finger-pan), so dropping them would blind the suite to the exact bugs the ticket exists to catch. Fully disclosed in the worker's message and `findings.md` F2. Judgment call, not a defect.
- The third simulation ("no `overlay`", fixed-box-through-fade) is skipped in WebKit (`test.skip`), leaving zero coverage there for a `position: fixed` regression during close. Verified this is unavoidable: Linux WebKit's `close()` is instant (`display: none`, 0×0, no transition), so there's no window to observe the box in. Documented as F1, correctly left open rather than silently dropped.
- `findings.md` F1/F2 are accurate, well-evidenced, correctly scoped as out-of-ticket follow-ups.

## Checks run (in this worktree, range `ca543b8..f289e5c`)

- `bun install --frozen-lockfile`: ok.
- `bun run lint`: 0 errors (119 files).
- `bun run check`: 0 errors/warnings/hints.
- `bun run build`: succeeds.
- `bunx playwright test --project=chromium` (host): 242 passed.
- `bunx playwright test --project=webkit` (Docker, `mcr.microsoft.com/playwright:v1.64.0-noble`, as the task's Focus directed since this host lacks WebKit system libs — reproduced that failure directly, `libgtk-4.so.1` missing): 20 passed, 2 skipped, matching the worker's claim exactly.
- Mutation 1: `overflow: hidden` → `visible` in `mobile-sheet.astro` — "the page behind is locked" fails in both chromium and webkit. Confirms the guard is live, not tautological.
- Mutation 2: removed `trigger?.focus(…)` in `mobile-sheet.ts` — "Escape closes the sheet…" fails in both chromium and webkit (via the kept `dispatchEvent("click")` simulation). Confirms this simulation is load-bearing in WebKit too, supporting the worker's rationale for keeping it.
- Both mutations reverted (`git checkout --`); `git status --short` clean after.
- No em-dash added in the diff (`git diff | grep "—"` empty).
- `Dockerfile`/`nginx.conf`/`og-default.png.ts`/tokens/`DESIGN.md` untouched by this range — no Docker-build check or `DESIGN.md` update required.
- Commit messages: Conventional Commits with ticket-id scope (`test(KA0134):`, `docs(KA0134):`), matching this repo's established convention (checked prior `git log`).
- AGENTS.md/README.md diffs match the live AGENTS.md context already loaded for this review — no doc drift.

PASS
