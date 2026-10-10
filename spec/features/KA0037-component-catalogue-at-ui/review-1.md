# KA0037 - Review 1

- Job: 2026-10-10-review-ui-catalogue-abed6e50
- Branch: h/2026-10-10-ui-catalogue-47d20fec
- Commit reviewed: 5d0027d40afc5ede9cb693831b0ec2a2e0cb9c79
- Verdict: PASS

## Final message

HEAD matches the commit under review.

**Findings:** none blocking.

**Notes (non-blocking):**
- F3 and F4 remain open, F5 newly added (case study pages from main's KA0028 bypass `Badge`/`Tag` components) — correctly filed as findings, not blockers for this ticket's scope.
- The merge pulled in substantial KA0028/KA0047 work from main; verified it doesn't regress anything in scope (build/check/e2e all green on the merged tree).

**Checks run (in this worktree, at 5d0027d):**
- `bun install --frozen-lockfile`: 358 packages, clean.
- `bun run lint`: ultracite check, 73 files, no issues.
- `bun run check`: astro check, 0 errors/warnings/hints.
- `bun run build`: 4 pages built, no `dist/ui`, sitemap has only `sitemap-0.xml` (no `/ui` reference).
- `bun run test:e2e`: 39 passed.
- Independently recomputed WCAG contrast via Node (WCAG relative-luminance formula): `#e07a70` vs `--v2-panel` `#14171c` = 6.148:1, vs `--v2-bg` `#0a0c10` = 6.698:1, old `#c44545` vs panel = 3.665:1 — matches worker's reported figures exactly.
- Mutation 1: reverted `--error` to `#c44545` in `tokens.css`, ran `tests/e2e/a11y.spec.ts -g "error states"` — fails as claimed (`3.664734930184863 < 4.5`), confirming the new a11y test actually exercises the contrast fix (not a tautology). Restored via `git checkout --`.
- Mutation 2: reverted the port fix's `.prose :is(h2)` selector to the original `:where(h2)` in `prose.css` (the pre-fix specificity bug), ran the new "typography block follows the port" test — fails as expected (`font-weight` resolves to the site's `500` instead of the port's `700`), proving the test actually catches the two-`.prose`-sources regression F3 describes rather than passing vacuously. Restored via `git checkout --`.
- Confirmed `.field .err` axe-exclude fully removed from both `ui-catalogue.spec.ts` and `a11y.spec.ts` (only unrelated `astro-dev-toolbar` exclude remains).
- Confirmed no em-dash (U+2014) added anywhere in the new-work diff.
- Confirmed `Dockerfile`, `nginx.conf`, `og-default.png.ts` untouched in this range — no docker build required.
- `findings.md`: F1 set to `fixed in c4d3186` with the correct token/rationale; ticket's Done-means item for F1 matches main's 78699ea wording exactly.

PASS
