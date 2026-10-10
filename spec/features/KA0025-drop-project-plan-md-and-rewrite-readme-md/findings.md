# KA0025 - Findings

What was discovered while doing this ticket but is not part of it: bugs, risks, gaps, and suggested changes. Workers add entries on their branch; the coordinator adds the non-blocking notes from reviews. One entry per finding, numbered, never deleted: only its Status changes.

A finding ends in one of three statuses: `fixed` (the branch fixed it; name the commit), `ticket K0000` (a planning ticket carries it), or `dropped (reason)`. `open` lives only until the merge: `h merge` turns every `Status: open` entry into a planning ticket and rewrites its status to `ticket K0000`.

`- Budget:` is optional: set it, in USD, only when the ticket this finding becomes is expected to cost more than the autopilot default, and leave the line out otherwise. `h merge` copies it into the ticket's JSON block as `budget`, which `h ticket status --autopilot` passes to `--budget`, capped at `H_AUTOPILOT_BUDGET_MAX`.

## F1. Lighthouse never re-run on the production domain

- Kind: risk
- Found by: 2026-10-10-drop-project-plan-new-re-c8398883 (worker), 2026-10-10
- Where: deleted `project-plan.md` (Faza 8 "Post-deploy Lighthouse re-run", section 9 "Definicja done": CLS < 0.05, LCP < 2s, INP < 200ms, test on a real iOS Safari / Android Chrome device, all unchecked); `spec/vision.md:11`
- What: the plan's last open checks were a Lighthouse mobile run against `https://kacperadler.pl` after the Dokploy deploy and a test on real phones. The only recorded 100/100/100/100 is from localhost. No ticket carries these checks, and `spec/vision.md` `## What stays true` asks for Performance at least 95 and 100 elsewhere.
- Suggestion: run Lighthouse mobile against the production URL and on a real iOS and Android device, record the scores and Web Vitals in the ticket, and open tickets for whatever misses the vision. Adding Lighthouse to CI stays out unless the human asks.
- Status: ticket KA0046

## F2. review.md still says package.json has no test script

- Kind: cleanup
- Found by: 2026-10-10-drop-project-plan-new-re-c8398883 (worker), 2026-10-10
- Where: `.agents/harness/criteria/review.md:39`
- What: "Not reasons to FAIL" lists "`npm test` failing because `package.json` has no `test` script (KA0001 findings, F1)", but `package.json` now has `"test": "playwright test"`.
- Suggestion: delete the line.
- Status: ticket KA0047

## F3. src/lib/dates.ts is imported nowhere

- Kind: cleanup
- Found by: 2026-10-10-drop-project-plan-new-re-c8398883 (worker), 2026-10-10
- Where: `src/lib/dates.ts`, `AGENTS.md` `## Struktura` (`lib/ # seo, dates`)
- What: nothing in `src/` or `tests/` imports `lib/dates` (grep for `lib/dates|\./dates` is empty); `totalYearsFloor` and the rest were for the "~N lat" experience title, which the section no longer renders. The experience section and `llms*.txt.ts` slice years from `startDate` inline.
- Suggestion: delete `src/lib/dates.ts` and its `AGENTS.md` mention, or make the three inline year computations use it; pick one.
- Status: ticket KA0047 (KA0048 folded into it)

## F4. KA0029 cites the deleted project-plan.md

- Kind: cleanup
- Found by: 2026-10-10-drop-project-plan-new-re-c8398883 (worker), 2026-10-10
- Where: `spec/features/KA0029-blog-in-mdx/ticket.md:16`
- What: the Description opens with "Faza 10 of `project-plan.md`", a file this ticket deletes. The Done means and Scope already carry the work, so nothing is lost; the reference just dangles (the file stays in git history).
- Suggestion: the coordinator rewrites the sentence to "Blog with MDX, list, post pages, RSS." when KA0029 is next touched.
- Status: fixed on main by the coordinator (KA0049 closed)
