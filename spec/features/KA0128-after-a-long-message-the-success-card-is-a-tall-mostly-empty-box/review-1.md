# KA0128 - Review 1

- Job: 2026-10-28-review-ka0128-compact-su-13fab99d
- Branch: h/2026-10-28-ka0128-compact-success-c-a217f217
- Commit reviewed: 5187c0ebd1a885e1dd56d8b2a2bb2c8b6358139d
- Verdict: PASS

## Final message

Worktree clean, no leftover mutation edits.

---

**Findings:** none blocking.

**Notes (non-blocking):**
- `spec/features/.../findings.md` F1 (card can land above viewport on success when scrolled, focus drops to `<body>`) is correctly logged as `open`, not fixed in this branch — matches ticket's narrow Scope (sheet height + no page jump only). Will become a planning ticket at merge per the findings convention.
- Ticket's "structure test" Done-means line has no corresponding test file in this repo (worker confirmed via `ls test`); appears to be boilerplate, not a scope gap specific to this change.

**Checks run (in this worktree):**
- `bun install --frozen-lockfile`: ok.
- `bun run lint`: 0 errors/fixes.
- `bun run check`: 0 errors/warnings/hints.
- `bun run build`: succeeds.
- `bun run test:e2e` (full suite): 217 passed + 1 flaky (`dev-no-reload.spec.ts`, unrelated to this diff, passed on retry) = 218, matching worker's claim.
- `tests/e2e/contact-form.spec.ts` alone: 37 passed.
- Mutation `max-height: 0` → `max-height: none`: height check fails exactly as worker reported (1110 vs 464.15625).
- Mutation dropping `[data-state="success"]` from the new rule: fails (box capped at ~124px vs expected >198.38), confirming the rule only applies at the intended state — matches worker's described outcome, verified independently with a corrected selector edit (first sed attempt was malformed, caught and redone correctly before trusting the result).
- Both mutations reverted; `git status --porcelain` clean before verdict.
- CSS reasoning verified against spec: `min-height` always wins over a smaller `max-height` (CSS2.1 §10.7), so `max-height: 0` collapses the textarea to its `min-height` floor in both the `field-sizing: content` branch (`5lh`) and the fallback branch (`130px`) — the higher-specificity override (`.mb-contact-form[data-state="success"] .mb-form :global(textarea)`, 0-3-1) beats both `.mb-textarea` base rules (0-1-0), so it applies regardless of browser support, as claimed.
- Em-dash scan on added lines: none.
- Commit scope convention (`fix(KA0128)`, `docs(KA0128)`) matches repo history (`fix(KA0109)`, `docs(KA0112)`, etc.) — ticket-ID scope, not component scope, is this repo's norm.
- Diff stays inside ticket scope: `contact-form.astro` (fix), `contact-form.spec.ts` (test), `AGENTS.md` (doc line no longer true), ticket's own `screenshots/findings.md`. No `Dockerfile`/`nginx.conf`/`og-default.png.ts` touch, so no Docker build required.

PASS
