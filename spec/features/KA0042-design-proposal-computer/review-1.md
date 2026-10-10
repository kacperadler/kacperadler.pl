# KA0042 - Review 1

- Job: 2026-10-10-review-proposal-computer-eb046c9e
- Branch: h/2026-10-10-proposal-computer-dc1c52da
- Commit reviewed: d660d0bed115e9aba338b7c6e7ad16f4b58f99fc
- Verdict: PASS

## Final message

All checks confirm the branch is sound. Final review summary below.

**Checks run (in worktree, this range):**
- `bun install --frozen-lockfile`: ok.
- `bun run lint`: 85 files, no fixes — matches claim.
- `bun run check`: 0 errors/warnings/hints — matches claim.
- `bun run build`: 4 pages built; `dist/` grepped for `computer`/`GeistPixel` — zero hits, confirming the proposal ships nothing into production.
- `bun run test:e2e`: 49 passed (57.6s) — matches claim.
- Independent axe run (throwaway script, same WCAG tags as the suite) against `/ui/proposal/computer` on a separate dev server (port 4555): 0 violations at 1440px and 390px — matches worker's claim, verified myself rather than trusting it.
- Independent reduced-motion check: `getComputedStyle` of `.hero h1::after` with Playwright's `reducedMotion: "no-preference"` vs `"reduce"` context option. Normal: `animation-duration: 1.06s`, `iteration-count: 6`. Reduced: `animation-duration: 1e-05s`, `iteration-count: 1` — the global `@media (prefers-reduced-motion: reduce)` rule in `src/styles/global.css` (unchanged, pre-existing, `!important`) catches the new `computer-blink` keyframe without the proposal needing its own override; cursor stops blinking and stays lit either way. Confirms the Focus's explicit check.
- `grep` for em-dash (U+2014), raw hex/rgb/hsl colors in the new files: none found.
- Diff stat matches the worker's claimed file list and line counts for both commits exactly.
- Fonts: `GeistPixel-Square.woff2` + `OFL.txt` sit next to `proposal.css` in `src/styles/proposals/computer/`, loaded via relative `url()`, same pattern the `baseline` proposal's own comment documents (read via `git show main:src/styles/proposals/baseline/proposal.css`) — this is the actual convention, the ticket's Scope line about `public/fonts/` is stale against it, and the deviation is explained in the final message.
- `meta.json`: two-sentence Polish description, no embedded newline, `references` with `label`/`url` — matches the schema the generic `ui-proposals.spec.ts` already enforces for every folder (that spec iterates `src/styles/proposals/*`, so `computer` is covered by the existing generic tests without needing a new spec file).
- `findings.md`: new file, F1 entry well-formed (`Status: open`), consistent with the project's findings convention; the worker worked around the bug on the proposal page only and logged the root cause against `contact-form.astro`, outside this ticket's scope — correct call, not a regression they introduced.

**Notes (non-blocking):**
- F1 (send-error banner layout bug in `contact-form.astro`) is pre-existing on the live site, not introduced by this diff; correctly filed as a finding rather than fixed here.

No findings that block merge. Scope held (`src/styles/proposals/computer/` only, plus the required findings doc); no Tailwind, no theming machinery, no raw colors, no em-dash, no always-on foreground animation, axe clean, reduced-motion respected, production build unaffected.

PASS
