# KA0003 - Review 1

- Job: 2026-10-10-review-deps-and-astro-7-96cfb551
- Branch: h/2026-10-10-deps-and-astro-7-3f9b93b9
- Commit reviewed: 55f5d8e0fe6f4ec47fd8e2425ed4b0d87ae4badc
- Verdict: PASS

## Final message

Worktree clean, no leftover throwaway edits.

---

**Findings:** none blocking.

**Notes (non-blocking):**
- `typescript` stays at 6.0.3 against the ticket's literal "every package on its latest release (`bun outdated` lists nothing)." Reproduced the reason: bumping to `typescript@7.0.2` makes `astro check` hard-fail (`astro check does not currently support TypeScript 7.0`), which would break a mandatory PASS command. Keeping 6.0.3 is the only way to satisfy both Done-means lines at once; worker flagged it explicitly and asked for human confirmation rather than silently picking a side. Acceptable trade-off, correctly surfaced.
- `mobile-sheet.astro` lost `aria-label="Menu mobilne"` on the root `div` (forced by Biome 2.5's new ARIA-on-unsupported-role rule: a plain `div`/role=generic can't carry `aria-label` per the ARIA spec, so the attribute was already non-conforming pre-upgrade). The sheet's accessible name is gone; nothing in scope restores it (e.g. `role="dialog"`). In-scope minimal fix for a deps-only ticket, not a regression the e2e/axe specs would catch either way since the sheet is `aria-hidden` when axe runs on home. Pre-existing a11y gap, not introduced by this branch's intent — just no longer masked.
- README.md's updated Astro-version line still says "hostowanego na Cloudflare Pages," which per the styleguide is stale (actual host is Dokploy). Line was touched for the version bump only; pre-existing staleness, not something this ticket's scope asks to fix (KA0002 territory).

**Checks run (this worktree, `~/.bun/bin` on PATH):**
- `bun install --frozen-lockfile`: installs cleanly, versions match `package.json`.
- `bun run lint`: exit 0, "Checked 68 files … No fixes applied."
- `bun run check`: 0 errors/warnings/hints.
- `bunx prettier --check "**/*.astro"`: all files match style.
- `bun run build`: 4 pages, "Complete!"
- `bun run test:e2e`: 16 passed (chromium installed via `bunx playwright install chromium`; `--with-deps` failed needing sudo, plain install sufficed since browser binaries were already cached).
- `docker build -t kacperadler-pl-test .`: succeeds; ran container, `/` → 200, `/nope` → 404, security headers present, `nginx -v` → 1.30.5 (matches Dockerfile bump). Image/container removed after.
- Mutation check: temporarily `bun add -D typescript@7.0.2`, re-ran `bun run check` → confirmed hard failure ("install TypeScript 6 instead"), then `git checkout -- package.json bun.lock` + reinstall to restore; `bun outdated` back to showing only the known `typescript` gap; `git status` clean.
- Reviewed every file in the 36-file diff: all source/test/config changes outside the five version-bump files (`package.json`, `bun.lock`, `astro.config.mjs`, `.prettierrc`, `playwright.config.ts`, `Dockerfile`, `.github/workflows/ci.yml`, docs) are pure Biome/Prettier attribute- and key-sorting with zero logic change, confirmed by reading each hunk.
- Spot-checked `before`/`after` home-desktop-01 screenshots from the job's screenshot directory: visually identical, matching the worker's pixel-diff claims.
- No em-dash in any added line (`git diff … | grep -P '\x{2014}'` on added lines: empty).
- No Tailwind, no light theme, no new third-party script, no `prerender = false`, no Cloudflare/D1 touched in the diff.

PASS
