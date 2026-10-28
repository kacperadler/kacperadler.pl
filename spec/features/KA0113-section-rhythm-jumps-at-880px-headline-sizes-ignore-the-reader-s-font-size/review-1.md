# KA0113 - Review 1

- Job: 2026-10-28-review-ka0113-fluid-rhyt-6ba55197
- Branch: h/2026-10-28-ka0113-fluid-rhythm-8676d02f
- Commit reviewed: a8237843cd6c619be087dd79d5c5be14ee5d8264
- Verdict: PASS

## Final message

Findings: none that block the merge.

Notes (non-blocking):
- `hero.astro:173` `min(clamp(2.5rem, 1.7403rem + 3.1169vw, 4rem), 12vw)`: at the default 16px font and widths 300–339px the `12vw` cap (36–40.7px) undercuts the clamp's own 40px floor (e.g. 38.4px at 320px, ~4% smaller than the pinned "phone" value). Verified by computing the formula directly (`node` calc) and cross-checked against the live preview. Harmless (smaller, not an overflow) and untested by `design.spec.ts` (whose exact-value checks start at 360px, and the no-sideways-scroll test only exercises 320px with the *larger* 20/24/32px fonts, where the cap is below the clamp's preferred value for the right reason). Not a regression the ticket pins, but worth knowing if a future ticket asserts exact pixel sizes down to 320px.
- Ticket evidence cites a third clamp in `src/pages/404.astro:55`; current `404.astro` (unchanged by this diff) already renders its heading through `SectionHead`, so the fix to `section-head.astro` covers it. Confirmed by reading both the base and current `404.astro` (identical, no own clamp).

Checks run (in this worktree, not the worker's):
- `bun install --frozen-lockfile`: 378 packages, ok.
- `bun run lint`: "Checked 116 files … No fixes applied", exit 0.
- `bun run check`: 0 errors / 0 warnings / 0 hints.
- `bun run build`: completes, static + server output generated.
- `bun run test` (full Playwright suite, backgrounded ~5 min): 220 passed, 1 flaky-then-passed (`dev-no-reload.spec.ts`, a known dev-server navigation race unrelated to this diff's files), 221 total — matches the shape of the worker's "221 passed" claim.
- Independent throwaway Playwright scan (not part of the suite): `/`, `/polityka-prywatnosci/`, `/regulamin/`, `/realizacje/`, a case-study page, and `/this-route-does-not-exist`, at widths 320–1440 in 17 steps, under both a 16px and a 20px default font (CDP `Page.setFontSizes`) against the real `astro preview` build: 204/204 checks, zero `scrollWidth > clientWidth`. Directly answers the task's "Focus" question.
- Verified by hand-computing all four `clamp()` formulas (gap, block-gap, hero, section title) from the stated 390px/1160px end-points: every `rem` intercept and `vw` slope in the diff matches to the shown precision.
- Visual check of the worker's screenshots (`01/02` at 1024px, `09`/`10` at large default fonts): headline grows, no overflow, underline/callout position tracks the text.
- `DESIGN.md` frontmatter and prose (Typography, Layout) updated to match the new tokens; no stale `70px/0.98/-0.055em` left over.
- Diff scanned for U+2014 (em-dash): none.
- Diff touches no `Dockerfile`/`nginx.conf`/`og-default.png.ts`, so the Docker-build check in the review guide doesn't apply.
- Commits: `feat(KA0113)`, `test(KA0113)` ×2, `docs(KA0113)` — Conventional Commits with scope, matches repo convention; no copy commit needed (no user-facing copy changed).

Ticket's Done-means are met: clamp tokens worked out from 390/1160, 880px gap-only block removed (`--mb-header` left in place), three headline clamps rewritten `rem + vw`, `DESIGN.md` updated, 1440/390 pixel-identical for the gaps (confirmed by the exact-match test and by hand), new test proves it. The two choices flagged in the task's Focus are both consequences the ticket's own math requires (intermediate widths must change once endpoints are pinned and the curve is continuous) or a necessary fix to avoid introducing new sideways-scroll (the `vw` cap), and both are disclosed, commented in the code, covered by DESIGN.md and by new tests whose mutation table (and my independent overflow scan) backs them up.

PASS
