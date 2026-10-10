# KA0065 - Review 1

- Job: 2026-10-10-review-proposal-mb-compu-62c313e9
- Branch: h/2026-10-10-proposal-mb-computer-45b066a9
- Commit reviewed: af31171b19350d0376b9325b0c1828f0206d2720
- Verdict: PASS

## Final message

Worktree clean, no stray edits left from checks.

Notes:
- `meta.json` description is two sentences as required; `strictObject` schema accepted it (no extra keys).
- Font `GeistPixel-Square.woff2` + `OFL.txt` copied from `computer/` with correct license text; `font-weight: 100 900` on the single variable face avoids faux-bold, matching the file's own comment.
- All color values trace to existing `tokens.css` tokens (`--ink`, `--blue`, `--error`, `--muted`, `--v2-line`, `--v2-bg`) via proposal-local `--mbc-*` aliases; no new tokens, so no `DESIGN.md` update needed.
- F1 (catalogue 360px horizontal scroll) is correctly logged as an open finding rather than fixed in-branch: it's a pre-existing bug in `src/pages/_ui/catalogue.astro` shared by every proposal including `baseline`, outside this ticket's `src/styles/proposals/minimal-brutalism-computer/` scope.
- `prefers-reduced-motion` block at the end of `proposal.css` disables both the hero cursor and the submit-button cursor animation, consistent with the ticket's Done-means requirement.

Checks run in this worktree:
- `bun install --frozen-lockfile`: clean.
- `bun run lint`: "Checked 95 files in 308ms. No fixes applied."
- `bun run check`: "0 errors, 0 warnings, 0 hints."
- `bun run build`: succeeds; verified no `data-proposal`, no `GeistPixel`, no `/ui`/`proposal` artifacts in `dist/`.
- `bun run test:e2e`: 56 passed (includes the axe WCAG-AA loop over every proposal folder, which now iterates this new one via `readdirSync(PROPOSALS_DIR)`).
- Diff scope: only `spec/features/KA0065-.../findings.md` and the four new files under `src/styles/proposals/minimal-brutalism-computer/`; no other proposal or live-site file touched.
- `grep` for U+2014 and raw hex/rgb colors in the new CSS/meta: none found.

PASS
