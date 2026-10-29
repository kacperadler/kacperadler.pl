# KA0131 - Review 1

- Job: 2026-10-29-review-ka0131-umami-in-t-a5b00f4e
- Branch: h/2026-10-29-ka0131-umami-in-tests-cf4e0bc9
- Commit reviewed: 6d937e9ba086ab53af53bd4f64f3d1604e446075
- Verdict: PASS

## Final message

Worktree clean, no stray build artifacts tracked by git.

---

**Findings:** none that block.

**Notes (non-blocking):**
- `spec/features/KA0131-…/findings.md:1-16` (F1): correctly flags that `www.kacperadler.pl` serves the full site (verified live: both `https://kacperadler.pl/` and `https://www.kacperadler.pl/` return `HTTP/2 200`, no redirect), which is why `data-domains` lists both hosts. This is infra, out of repo scope, correctly logged as an open finding rather than silently worked around.
- English code comments in `base-head.astro`/`playwright.config.ts` match the file's existing all-English comment style; `AGENTS.md` copy rule is about user-facing copy, not code comments.

**Checks run (this worktree):**
- `bun install --frozen-lockfile`: 378 packages installed, clean.
- `bun run lint`: "Checked 119 files... No fixes applied."
- `bun run check`: 103 files, 0 errors/0 warnings/0 hints.
- `bun run build`: completed clean.
- `bun run test:e2e` (full suite, foreground-polled via `proc://`, never left running unattended): **238 passed (4.9m)**, matches worker's reported 238/5.0m.
- Mutation check: removed `s.dataset.domains = domains;` from `base-head.astro`, rebuilt, ran `tests/e2e/analytics.spec.ts` alone → 1 failed / 1 passed, failure exactly on "the tracker counts pageviews only on the production hosts" (`Received: ""`). Restored file; `git status` clean afterward.
- Focus item "host-resolver rule cannot block anything but the analytics host": `playwright.config.ts` uses `--host-resolver-rules=MAP ${hostname-from-siteConfig.analytics.umamiUrl} ~NOTFOUND` — a single-hostname `MAP`, not a wildcard; `BASE_URL`/dev-server both still use `localhost`, and the full 238-test run (which hits `localhost` preview, `/api/lead`, the `/ui` dev server) passed, proving no collateral blocking.
- Focus item "production pageviews still work on `kacperadler.pl` and `www`": `data-domains` is set unconditionally before the script-load attempt (independent of DNS outcome in tests), value is `"kacperadler.pl,www.kacperadler.pl"` — matches Umami's documented `data-domains` filter and the two hosts confirmed live above.
- Em-dash scan on the diff: none found.
- Commit messages: `fix(KA0131): …`, `docs(KA0131): …` — consistent with prior history (`KA0111` series uses the same `(<ticket-id>)` scope convention).
- `AGENTS.md` updates (Analytics bullet, `tests/e2e/` listing) match the content already shown by the harness as current truth.
- No Dockerfile/nginx.conf/og-default.png.ts touched → no docker-build check required.
- Scope: diff stays inside the ticket's listed Scope (resolver rule + `data-domains` decision) plus doc/test updates and a findings entry; no unrelated files touched.

PASS
