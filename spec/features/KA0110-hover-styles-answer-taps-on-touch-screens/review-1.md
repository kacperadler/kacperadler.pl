# KA0110 - Review 1

- Job: 2026-10-28-review-ka0110-hover-on-t-85784010
- Branch: h/2026-10-28-ka0110-hover-on-touch-53cd2034
- Commit reviewed: 80f0e833d6affc836d92a0452a78d2039b1970a7
- Verdict: PASS

## Final message

All checks pass. Final verification summary.

**Findings:** none that block merge.

**Notes (non-blocking):**
- `tests/e2e/dev-no-reload.spec.ts` failed once in the full 209-test run (timing flake on the dev server's reload probe), passed on immediate rerun alone and in a full clean rerun (209/209). Not touched by this diff, pre-existing test unrelated to hover/touch changes.

**Checks run (in this worktree, this range):**
- `bun install --frozen-lockfile`: 378 packages, clean.
- `bun run lint`: "Checked 116 files … No fixes applied."
- `bun run check`: 0 errors, 0 warnings, 0 hints.
- `bun run build`: static + server build completes.
- `bun run test:e2e -- --retries=0`: first run 208 passed / 1 failed (`dev-no-reload.spec.ts`, unrelated file); isolated rerun of that spec passed; full clean rerun 209/209 passed.
- Diff review: every `:hover` in `src/components/mb/**` confirmed moved inside `@media (hover: hover) and (pointer: fine)` (grep across all 19+ files), each with an unguarded `[data-state="hover"]` twin in the same source position (specificity for `:pseudo-class` vs `[attr]` branches is equal, so splitting `:is(:hover, [data-state="hover"])` into two adjacent same-specificity rules preserves cascade order against neighboring `.active`/`:active`/`:focus-visible` rules — checked explicitly in `button.astro`, `card.astro`, `link.astro` nav/footer, `mobile-sheet.astro`). `:active` rules confirmed untouched except where originally combined with `:hover` in a shared `:is()` (`link-footer` svg color), where only the `:hover` branch moved into the query and `:active`/forced branches stayed unguarded — correct per ticket's "Out: the `:active` styles."
- Mutation 1: unwrapped `.mb-btn-link:hover` from its media query → both guard tests in `touch-hover.spec.ts` failed (production pages and `/ui`), exact fault reported; reverted (`git checkout -- src/components/mb/button.astro`, clean diff after).
- Mutation 2: removed `-webkit-tap-highlight-color: transparent` from `global.css` → the tap-highlight test failed, showing the real highlight color leaking through; reverted (`git checkout -- src/styles/global.css`, clean `git status`).
- Screenshots verified visually: phone shot shows card "02.1" idle (no blue fill/grips) after tap; desktop shot shows "02.1 ↔ 377" blue with grips under mouse hover — matches the worker's description and confirms cascade/specificity split didn't change the mouse-hover look.
- No em-dash (U+2014) in the diff. `Dockerfile`/`nginx.conf`/`og-default.png.ts` untouched, so no Docker build required. `AGENTS.md` and `DESIGN.md` updated for the new hover convention. Commits follow Conventional Commits with ticket scope.

PASS
