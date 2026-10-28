# KA0102 - Review 1

- Job: 2026-10-28-review-ka0102-f324e853
- Branch: h/2026-10-28-ka0102-007a1fe0
- Commit reviewed: f99b0cc041853489cd6b0f8f34001bccfa77428a
- Verdict: PASS

## Final message

All in scope. Verification complete.

**Findings:** none blocking.

**Notes:**
- `spec/features/.../findings.md` F1 logs the flaky `dev-no-reload.spec.ts`/hero-entrance tests as a known risk under parallel load; my own full `test:e2e` run hit the same class of flake (`dev-no-reload.spec.ts`, not the hero-entrance test the worker saw) and it passed on retry (exit 0). Consistent with the worker's "timing under load" diagnosis, unrelated to this diff.

**Checks run** (in this worktree, `bun install --frozen-lockfile` first):
- `bun run lint`: "Checked 111 files … No fixes applied."
- `bun run check`: 0 errors, 0 warnings, 0 hints.
- `bun run build`: succeeds, `dist/client` + `dist/server` produced, `/404.html` prerendered.
- `bun run test:e2e` (full suite): exit 0, 177 passed, 1 flaky (`dev-no-reload.spec.ts`, passed on retry).
- Targeted run `-g "the 404 opens|has no hero" --retries 0`: 5/5 passed.
- Mutation: reverted `src/pages/404.astro` to pre-branch (`HEAD` at base) → new test fails (`Received: 0` heads), as claimed; restored with `git checkout --`, `git status --short` clean afterward.
- Visually inspected `404-desktop.png` (1440px) and `404-mobile.png` (390px): dimension-line rule with ticks, width label ("1128"/"358"), blue "§ 01 / 404" label, heading, lede positioned beside (desktop) / under (mobile) the heading, two buttons below — matches the worker's description and the updated `DESIGN.md:195` line.
- Diff scoped to `src/pages/404.astro`, `tests/e2e/blueprint.spec.ts`, `DESIGN.md`, ticket `findings.md`, and the two screenshots — no em-dash in the diff (`grep -P '\x{2014}'` empty), no out-of-scope files touched.
- `src/components/mb/section-head.astro` untouched by this diff (pre-existing component, already used by `legal-layout.astro`); the implementation matches the ticket's second allowed option ("build the 404 on `section-head.astro` with `404` as its label") verbatim.

PASS
