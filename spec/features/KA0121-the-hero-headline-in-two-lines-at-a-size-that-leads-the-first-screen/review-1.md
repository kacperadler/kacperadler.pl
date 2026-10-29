# KA0121 - Review 1

- Job: 2026-10-29-review-ka0121-hero-headl-87ed9632
- Branch: h/2026-10-29-ka0121-hero-headline-bd4f4424
- Commit reviewed: 26463f832b8a6add8f5fdc3ddfea3a1c22cecfc3
- Verdict: PASS

## Final message

## Review: h/2026-10-29-ka0121-hero-headline-bd4f4424 @ 26463f8

### Findings
None blocking.

### Notes
- `hero-1440-after.png` shows visible empty space between the subtitle and the hero buttons (worker-disclosed). This is a direct, structural consequence of the ticket's own approved decision ("the buttons on the card button's line... still holds") combined with the subtitle now anchoring to the card caption instead of the headline; it is not a defect introduced by sloppy CSS, and the gap is modest. Acceptable.
- F1 in `findings.md` (320px sideways scroll on an unrelated button, pre-existing per worker's HEAD-reverted repro) is correctly logged as `open`, not silently fixed or ignored, and out of this ticket's scope.
- `dev-no-reload.spec.ts` flaked once during the full run (unrelated file, not touched by this branch) — a timing-sensitive dev-server file-watch probe, environment flake, not caused by this diff.

### Checks run (in this worktree, against the given range)
- `bun install --frozen-lockfile`: ok.
- `bun run lint`: "Checked 119 files... No fixes applied."
- `bun run check`: 0 errors, 0 warnings, 0 hints.
- `bun run build`: completes clean.
- `bun run test:e2e`: 245 passed, 1 flaky (`dev-no-reload.spec.ts`, file untouched by this branch) — matches worker's "246 passed" claim (retry succeeded).
- Manual Playwright probe against the built preview at 1920px, overriding `h1` font-size 78→86px: two lines hold through 83px, break to three at 83.5px/84px. Independently confirms the worker's "cap at 80px not 84px" design call and its stated measurement.
- Visual check of `hero-{1440,1024,390}-{before,after}.png`: headline is the dominant element, two lines at 1440/1024, still four lines at 390 (larger, as ticket allows); figures sit beside text on desktop, card rows/buttons align as described.
- `entrance-1440.mp4` frames at 0.1s/1.5s: headline, subtitle, card rows, buttons and trust bar enter via the same staged transform sequence as before — no new animated property, consistent with `AGENTS.md`'s entrance description.
- Three throwaway mutations in `hero.astro`, each restored via `git checkout --` afterward:
  - Cap `5rem`→`5.25rem` (84px): `design.spec.ts` "grow with the width", "follow the reader's default font size", and `home.spec.ts` "headline leads..." all fail as claimed.
  - Removed `grid-column: 1 / -1` on `h1`: `blueprint.spec.ts` "headline runs over the title block...", `home.spec.ts` "headline leads...", and "headline spans the sheet..." all fail as claimed.
  - Removed `overflow-wrap: break-word`: `a11y.spec.ts` "no page scrolls sideways at 360px with a fallback font" fails as claimed (the safety-relevant case).
  - Tree confirmed clean (`git status --short` empty, diff stat matches original) after each restore.
- `git diff ... | grep em-dash`: none added.
- `DESIGN.md`/`AGENTS.md` updated for the `display-xl` token and hero prose in the same branch, as required for a token change.
- Diff scope: `hero.astro`, three spec files, `DESIGN.md`, `AGENTS.md`, `findings.md`, screenshots/recordings only — no scope creep.
- Commits: `feat(KA0121): ...`, `docs(KA0121): ...`, Conventional Commits with scope.

PASS
