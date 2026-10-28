# KA0109 - Review 1

- Job: 2026-10-28-review-ka0109-forced-col-8c6be0b0
- Branch: h/2026-10-28-ka0109-forced-colors-foc-fc77cf00
- Commit reviewed: 487b77ef3611e2dea5a59a8784f1a6caef0288aa
- Verdict: PASS

## Final message

Worktree clean, no leftover mutations.

**Findings:** none that block.

**Notes:**
- Worker's final message claims "The repo has no `npm test` script" — false; `package.json` has `"test": "playwright test"`, identical to `test:e2e`. Harmless since the command actually run (`bun run test:e2e`) is the same script under a different name, so the Done-means requirement is satisfied in substance; just an inaccurate statement in the report.
- Deviation from ticket's literal wording (outline moved to focus rules, not base rules) is pre-approved on `main`'s ticket Decisions (2026-10-28, coordinator). Re-verified independently below that the literal wording does break the Goal.

**Checks run (in this worktree, against this commit):**
- `bun install --frozen-lockfile`: ok.
- `bun run lint`: "Checked 116 files … No fixes applied."
- `bun run check`: 0 errors/warnings/hints.
- `bun run build`: succeeds, static + server output as expected.
- `bunx playwright test -g "forced colors|normal colors"`: 8/8 passed.
- `bun run test:e2e` (full suite): 216 passed, 2 flaky-then-passed (`contact-form.spec.ts` submit-lock timeout, `og-image.spec.ts` fetch) — both in files untouched by this diff, reproduced only under full-suite load; not caused by this change.
- Mutation: removed `outline: 2px solid transparent;` from `.mb-input:is(:focus, …)` → normal-colors cases for email/company fail (`outline solid rgb(142, 174, 216)`), confirming the global `:focus-visible` ring would otherwise leak. Matches worker's table.
- Mutation: moved the transparent outline back to the base `.mb-input` rule and removed it from the focus rule (literal ticket wording) → forced-colors cases for email/company fail with resting field `outline-style: "solid"` (ringed) instead of focused — reproduces the exact `rejected-base-rule` regression the coordinator's decision cites, confirming the deviation was necessary to meet the Goal, not cosmetic.
- Both mutations restored (`git status` clean after).
- Confirmed specificity: `.mb-input:is(:focus, …)` (two class-level selectors) outranks the site-wide `:focus-visible` rule in `global.css` (one), so the focus-rule's `outline: 2px solid transparent` always wins in normal mode — matches observed passing normal-colors tests.
- No em-dash in the diff. No tokens/brand/palette touched (no `DESIGN.md` update needed). Scope confined to the three named components + matching `tests/e2e/a11y.spec.ts` spec + ticket screenshots.

PASS
