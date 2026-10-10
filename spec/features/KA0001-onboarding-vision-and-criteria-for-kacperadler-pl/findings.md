# KA0001 - Findings

What was discovered while doing this ticket but is not part of it: bugs, risks, gaps, and suggested changes. Workers add entries on their branch; the coordinator adds the non-blocking notes from reviews. One entry per finding, numbered, never deleted: only its Status changes.

A finding ends in one of three statuses: `fixed` (the branch fixed it; name the commit), `ticket K0000` (a planning ticket carries it), or `dropped (reason)`. `open` lives only until the merge: `h merge` turns every `Status: open` entry into a planning ticket and rewrites its status to `ticket K0000`.

`- Budget:` is optional: set it, in USD, only when the ticket this finding becomes is expected to cost more than the autopilot default, and leave the line out otherwise. `h merge` copies it into the ticket's JSON block as `budget`, which `h ticket status --autopilot` passes to `--budget`, capped at `H_AUTOPILOT_BUDGET_MAX`.

## F1. Harness gap: no `test` script, so `npm test` fails

- Kind: risk
- Found by: 2026-10-10-onboard-kacperadler-pl-6c85f5ea (worker), 2026-10-10
- Where: `package.json:9`
- What: `h merge` and `h review-needed` run only `npm run check` and `npm test`. `npm run check` works (`astro check`, 0 errors), but `package.json` has no `test` script: `npm test` exits 1 with `Missing script: "test"`. This repository is checked with `bun run lint`, `bun run check`, `bunx prettier --check "**/*.astro"`, `bun run build` and `bun run test:e2e`, as in `.github/workflows/ci.yml`. `bun run test:e2e` also needs `bun` on PATH, since `playwright.config.ts` starts the server with `bun run preview`, and a Chromium build matching `@playwright/test`.
- Suggestion: decide whether `package.json` gets a `test` script (for example one that runs the e2e suite) or the harness learns to run this repository's own commands. Onboarding changed neither.
- Status: ticket KA0004

## F2. The dropped email-templates offer is still on the site

- Kind: improvement
- Found by: 2026-10-10-onboard-kacperadler-pl-6c85f5ea (worker), 2026-10-10
- Where: `src/content/services/email-templates.json`
- What: Kacper dropped email templates from the offer (KA0001 answers, question 1), but the services collection still publishes "Szablony email" (order 6), so it renders in the services section.
- Suggestion: remove the entry and check the services grid layout still holds with five items; the new offer (AI agents, automation, Claude Code / Codex training) is its own ticket.
- Status: ticket KA0005

## F3. Em-dashes left in generated text and docs

- Kind: cleanup
- Found by: 2026-10-10-onboard-kacperadler-pl-6c85f5ea (worker), 2026-10-10
- Where: `src/pages/llms.txt.ts:42`, `src/pages/llms.txt.ts:46`, `src/pages/llms-full.txt.ts:61`, `src/pages/llms-full.txt.ts:107-109`, `DESIGN.md:173-174`, `DESIGN.md:183`, `DESIGN.md:190`, `DESIGN.md:192`
- What: Em-dashes are never to be added (KA0001 answers, question 8), and the sweeps in `edce860` and `a7636fb` removed them, but these lines still carry the em-dash (U+2014), two of them in the public `/llms.txt` and `/llms-full.txt`.
- Suggestion: replace each with ` - `; no other change.
- Status: ticket KA0006

## F4. The vision's audience is inferred

- Kind: improvement
- Found by: 2026-10-10-review-onboard-kacperadl-cd7a1d68 (review), 2026-10-10
- Where: `spec/vision.md`, Purpose
- What: "people who might hire him" is the onboarding's wording, not the human's.
- Suggestion: none.
- Status: dropped (the human accepted the vision and will extend it himself)

## F5. The SQLite lead store contradicted "no server runtime"

- Kind: risk
- Found by: 2026-10-10-review-onboard-kacperadl-cd7a1d68 (review), 2026-10-10
- Where: `spec/vision.md`
- What: the first draft stored leads in SQLite while excluding a server runtime.
- Suggestion: none.
- Status: fixed in f1d8b52
