# KA0126 - Review 1

- Job: 2026-10-29-review-ka0126-type-sizes-d2ed7d25
- Branch: h/2026-10-29-ka0126-type-sizes-f004a3dc
- Commit reviewed: df5e990d4ec183feb0a455850da0a6fd60611d86
- Verdict: PASS

## Final message

Worktree clean after mutation-test restores.

**Findings:** none blocking.

**Notes:**
- F1 (open, non-blocking): mono marks (11-14px) and brand `k` (15px) keep their own sizes per ticket's explicit instruction ("keep the mono marks at their size"); `size-count` WARN persists as documented, correctly logged as a finding for the human rather than silently expanded scope.
- Several other mono-family declarations (`pagination.astro:190` 13px, `avatar.astro:109` 15px, `avatar-group.astro:61` 15px) were left untouched; correctly out of scope since `offScaleText` excludes any `font-family` containing "Mono", consistent with the ticket's "keep the mono marks" decision. Not listed individually in F1 but that's an incompleteness in the finding's file list, not a code defect.

**Checks run (in this worktree, range `b6da9bc..df5e990`):**
- `bun install --frozen-lockfile`: ok.
- `bun run lint`: 120 files, no fixes needed.
- `bun run check`: 0 errors, 0 warnings.
- `bun run build`: succeeds.
- `bun run test:e2e` (full suite): **247 passed** (4.5m), matches worker's claim.
- Diff review: every `font-size` change matches the worker's described mapping (13/15/17→14/16/16, 18/22→20); `DESIGN.md` typography frontmatter (`body-lg` 18→20px, `caption` 13→14px) and prose updated consistently; new `findings.md` F1 correctly scoped and left `open`.
- Spot-mutation (own, not relying on worker's claim): reverted `field-set.astro` legend 20→18px, ran `ui-catalogue.spec.ts` type-scale test → caught (production `design.spec.ts` test correctly did not fire, since `FieldSet` isn't used on any production page); reverted `hero.astro` subtitle 20→18px, ran `design.spec.ts` type-scale test → caught on `/` at 390px. Both mutations restored (`git checkout --`), worktree confirmed clean.
- Screenshots: all 28 before/after pairs present (7 sections × {1440,390} × {before,after}); visually inspected hero, about, contact, footer at 390px and hero at 1440px — no overflow, no clipped text, headline/mono/brand sizes visually unchanged, body copy reflows cleanly at the smaller line lengths.
- No em-dash (U+2014) introduced anywhere in the diff.
- No `Dockerfile`/`nginx.conf`/`og-default.png.ts` touched, so no Docker-build gate applies.
- Commits: two, Conventional Commits with `KA0126` scope (`feat`, `docs`), ticket scope respected (type-size fold only, screenshots, findings, DESIGN.md).

PASS
