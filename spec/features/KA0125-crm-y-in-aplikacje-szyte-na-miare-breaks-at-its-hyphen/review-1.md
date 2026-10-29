# KA0125 - Review 1

- Job: 2026-10-29-review-ka0125-taste-6035b882
- Branch: h/2026-10-29-ka0125-taste-3b4f95a7
- Commit reviewed: f68930f3b241e51d342962712583711a826fbdd7
- Verdict: PASS

## Final message

Worktree clean, no leftover mutations.

---

**Notes (non-blocking):**
- `ABBREVIATION_HYPHEN` (`(?<=\p{Lu}{2})-(?=\p{Ll})`) is not word-bounded: a mixed-case run like `xYZ-ab` would also get the joiner, since the lookbehind only checks the two characters immediately before the hyphen. No such string exists in current copy (worker's grep confirms only "CRM-y"); same unbounded style as the existing `ONE_LETTER_WORD` rule it sits beside. Not a regression, just a latent generality.
- 1 flaky test in the full suite (`dev-no-reload.spec.ts`, navigation-timing flake on `/ui`), passed on retry, unrelated to this diff's `src/lib/line-breaks.ts` / `src/middleware.ts` / `tests/e2e/line-breaks.spec.ts` changes — not a reason to fail.

**Checks run (in this worktree, not the main checkout):**
- `bun install --frozen-lockfile`: 378 packages installed.
- `bun run lint`: 118 files checked, no fixes needed.
- `bun run check`: 0 errors/warnings/hints (102 files).
- `bun run build`: succeeds, static client + Node server entry built.
- `bun run test:e2e` (full suite): 237 passed, 1 flaky (`dev-no-reload.spec.ts`, passed on retry) — 238 total, matches worker's claim.
- `tests/e2e/line-breaks.spec.ts` in isolation: 5/5 pass.
- Mutation tests (throwaway edits in `src/lib/line-breaks.ts`, reverted with `git checkout --`, worktree confirmed clean after):
  - `\p{Lu}{2}` → `\p{Lu}{1}` (one capital triggers the joiner): caught — "X-ray"/"B2B-owy" wrongly joined, test fails.
  - Lowercase-only lookahead widened to accept uppercase/digit too: caught — "AI-B"/"CRM-2" wrongly joined, test fails.
  - Removed the `token.startsWith("<")` tag-exclusion branch (process tags/attributes/raw content too): caught — `<img alt="CRM-y">` and script/code/title untouched-cases both fail.
- Visually compared `services-apps-1440-before.png` vs `-after.png`: before, "CRM-" ends line 1 of the `customApps` paragraph and "y i panele" starts line 2; after, "CRM-y" sits whole on line 2. Matches the ticket's Goal and the worker's description.
- Confirmed `src/data/home.ts` has no diff in this range (copy stays a plain hyphen) and `llms-full.txt` test asserts `"CRM-y i panele"` with no joiner/nbsp — grounds the worker's claim that the text export is unaffected.
- Grepped for `U+2014`/em-dash in the diff: none added.
- Grepped for leftover `one-letter-words`/`bindOneLetterWords` references: only inside historical KA0114 `findings.md`/`outcome.md`/`review-1.md`, which the worker correctly left untouched (historical record, not live docs).
- `AGENTS.md` updates (copy convention line, `middleware.ts`/`lib/`/`tests/e2e/` structure entries) match the rename and new rule; consistent with the already-loaded repo-rules snapshot.
- Ticket's `## Done means` acceptance: fix with proving test ✓, `bun run check`/`bun run test:e2e` pass ✓ (no separate "structure test" exists in this repo, as the worker noted and I independently see no such test file).
- No `Plan:` line in the instruction, so no plan to compare against.

PASS
