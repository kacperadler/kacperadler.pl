# KA0115 - Review 1

- Job: 2026-10-29-review-ka0115-dialog-she-2285eef3
- Branch: h/2026-10-28-ka0115-dialog-sheet-875a78e9
- Commit reviewed: cc95fadbc71cd4bf7234632b0e716ad41177ef37
- Verdict: PASS

## Final message

## Findings

None that block.

## Notes (non-blocking)

- F1 in `findings.md` (worker-authored, status `open`): e2e has no WebKit project, so the three Safari-only CSS rules (`position: fixed` held through fade-out, root scroll lock, focus-return after a non-focusing click) are only simulated in Chromium. Reasonable risk note, correctly scoped out of this ticket (ticket's Done-means doesn't ask for a WebKit project); will become a planning ticket on merge per the findings-file convention.
- `dialog.mb-sheet` drops `role="dialog"` from markup — correct, the element has that role implicitly; `getByRole("dialog", ...)` test still passes.

## Checks run (in this worktree, against `cc95fadbc71cd4bf7234632b0e716ad41177ef37`)

- `bun install --frozen-lockfile`: 378 packages, ok.
- `bun run lint`: 117 files, no fixes needed.
- `bun run check`: 0 errors / 0 warnings / 0 hints.
- `bun run build`: completes clean, static + server bundle built.
- `bun run test:e2e`: **234 passed** (4.6m) — matches worker's claim.
- Mutation 1 (`showModal()` → `show()` in `mobile-sheet.ts`): 5 tests in `mobile-sheet.spec.ts` fail (modal state, fade transitions, tab trap, Escape, scroll lock) — confirms test suite actually exercises modal semantics, not just wiring. Reverted (`git checkout -- src/scripts/mobile-sheet.ts`), confirmed clean.
- Mutation 2 (dropped `:global(html:has(.mb-sheet:modal)) { overflow: hidden; }` from `mobile-sheet.astro`): "the page behind is locked while the sheet is open" test fails as expected. Reverted, confirmed clean.
- `git diff ... | grep` for U+2014: none added.
- `git status --short`: clean after both mutation reverts, worktree matches reviewed commit.

Ticket's Done-means satisfied: sheet is a native `<dialog>`, opened with `showModal()`/closed with `close()`; inert loop, Escape branch and inline scroll lock all removed (confirmed by diff and reading `mobile-sheet.ts`); `trapTab` kept per AGENTS.md Tab-wrap requirement; `syncOnLoad` dropped and the ClientRouter-swap-with-sheet-open path has a new regression test, which passes. No scope creep: diff touches only `mobile-sheet.astro`, `mobile-sheet.ts`, their tests, `ui-catalogue.spec.ts`, and two doc lines (`AGENTS.md`, `page-frame.astro` comment) plus the ticket's `findings.md` — all within KA0115's named files. No tokens/brand/palette touched, so no `DESIGN.md` update required; no `Dockerfile`/`nginx.conf`/`og-default.png.ts` touched, so no docker-build check required.

PASS
