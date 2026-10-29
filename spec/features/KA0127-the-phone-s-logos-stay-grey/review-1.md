# KA0127 - Review 1

- Job: 2026-10-29-review-ka0127-logos-dd759bd4
- Branch: h/2026-10-29-ka0127-logos-4b88a47a
- Commit reviewed: fba9994d16a9f1de4d314e40abb5b98f3195520c
- Verdict: FAIL

## Final message

## Findings

**`src/components/mb/sections/about.astro` — scope violation.** The ticket's approved decision (Done means / Scope `In:`) reads: *"Cost: 2 small rules. Approved decision: the grey-until-hover logos are part of the KA0075 trust bar and cases (...); the human picks."* It names exactly two components (trust bar, cases) and bounds the cost at two rules. The branch adds a third rule in `about.astro` (`.mb-exp-logo`), touching the experience-list accordion that the decision does not name. The worker's final message concedes this is "beyond the ticket's wording" and justifies it post-hoc by the Goal's general phrasing ("the client logos show in colour") — but that is not consultation, it's a unilateral scope extension explained after the fact. `AGENTS.md` `## Don't` states "Nie wychodź poza Scope ticketu bez konsultacji" (don't go outside the ticket's Scope without consultation), and the review guide's "PASS when all hold" requires the branch to stay inside its ticket's scope. The change itself is correct and consistent with the project's existing hover convention, and causes no regression, but it is scope creep the ticket's Decision explicitly did not authorize, done without asking first.

The other named deviation — grey-at-rest moved into the existing `@media (hover: hover) and (pointer: fine)` block instead of a separate `(hover: none)` rule — is a reasonable, well-justified technical choice (wider coverage, matches the project's "every `:hover` rule sits under this query" convention already enforced by `hoverFaults` in `touch-hover.spec.ts`), explained in the final message, and verified by mutation testing below. Not a finding.

## Mutation testing

- Reverted the `trust.astro` grey rule (worker's claim): not independently re-verified, but worker's reported failure is consistent with the mechanism.
- Removed the new `.mb-exp-logo` grey-at-rest block from `about.astro` (lines 253-256) and ran `tests/e2e/touch-hover.spec.ts`: `mouse › the client logos are grey at rest` failed as expected (`.mb-exp-logo` painted `none 1` instead of `grayscale(1) 0.6`). Restored the file (`git checkout -- src/components/mb/sections/about.astro`); worktree clean afterward.
- Confirms the new test does catch the regression it's meant to catch — but this only underscores that `about.astro` is in fact part of the diff beyond the two files the ticket approved.

## Notes

- Screenshots: all six present (`trust`/`cases`/`about` × before/after, 390px). Visually inspected `trust-390-before/after.png`: before shows all logos uniformly grey; after shows PwC orange accent and Energia Direct green at rest, consistent with the claim. Matches the instruction's "same viewport, same scroll, same size."
- `AGENTS.md` and `DESIGN.md` both updated with one sentence describing the new rule, consistent with styleguide requirement for token/behavior docs.
- No em-dashes, no English user-facing copy, no theming machinery touched.

## Checks run

- `bun install --frozen-lockfile`: installed, no errors.
- `bun run lint`: "Checked 120 files in 1005ms. No fixes applied." — pass.
- `bun run check`: "0 errors, 0 warnings, 0 hints" — pass.
- `bun run build`: completed, static + server build succeeded.
- `bun run test:e2e` (full suite, backgrounded ~248s): 248 passed, 1 flaky (`dev-no-reload.spec.ts`, unrelated to this branch's files, passed on retry) → effectively 249/249, matches worker's claim.
- Mutation test on `about.astro` grey rule: confirmed test fails when the rule is removed; restored file after.

The branch's functional fix, tests, and docs are solid and all CI-equivalent commands pass, but it extends into `about.astro`, a component the ticket's approved Decision explicitly excluded (scoped to "trust bar and cases," cost "2 small rules"), without prior consultation — a direct violation of `AGENTS.md`'s "Nie wychodź poza Scope ticketu bez konsultacji."

FAIL
