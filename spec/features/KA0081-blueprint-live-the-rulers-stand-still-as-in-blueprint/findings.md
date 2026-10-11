# KA0081 - Findings

What was discovered while doing this ticket but is not part of it: bugs, risks, gaps, and suggested changes. Workers add entries on their branch; the coordinator adds the non-blocking notes from reviews. One entry per finding, numbered, never deleted: only its Status changes.

A finding ends in one of three statuses: `fixed` (the branch fixed it; name the commit), `ticket K0000` (a planning ticket carries it), or `dropped (reason)`. `open` lives only until the merge: `h merge` turns every `Status: open` entry into a planning ticket and rewrites its status to `ticket K0000`.

`- Budget:` is optional: set it, in USD, only when the ticket this finding becomes is expected to cost more than the autopilot default, and leave the line out otherwise. `h merge` copies it into the ticket's JSON block as `budget`, which `h ticket status --autopilot` passes to `--budget`, capped at `H_AUTOPILOT_BUDGET_MAX`.

## F1. The e2e build once ran without the case-study fixture

- Kind: risk
- Found by: 2026-10-11-ka0081-static-rulers-5d56c4d5 (worker), 2026-10-11
- Where: `src/content.config.ts:47-56`, `playwright.config.ts:83`
- What: the first `bun run test:e2e` in a fresh worktree (`bun install`, `bun run lint`, `bun run check`, `bun run build`, then the suite) failed 9 tests: both `a11y.spec.ts` "home, legal, case study pages and 404" (0 case-study links) and 7 in `case-studies.spec.ts` (no `/realizacje/` in the sitemap, no "Realizacje" in the mobile sheet). The `E2E_FIXTURES=1` build served a site without `tests/fixtures/case-studies/przyklad.mdx`. The same order of commands later passed twice (`case-studies.spec.ts` alone, 7 passed; the full suite, 0 case-study failures), so the cause was not pinned. [INFERENCE] Astro's content data store (`node_modules/.astro/data-store.json`, `.astro/data-store.json`) is keyed on the config, not on `E2E_FIXTURES`, so a build can reuse entries synced for another fixture set.
- Suggestion: reproduce by alternating `E2E_FIXTURES=none bun run build` and `E2E_FIXTURES=1 bun run build` and listing `dist/realizacje/`; if the store is reused, clear it (or pass `--force`) in the e2e build command in `playwright.config.ts`. The content schema stays as is.
- Status: ticket KA0082

## F2. A part skipped by a fast scroll is marked drawn

- Kind: improvement
- Found by: review-1, 2026-10-11
- Where: `src/pages/_ui/proposal/[id].astro`
- What: a part found above the screen without ever being whole on it is marked drawn, a rule beyond the ticket's letter.
- Suggestion: ask the human whether to keep it.
- Status: dropped (the human kept it, Decisions 2026-10-11)

## F3. The hero's on-load drawing shares the 1.8s pen

- Kind: improvement
- Found by: review-2, 2026-10-11
- Where: `src/styles/proposals/blueprint-live/proposal.css`
- What: one `--bl-pen: 1.8s` also drives the hero and rulers on load, which were 1s.
- Suggestion: split the durations if the human wants the hero faster.
- Status: dropped (the human kept 1.8s, Decisions 2026-10-11)

## F4. The meta.json description fix used a docs commit

- Kind: cleanup
- Found by: review-2, 2026-10-11
- Where: `src/styles/proposals/blueprint-live/meta.json`
- What: dev-only catalogue copy changed in a `docs(KA0081)` commit rather than a `copy(...)` one.
- Suggestion: none; the copy convention covers production text.
- Status: dropped (dev-only catalogue text, history not rewritten)
