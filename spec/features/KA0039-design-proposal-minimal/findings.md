# KA0039 - Findings

What was discovered while doing this ticket but is not part of it: bugs, risks, gaps, and suggested changes. Workers add entries on their branch; the coordinator adds the non-blocking notes from reviews. One entry per finding, numbered, never deleted: only its Status changes.

A finding ends in one of three statuses: `fixed` (the branch fixed it; name the commit), `ticket K0000` (a planning ticket carries it), or `dropped (reason)`. `open` lives only until the merge: `h merge` turns every `Status: open` entry into a planning ticket and rewrites its status to `ticket K0000`.

## F1. The axe check runs only on the baseline proposal

- Kind: risk
- Found by: 2026-10-10-proposal-minimal-a56f3f1a (worker), 2026-10-10
- Where: `tests/e2e/ui-proposals.spec.ts:165` ("has no detectable WCAG 2.1 AA violations")
- What: every proposal ticket asks for "axe zero on the proposal page", but the spec runs axe on `/ui/proposal/baseline` only. A proposal that drops contrast (minimal, brutalism, ...) passes `bun run test:e2e`; for KA0039 the check on `/ui/proposal/minimal` was a throwaway script (0 violations).
- Suggestion: run the same axe test once per folder in `src/styles/proposals/` (the spec already reads them into `proposals`). The frame pages stay as they are.
- Status: ticket KA0056

## F2. The proposal docs promise a specificity win that deeper component selectors do not give

- Kind: improvement
- Found by: 2026-10-10-proposal-minimal-a56f3f1a (worker), 2026-10-10
- Where: `src/styles/proposals/baseline/proposal.css:20` and the "Propozycje designu" paragraph in `AGENTS.md`
- What: the comment says `[data-proposal="<id>"] .class` matches the scoped component selector. Astro adds the scope attribute to every compound, so a rule like `.services-grid .service-panel:last-child:nth-child(odd)` is served as `.services-grid[data-astro-cid-sha2jjvw] .service-panel[data-astro-cid-sha2jjvw]:last-child:nth-child(odd)` (seen in the dev server's HTML) and outranks a `[data-proposal] .services-grid .service-panel...` override. The minimal proposal works around it with a `:root[data-proposal="minimal"]` prefix (ties two scoped compounds) and `input[type="radio"]` for the three-compound radio rule.
- Suggestion: document the `:root[data-proposal="<id>"]` prefix (and the per-compound attribute) in the baseline comment and `AGENTS.md`, so the next proposal does not rediscover it.
- Status: ticket KA0057

## F3. The button arrow shrinks to nothing in a narrow container

- Kind: bug
- Found by: 2026-10-10-proposal-minimal-a56f3f1a (worker), 2026-10-10
- Where: `src/components/ui/button.astro` (`.btn :global(.btn-icon)`)
- What: the icon is a flex item without `flex-shrink: 0`; when the button is wider than its container the svg gives up its 14px first. On `/ui/proposal/minimal` (14px Geist, 22px padding) the primary md samples in the catalogue's 160px columns showed no arrow until the proposal set `flex-shrink: 0`. Not checked on the baseline design.
- Suggestion: `flex-shrink: 0` on `.btn-icon` in `button.astro`, like `.btn-spinner` already has.
- Status: ticket KA0058
