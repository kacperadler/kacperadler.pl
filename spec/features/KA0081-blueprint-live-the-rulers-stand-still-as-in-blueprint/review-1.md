# KA0081 - Review 1

- Job: 2026-10-11-review-ka0081-static-rul-23ef88db
- Branch: h/2026-10-11-ka0081-static-rulers-5d56c4d5
- Commit reviewed: 2c521a6f50e53f9833e8b3704f300bc6202d7c06
- Verdict: PASS

## Final message

No touches to tokens, DESIGN.md, Dockerfile, nginx.conf, og-default.png.ts — docker build and DESIGN.md update not required.

## Review summary

**Scope check:** Diff touches exactly `src/pages/_ui/proposal/[id].astro`, `src/styles/proposals/blueprint-live/proposal.css`, `tests/e2e/ui-proposals.spec.ts`, and the ticket's own `ticket.md`/`findings.md`/`rulers-moving-2.jpg` — all inside the ticket's declared Scope.

**Done means, verified against the diff:**
- Rulers (`.mb-frame::before/::after`): `bl-sheet` and every `view-timeline`/`animation-timeline: view()` removed repo-wide (grep confirms zero matches); rulers only animate once via `bl-draw 1s` on `[data-bl-live]`, never gated by `data-bl-drawn`, so they never re-trigger on scroll. `mask-position` test (`tests/e2e/ui-proposals.spec.ts:787-816`) scrolls and asserts equality — passed.
- Stay-drawn-on-scroll-back: kept test now also checks whole-into-view-then-back-to-top (`ui-proposals.spec.ts:565-620`).
- Time-based draw on visibility: `[id].astro` adds an `IntersectionObserver` gated to `blueprint-live`, 1% threshold steps, 97%-of-whole-or-fills-viewport test, marks `data-bl-drawn` once, unobserves. CSS keys `--bl-p` off `[data-bl-drawn]` and plays `bl-draw var(--bl-pen) linear both` (`--bl-pen: 0.8s`, under the required 1s) — not scroll-linked.
- New cell Done-means test present (`ui-proposals.spec.ts:736-752`): raises a cell exactly into view, scrolls no further, polls `--bl-p` reaching `1` within 1500ms on an 800ms animation.
- Header comment rewritten; no residual mention of ticks traveling or undrawing on scroll-back.
- Reduced motion / no-script path: `@property --bl-p { initial-value: 1 }` plus all overrides scoped under `[data-bl-live]`/`prefers-reduced-motion: no-preference`, so without JS or under reduced motion everything renders at `--bl-p: 1`. Covered by `expectDrawnAtOnce` in three places (reduced-motion test, no-script test).

**Checks run myself in this worktree (not reused from worker's claim):**
- `bun install --frozen-lockfile` — ok.
- `bun run lint` → "Checked 102 files… No fixes applied."
- `bun run check` → 0 errors / 0 warnings / 0 hints.
- `bun run build` → completes (only the pre-existing, allowed `caseStudies` collection-empty warnings).
- `bun run test:e2e` → **99 passed** (2.6m), matches worker's claim.

**Mutation testing (reverted after each, `git status --short` clean before verdict):**
1. Changed the 97%-whole threshold to 0 (mark-drawn on any visibility) in `[id].astro` → section test and cell test both fail immediately (section stuck undrawn-check timing out; expected because now drawn too early). Confirms the threshold is load-bearing, not decorative.
2. Added `animation-timeline: view()` back onto the `[data-bl-drawn]` draw rule in `proposal.css` → "scrolled through… nothing scrolls on a clock" test fails on `onScroll` assertion for `.mb-section-head`. Confirms the scroll-timeline removal is actually enforced by a test, not just by absence of code.

Did not separately mutate the `[data-bl-live]` gate (worker's claim); the no-script test structurally cannot pass without the gate since `--bl-p` initial value is 1 only outside `[data-bl-live]` overrides — this is covered by existing control flow, low risk.

**Notes (non-blocking):**
- The disclosed "mark drawn on fast-scroll-past-without-ever-whole" rule (`box.bottom <= screen.top`) is an addition beyond the ticket's letter, but it does not contradict any Done-means line (a piece reaching its final state without ever having visibly animated is consistent with "never stops half-drawn, never undraws"), and it's needed for the scroll-through test to reliably mark every visible piece on a fast flick. Acceptable as implementation latitude; worth asking the human whether to keep, but not a FAIL condition.
- `findings.md` F1 (flaky case-study fixture build) stays `open`, pre-existing and unrelated to this diff; my own full build+e2e run showed no case-study related failures.

**Styleguide/AGENTS.md:** no em-dashes added (checked diff), no Tailwind/theming-toggle/light-value revival, no cookies/trackers, commits are Conventional with `(KA0081)` scope, Decisions line "no budget limit… after it hit $5" correctly appended to the ticket on this branch.

No blocking findings.

PASS
