# KA0130 - Review 1

- Job: 2026-10-28-review-ka0130-success-in-84902ed7
- Branch: h/2026-10-28-ka0130-success-in-view-18f4b55d
- Commit reviewed: be234ab992fe9623ce30a33bc38a3654aa985f30
- Verdict: PASS

## Final message

Worktree clean, no leftover mutations.

**Findings:** none that block the merge.

**Notes:**
- The ticket's Done-means literally pins `scrollIntoView({ block: "nearest" })`; the worker adds a `block: "center"` fallback for a card taller than the band under the header. This is a disclosed, in-scope deviation that better satisfies the Goal ("the visitor sees 'Wiadomość wysłana.' on screen"): with pure `nearest`, a card taller than the available band would align one edge and leave the heading behind the sticky header, missing the Goal. Verified empirically: forcing the fallback branch off (`if (false)`) breaks the three tall/edge tests (heading-above, heading-under-header, Enter-from-email), confirming the plain-`nearest` path alone cannot satisfy the Goal for those viewports. The deviation is the better engineering call, not scope creep: same file, same function, one extra branch, disclosed in the final message, and `AGENTS.md` updated to match.
- `if (!(card && heading)) return` is an untested null guard on markup that is always rendered; acceptable per review guide (don't-test-tautologies).

**Checks run (in this worktree, range `341949c..be234ab`):**
- `bun install --frozen-lockfile`: 378 packages installed.
- `bun run lint`: 116 files checked, no fixes.
- `bun run check`: 0 errors, 0 warnings, 0 hints.
- `bun run build`: completed clean.
- `bun run test:e2e` (full suite): 224 passed, 1 flaky (`dev-no-reload.spec.ts`, unrelated file, passed on retry, timing issue in dev-server navigation, not touched by this diff).
- Mutation 1: forced the "card fits band" branch to always take the `center`-fallback path → 3 of 4 targeted tests failed as predicted (`heading above`, `heading under header`, `Enter from e-mail at bottom`); only the already-tall-card test passed. Confirms the fits/`nearest`-vs-`center` branching is load-bearing and tested.
- Mutation 2: disabled the "heading already fully visible → return early" guard → the "sheet is back to empty height" test failed with `scrollY` moving from 6688 to 6731, i.e. the page moved when it should have stayed still. Confirms the no-scroll-when-visible requirement (explicit focus of this review) is enforced and tested.
- Both mutations reverted; `git status --short` clean before verdict.
- No em-dash (U+2014) added anywhere in the range (`git diff ... | grep '^\+' | grep U+2014` empty).
- Diff scope matches the ticket exactly: `src/scripts/contact-form.ts`, `src/components/mb/contact-form.astro`, `AGENTS.md` doc note, `tests/e2e/contact-form.spec.ts`, plus evidence screenshots/recordings under the ticket folder. No token/DESIGN.md-relevant changes, no Dockerfile/nginx/og-image touch requiring a Docker build check.

PASS
