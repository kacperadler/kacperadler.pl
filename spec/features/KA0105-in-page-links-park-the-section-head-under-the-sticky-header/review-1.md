# KA0105 - Review 1

- Job: 2026-10-28-review-ka0105-good-css-t-175a8e73
- Branch: h/2026-10-28-ka0105-good-css-top-3-a7ede390
- Commit reviewed: 9dc747ae14ffaa5c0d272f19cd4f2be8113ffc30
- Verdict: PASS

## Final message

## Review: KA0105 (carries KA0106, KA0107)

**Diff scope** (`67a8f12..9dc747a`): `header.astro`, `mobile-sheet.astro`, `global.css`, `tokens.css`, `AGENTS.md`, `DESIGN.md`, 3 new/extended spec files, 14 before/after screenshots. Matches the three tickets' combined scope; `nav-active.ts` untouched as the ticket requires.

### Findings
None that block merge.

### Notes
- `--mb-header` dead zone 343-359px (worker flags this in final message): forced two-row header kicks in only below 360px, but the "would otherwise wrap" fallback only guarantees two rows at ≤342px with current fonts. Acknowledged limit, no common device hits it, not a ticket violation (ticket allows "a per-breakpoint value").
- `.mb-sheet-close` scrolls away with content on landscape overflow (ticket explicitly left this as a worker choice; Esc/links remain). Fine.
- Two mutations the worker reports as "not caught" (`min-height` on `.mb-header`, `overscroll-behavior: contain`) are honestly disclosed with reasoning, not hidden.

### Checks run (in this worktree, against the stated range)
- `bun install --frozen-lockfile`: 378 packages, clean.
- `bun run lint`: 111 files, no errors.
- `bun run check`: 95 files, 0 errors/warnings/hints.
- `bun run build`: succeeds, static + server output as expected.
- `bun run test:e2e`: **183 passed** (3.6m), matches worker's claim.
- Mutation 1: deleted `scroll-padding-block-start` line from `global.css` → `nav-active.spec.ts` "lands #cases just under the header at 1440px" fails (`Received: 79.27` vs expected ≤1). Matches worker's claimed table row. Reverted, tree clean.
- Mutation 2: deleted `overflow-y: auto` from `mobile-sheet.astro` → `mobile-sheet.spec.ts` landscape suite: 2 failures (`×`). Matches worker's claimed table row. Reverted, tree clean.
- `git diff -- ':!*.png' | grep em-dash`: none added.
- Commit: single, Conventional-Commits with ticket scope (`fix(KA0105): ...`), consistent with the three-tickets-as-one-fix decision in the ticket.
- No Tailwind, no adapter change, no CMS/React, no cookies/trackers, no light-theme/`data-theme` revival in the diff. Motion change (`scroll-padding-block-start`) correctly sits outside the `prefers-reduced-motion` query per the ticket's explicit instruction, and isn't itself an animation.
- `DESIGN.md` updated for the new token (`--mb-header`) and the `text-wrap: pretty` rule, as tokens-change requires.

All three tickets' Done-means items are present and verified: header-height token read in both `header.astro` and `global.css`, `nav-active.spec.ts` landing assertions at 1440/390/350/320px; `text-wrap: pretty` with a comparative `home.spec.ts` test; `.mb-sheet` scroll fix with an 844x390 `mobile-sheet.spec.ts` case exercising scroll + CTA click.

PASS
