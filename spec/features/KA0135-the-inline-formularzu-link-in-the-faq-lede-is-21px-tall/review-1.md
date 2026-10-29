# KA0135 - Review 1

- Job: 2026-10-29-review-ka0135-faq-link-f4ebc7ef
- Branch: h/2026-10-29-ka0135-faq-link-eb498eb3
- Commit reviewed: d78e8e9b7a842be47759bbd5723e0761e0265d35
- Verdict: PASS

## Final message

Worktree clean, no stray changes.

**Findings:** none that block.

**Notes:**
- `tests/e2e/dev-no-reload.spec.ts` flaked once in the full suite then passed on retry (`251 passed (4.3m)` + `1 flaky`, total 252, matching the worker's reported count). That spec is untouched by this diff and unrelated to tap targets; pre-existing flake, not introduced here.
- The ticket's two allowed outcomes are "no hit area" or "horizontal-only hit area past 44px, never into neighbour lines." The worker chose "no hit area," which the ticket explicitly permits; rationale (WCAG 2.5.8 inline exemption, every inline/prose link already ≥79px wide, vertical area would steal taps from adjacent lines, horizontal area adds nothing since the tight dimension is height) is sound and matches the ticket's own wording almost verbatim.
- Diff is lean: `AGENTS.md`, `DESIGN.md`, `link.astro` (comment only, no CSS change), `tests/e2e/tap-targets.spec.ts`. No scope creep.
- Commits are two Conventional Commits with scope (`test(KA0135)`, `docs(KA0135)`), no copy commit needed since this is docs/test only.
- Before/after screenshots (`/tmp/ka0135/*-faq-390@1x.png`, both 390×844): byte-identical via `cmp`, consistent with "CSS is unchanged."

**Checks run (in this worktree, against `62fabec1..d78e8e9b`):**
- `bun install --frozen-lockfile`: 378 packages.
- `bun run lint`: 120 files, no fixes — matches claim.
- `bun run check`: 104 files, 0 errors/warnings/hints — matches claim.
- `bun run build`: succeeds, static client + Node server built.
- `bun run test:e2e` (full suite, once): 251 passed + 1 flaky (`dev-no-reload.spec.ts`, retried to pass) = 252, matching the worker's reported "252 passed."
- Mutation (own, not just worker's): added a 44px `::after` hit area to `.mb-link-inline` and `.mb-prose :global(a)` (the exact shape the ticket would have required had the decision gone the other way), ran `npx playwright test tests/e2e/tap-targets.spec.ts` — all 3 new KA0135 tests failed ("a tap on the line above ... opens it" on `/`, `/regulamin/`, `/polityka-prywatnosci/"), confirming the test pins the "no hit area" decision and would catch a regression toward the rejected alternative. Reverted with `git checkout -- src/components/mb/link.astro src/components/mb/prose.astro`; worktree confirmed clean after.
- `cmp` on the two screenshots: `IDENTICAL`.
- Em-dash scan on the diff: none added.
- Cross-checked `.github/workflows/ci.yml`: lint/check/build/test:e2e commands match exactly what I ran.

PASS
