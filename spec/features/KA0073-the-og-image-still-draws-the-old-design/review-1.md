# KA0073 - Review 1

- Job: 2026-10-14-review-ka0073-og-image-2df8e941
- Branch: h/2026-10-14-ka0073-og-image-76a0a62a
- Commit reviewed: c404bd3042f2d48745253855c6bd0034cd201fbd
- Verdict: PASS

## Final message

Worktree clean (no tracked-file modifications remain; grep found nothing, exit 1 is expected for empty match).

Findings: none.

Notes:
- Favicon-180.png screenshot is a scaled render of `favicon.svg` (the layout links only `favicon.svg` and `favicon.ico`, no apple-touch-icon at 180px); matches the ticket's ask for a 180px screenshot, not a missing icon file.
- Mono labels (role, url) in the OG image stay DejaVu Sans Mono, not Geist Mono; worker flagged this explicitly as a known gap, not silently dropped, and it's outside what the ticket's Done means required (it names only the headline as needing real Geist).

Checks run (in this worktree, against the stated range):
- `bun run lint` → ultracite check, 104 files, no fixes needed.
- `bun run check` → astro check, 0 errors/warnings/hints.
- `bun run build` → succeeds, `og-default.png` written at 1200×630.
- `bun run test` → 122 passed (full Playwright suite).
- Mutation: removed the `sharp({ text: { fontfile: ... } })` warm-up line, rebuilt, ran `og-image.spec.ts` alone → "the OG headline is set in Geist" fails (right edge 979, expected ≤945); confirms the test is not a tautology and genuinely depends on the fontconfig-registration trick. Reverted with `git checkout -- src/pages/og-default.png.ts`.
- `docker build -t kacperadler-pl-test .` → succeeds. Extracted `/og-default.png` and `/favicon.svg` from the built image: PNG is 1200×630 and byte-identical to the screenshot committed in the ticket folder; `favicon.svg` served is byte-identical to `public/favicon.svg`. Measured the headline's right edge inside the Docker-built PNG directly (not the host build) via sharp: 941px, inside the test's 937–945 Geist band, confirming Geist (not the DejaVu fallback) renders inside the actual Docker build environment.
- Visual check of the three ticket screenshots (`og-default.png`, `favicon-32.png`, `favicon-180.png`): square corners throughout, no dot grid, Geist ExtraBold headline, square `blue`/`ink`/`base` mark matching `brand.astro`.
- Diff scan for U+2014: none added.
- `git status --short` in the worktree: no uncommitted/untracked files beyond build tooling ignores (`dist/`, `node_modules/`, `.astro/`, `.husky/_`, etc.), nothing unexpected committed in the range.

PASS
