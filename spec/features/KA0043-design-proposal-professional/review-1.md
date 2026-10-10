# KA0043 - Review 1

- Job: 2026-10-10-review-proposal-professi-7fe8a75e
- Branch: h/2026-10-10-proposal-professional-943bf522
- Commit reviewed: 1e9e795313710175cee4795931a24445fec2925a
- Verdict: PASS

## Final message

Worktree clean, no leftover edits.

## Review summary

**Scope.** Diff touches only `src/styles/proposals/professional/` (CSS, meta.json, two woff2 files, OFL.txt) and `spec/features/KA0043-design-proposal-professional/findings.md`. Matches the ticket's "In" scope and the worker's own description. Fonts sit next to `proposal.css` rather than `public/fonts/` as the ticket's Scope line literally says, but `src/lib/proposals.ts`'s own doc comment ("fonts next to it as self-hosted woff2 with their license, linked by relative url()") and the existing `modernist` proposal both establish this as the actual convention; code wins over the stale Scope wording per AGENTS.md ("Gdy dokumentacja i kod się rozjeżdżają, rację ma kod"). Not a fail.

**Palette discipline.** Scanned the full 1208-line `proposal.css`: every color is `var(--token)` or `color-mix(in srgb, var(--token) …)`. No raw hex/rgb/hsl (`grep '#[0-9a-fA-F]{3,8}'` → no matches).

**Motion.** Transitions limited to color/border/shadow (`var(--pro-ease)` = 200ms) plus two `translateX(2px)` nudges (CTA arrow, case-link icon) and `transform: none` resets for disabled state, matching the stated design choice. The spinner keyframe and its `prefers-reduced-motion` guard live untouched in `button.astro`'s own scoped style; the proposal doesn't override `.btn-spinner` or the keyframes, so that guard still applies.

**Em-dash.** `grep -n $'\u2014'` on the new CSS/JSON/findings file: no matches.

**Checks run in this worktree (not the main checkout):**
- `bun install --frozen-lockfile`: ok.
- `bun run lint`: "Checked 87 files… No fixes applied."
- `bun run check`: 0 errors/warnings/hints.
- `bun run build`: 4 pages, no `caseStudies`/blog errors beyond the known-ignorable warnings; `find dist -iname '*inter*'` → empty; the only "professional" string in `dist/*.html` is the pre-existing `ProfessionalService` JSON-LD.
- `bun run test:e2e`: 49 passed (51.2s), including `ui-proposals.spec.ts`'s parser unit tests, which are generic (not hardcoded to the new id) and pick the folder up automatically; confirmed live by curling a throwaway `astro dev` on port 4899: `GET /ui/proposal/professional` → 200, `data-proposal="professional"` present, `Inter-Variable` referenced twice.
- `OFL.txt` is the genuine Inter/SIL OFL 1.1 license text with the correct copyright line, not a placeholder.
- No `Dockerfile`/`nginx.conf`/`og-default.png.ts` touched, so the `docker build` gate doesn't apply.
- No `tokens.css`/`DESIGN.md` diff, consistent with the proposal using only existing tokens, so no `DESIGN.md` update was owed.

**Findings file.** Both `F1` and `F2` describe pre-existing baseline bugs (contact-form error banner wrapping, header brand wrapping at 390px) discovered while building the proposal, correctly filed as `Status: open` rather than silently fixed or ignored, with precise locations and reproduction. Consistent with the ticket's "Out: the live site."

No mutation-worthy blocking/validating logic in this diff: it's pure CSS for a design proposal, no new JS/guard code to invert-and-test.

PASS
