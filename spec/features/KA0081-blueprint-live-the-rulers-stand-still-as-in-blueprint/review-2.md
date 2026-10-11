# KA0081 - Review 2

- Job: 2026-10-11-review-ka0081-static-rul-7a0d9028
- Branch: h/2026-10-11-ka0081-static-rulers-5d56c4d5
- Commit reviewed: d34d4056d960ae79cf6c5b6bf8a1174d9af48560
- Verdict: PASS

## Final message

Worktree clean, matches commit d34d4056.

**Findings:** none that block.

**Notes (non-blocking):**
- `src/styles/proposals/blueprint-live/proposal.css`: the single `--bl-pen: 1.8s` now also drives the hero/ruler on-load animation (previously a separate 1s), stretching small hero stages (e.g. the "A"/"B" callout mark to 0.18s). Worker flagged this explicitly and asked the human whether to split durations; not required by the ticket's Decisions (which speak of "a longer pen... per part" generically) and the architecture already shared one `--bl-pen` token across on-load and on-scroll pieces before this round, so this is a reasonable within-scope call, not a departure.
- `meta.json` description/reference-link fix landed in a `docs(KA0081)` commit rather than a `copy(...)` one; minor, and the text is dev-only catalogue copy, not production site copy, so the styleguide's copy-commit convention doesn't squarely apply.

**Checks run (in this worktree, range `2c521a6f..d34d4056`, earlier range already PASSed):**
- `git diff`/`git log` over both ranges: only `spec/features/KA0081.../ticket.md`, `src/styles/proposals/blueprint-live/{proposal.css,meta.json}`, `tests/e2e/ui-proposals.spec.ts` touched — matches ticket Scope.
- `bun install --frozen-lockfile`: ok.
- `bun run lint`: ultracite check, 102 files, no issues.
- `bun run check`: astro check, 0 errors/warnings/hints.
- `bun run build`: succeeds, static output as before.
- `bun run test:e2e`: 99 passed (2.7m), matches worker's claim.
- Em-dash scan on the diff: none found.
- Manually verified the smoothstep math the new tests assert (`p=0.06→s=0.1→eased 0.028`, `p=0.54→s=0.9→eased 0.972`, `p=0.3→s=0.5→eased 0.5`) against the formula in `proposal.css`: matches exactly.
- Mutation test: replaced `--bl-e: calc(var(--bl-s)*var(--bl-s)*(3-2*var(--bl-s)))` with `--bl-e: var(--bl-s)` (linear, no easing) and reran the affected spec (`-g "the drawing as you scroll"`): the new eased-stage assertions (`toBeCloseTo(0.028, 2)`) fail as expected (`Received: 0.1`), confirming the test catches a regression to linear. Reverted with `git checkout -- src/styles/proposals/blueprint-live/proposal.css`; worktree clean afterward.
- Confirmed `headDrawing()` reads real computed `clip-path`/`background-size` from the browser (not just the `--bl-p`/`--bl-s` variables), so the easing test exercises rendered behaviour, not wiring.
- Confirmed ticket Done-means edit ("in under a second" removed) and the new Decisions line match main's `cf8b7d3` ticket text verbatim, and the "no budget limit" line from the earlier round is preserved alongside it (worker's noted merge-conflict risk is informational, not a defect in this branch).

Ticket's Done-means items (fixed-time draw on visibility, no scroll-timeline, rulers static, reduced-motion/no-script fully drawn, eased per-stage smoothing, same `--bl-pen` regardless of scroll speed) are all implemented and covered by passing e2e assertions; no `AGENTS.md` Don't violated (no Tailwind, no theming machinery, no scroll listener, no em-dash, no new cookies/trackers); no `vision.md` "stays true"/"not the goal" line broken.

PASS
