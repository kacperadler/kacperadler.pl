# KA0054 - Review 1

- Job: 2026-10-14-review-ka0054-contact-li-3feb0d60
- Branch: h/2026-10-14-ka0054-contact-link-step-7f2526ae
- Commit reviewed: 930621861ac3ec127180de3438fe29342ee8f777
- Verdict: PASS

## Final message

Worktree clean, no leftover mutation.

Findings: none blocking.

Notes:
- F1 (flaky motion test) correctly filed as `open` in findings.md; pre-existing test pattern issue, not introduced by this diff's logic, doesn't block.
- Screenshot paths (`/tmp/ka0054-shots/`) claimed by worker weren't independently reverified visually; pixel-centring is proven instead by the new Playwright assertions (`expectMarksOnCardCentres`), which is the binding Done-means criterion.

Checks run (in this worktree, after `bun install --frozen-lockfile`):
- `bun run lint` → clean, 104 files, no fixes needed.
- `bun run check` → 0 errors/warnings/hints.
- `bun run build` → completes, 4 pages built.
- `bun run test` (Playwright, full suite) → 129 passed, 0 failed, run took 3.9m.
- Mutation check: reverted `align-items: center` to `flex-start` in `step-marker.astro` → all 4 new centring tests (`/ui` at 1440/390px, home at 1440/390px) failed with 31-65px offsets, confirming the tests catch loss of centring (matches worker's claimed range). Restored file; `git status` clean afterward.

Diff review: the grid-stretch approach (`.mb-step`/`.mb-ui-step` is `display:grid` with no explicit `align-items`, defaulting to `stretch`) makes the marker column match row height; `.mb-step-marker` now centres its dot via flex `align-items:center`; the rail's `::before` first/last overrides move from fixed-offset `top`/`height` to `50%`, correctly anchoring the rail to each end marker's own centre regardless of card height. Catalogue's "Szyna" sample now uses unequal-length copy, exercising unequal card heights as the Done-means point requires. DESIGN.md's `step-marker` entry text updated to match. No em-dashes introduced; no English copy; no Tailwind/CMS/islands; no `prerender=false` beyond the existing lead-store route (untouched here); no token/palette changes beyond wording. Scope stays inside the ticket's centring follow-up plus the already-present move-to-`mb/`+catalogue work.

PASS
