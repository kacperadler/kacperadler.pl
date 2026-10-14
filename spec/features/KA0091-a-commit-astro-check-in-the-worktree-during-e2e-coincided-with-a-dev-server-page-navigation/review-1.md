# KA0091 - Review 1

- Job: 2026-10-14-review-ka0091-dev-reload-50ec974a
- Branch: h/2026-10-14-ka0091-dev-reload-during-86060043
- Commit reviewed: 0dc18148406f1982f6cc8abf62facebc8ce564a1
- Verdict: PASS

## Final message

## Findings

None blocking.

## Notes

- Worker's claim "repo has no structure test" matches reality: `## Done means` / `pass. The structure test holds.` is a boilerplate line baked into every ticket template (confirmed by grep across `spec/features/*/ticket.md`), not a reference to an actual test file.
- Fix is broader than the ticket's literal examples (ignore every path vs. "files `astro check` writes" / its own cache dir), but matches the ticket's actual Goal ("A commit made during an e2e run cannot make the dev server reload under a running test") and is justified in the final message by the worker's own investigation (content rewrites from `lint-staged`/edits trigger reloads, not just `astro check`'s cache/types writes). The ticket's parenthetical is explicitly "for example", not exhaustive.

## Checks run

- `bun install --frozen-lockfile`: 378 packages, clean.
- `bun run lint`: `Checked 118 files… No fixes applied.`
- `bun run check`: `0 errors, 0 warnings, 0 hints` (91 files).
- `bun run build`: completed clean, static build + server entry built.
- `CI=1 bun run test`: `167 passed (4.1m)`.
- Mutation test: replaced `astro.config.mjs`'s `server: process.env.E2E_DEV_NO_WATCH === "1" ? { watch: { ignored: () => true } } : {}` with `server: {}` (fix disabled), ran `CI=1 bunx playwright test dev-no-reload` → fails exactly as the worker predicted: `expect(locator).toHaveAttribute` received `null` (page reloaded, probe lost), 3 attempts. Restored `astro.config.mjs` from backup, confirmed `git status --short` clean.
- Re-ran `CI=1 bunx playwright test dev-no-reload ui-catalogue ui-proposals` with fix restored: `93 passed (3.2m)`.
- `git diff … | grep` for U+2014: none found.
- `git log` on `main`: confirms `fix(KA0091): …` / `fix(KA0089): …` / `fix(KA0078): …` ticket-id-scoped commit convention is established precedent, not a deviation.
- Ticket (`spec/features/KA0091.../ticket.md` via `git show main:`) read in full: Goal, Done means, Scope, Decisions all addressed; "Out: changing what `astro check` checks" respected (nothing in the diff touches `astro check`'s behavior).
- No `Dockerfile`/`nginx.conf`/`og-default.png.ts` touched → Docker build not required by guide.
- No tokens/brand/palette touched → no `DESIGN.md` update required.
- Diff scope: only `astro.config.mjs`, `playwright.config.ts`, new `tests/e2e/dev-no-reload.spec.ts`, and doc updates (`AGENTS.md`, `README.md`) — matches ticket scope, no drift.

PASS
