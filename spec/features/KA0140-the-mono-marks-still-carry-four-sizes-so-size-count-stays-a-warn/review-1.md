# KA0140 - Review 1

- Job: 2026-10-29-review-ka0140-mono-sizes-3255892c
- Branch: h/2026-10-29-ka0140-mono-sizes-aeb45f1f
- Commit reviewed: abf2614a58671ccfaabef50c66964808f1a0b96d
- Verdict: PASS

## Final message

Verdict evidence complete.

**Findings:** none.

**Notes (non-blocking):**
- Commit mixes code and copy-equivalent (test comments) in one commit; styleguide wants `copy(<section>):` separate from code only for actual Polish/English user-facing copy, not comments — not applicable here, so no violation.
- Avatar size changes (`avatar.astro`, `avatar-group.astro`) only affect `/ui` catalogue (dev-only), confirmed by grep — zero production impact, correctly scoped as cleanup to satisfy the one-scale invariant in `ui-catalogue.spec.ts`.

**Checks run (in this worktree, on commit `abf2614a`):**
- `bun install --frozen-lockfile`: 378 packages, ok.
- `bun run lint`: "Checked 120 files … No fixes applied."
- `bun run check`: 0 errors, 0 warnings, 0 hints.
- `bun run build`: succeeds, static + server output built.
- `bun run test:e2e`: **253 passed** (4.5m), matches worker's claim.
- Mutation: reverted `.mb-mark` (brand k) font-size 16px → 15px in `brand.astro`, ran `bunx playwright test -g "type scale|favicon k"`: both `design.spec.ts` "type scale" (flags `15px mb-mark "k"` at 390px) and `favicon.spec.ts` "favicon k / stands as tall as the brand mark's k" (diff 8 rows, limit 3) failed as expected — confirms the new test coverage actually catches a brand-k regression, not just a renamed no-op.
- Restored mutation (`git checkout -- src/components/mb/brand.astro`), `git status --short` clean.
- Diff scanned for added em-dash (U+2014): none.
- Diff file list confirmed scope: only size-related `.astro` components, `DESIGN.md`, `public/favicon.{svg,ico}`, and the four test files named in the worker's message — no `Dockerfile`/`nginx.conf`/`tokens.css`/og-image touched, so Docker build and `DESIGN.md` token-frontmatter update are correctly not required/done.
- `DESIGN.md` type-scale paragraph read in full: states 12px labels/badges, 14px numbers, 16px brand k, matches code; favicon/brand-mark guard note present.
- Ticket Decisions honored: human-approved KA0140, favicon k follows brand k (16px chosen, within the ticket's allowed "14 or 16").

PASS
