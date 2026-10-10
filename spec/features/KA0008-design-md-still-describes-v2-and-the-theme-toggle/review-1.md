# KA0008 - Review 1

- Job: 2026-10-10-review-design-md-dark-on-4bde8f70
- Branch: h/2026-10-10-design-md-dark-only-at-78ab9b6c
- Commit reviewed: 881c76e678a10085e4ad287c13d5bd27b6b23a71
- Verdict: PASS

## Final message

Confirmed, eu-funding.astro uses `#fff`. All documentation claims check out against actual code.

Everything verified: scope exact match to ticket, all CI commands pass, grep/em-dash checks confirmed independently, color values cross-checked against `tokens.css` dark-side resolutions and `button.astro`, `.bg-stage` location confirmed in `base-layout.astro`, spotlight selector location confirmed in `global.css`, exception removals confirmed in all three criteria files, `on-blue`/`#fff` exception claims verified against source. Docs-only change, correctly out of CSS scope per ticket, findings.md correctly defers the CSS `light-dark()` cleanup rather than doing it. No em-dash added. Commits follow Conventional Commits with ticket scope.

Findings for the record (non-blocking):
- `.agents/harness/criteria/review.md` and `styleguide.md` quoted in this review session's embedded task text still show the old "DESIGN.md staleness" exceptions — that's because the task prompt captured the guide before this branch's edit; the worktree file itself is already updated correctly (verified above), so this is not a branch defect.

Checks run in worktree:
- `bun install --frozen-lockfile`: 366 packages, ok.
- `bun run lint`: Checked 68 files, no fixes applied.
- `bun run check`: 0 errors/warnings/hints.
- `bunx prettier --check "**/*.astro"`: all matched files pass.
- `bun run build`: 4 pages, Complete.
- `bun run test:e2e`: 18 passed, port 4329 free, no flake this run.
- `git diff --name-only`: only `DESIGN.md`, the three criteria files, and the ticket's `findings.md` — matches ticket Scope exactly, no CSS touched.
- `grep -n 'v2\|data-theme\|ka:theme\|light' DESIGN.md`: remaining hits are only `--v2-*` property names and words like "lighter"/"highlights"/"lights up", no theming/version text.
- Em-dash count in `DESIGN.md` and in the diff: 0 both.
- Cross-checked every frontmatter color against `tokens.css`'s dark `light-dark()` value, `button.astro`'s `.btn-primary` color rule, `.bg-stage` in `base-layout.astro`, spotlight selectors in `global.css`, and the `#fff` exception in `eu-funding.astro`: all match.

PASS
