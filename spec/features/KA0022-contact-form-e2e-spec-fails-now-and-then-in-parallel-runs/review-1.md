# KA0022 - Review 1

- Job: 2026-10-10-review-e2e-flakes-6f0b3c7c
- Branch: h/2026-10-10-e2e-flakes-d37bc784
- Commit reviewed: adb9ec3d3d8e2b8cca08611c35d1534355e14e9c
- Verdict: PASS

## Final message

No stray processes.

**Findings:** none that block the merge.

**Notes (non-blocking):**
- One of three `--repeat-each=30 --workers=4 CI=true` reruns produced 4 "flaky" results (`page.fill` 30s timeouts on unrelated later fields, across four different tests simultaneously, all recovered on retry). Reproduced with `uptime` load average ~6.8 on 7 cores at that moment, caused by other concurrent agent sessions on this shared workstation (visible in `ps aux`), not by the diff: the same command passed clean 300/300 immediately before and immediately after under lower load, and the failure signature (generic timeout on arbitrary `page.fill` calls unconnected to `pickType`/radio selection) does not match either fixed race. Treated as host contention, not a regression.
- `playwright.config.ts` and `.github/workflows/ci.yml` are outside the ticket's `Scope: In` list; the worker flagged this transparently and the change is required by the ticket's own Done-means wording ("fixed so it cannot happen" cannot be satisfied by a spec-only wait when the cause is a stale `dist/`). `Out` does not exclude these files. Accepted as in-scope-by-necessity.
- `.github/workflows/ci.yml`'s e2e job never shared `dist/` with the build job via artifacts (confirmed: no upload/download-artifact step existed before or after), so dropping e2e's own `Build` step loses nothing; `webServer` now builds it, and the e2e job's `Setup bun` step already puts `bun` on `PATH` there.
- `playwright.config.ts`'s `webServer.command` already required `bun` on `PATH` before this diff (`bun run preview`); the new `bun run build && bun run preview` adds no new external dependency. Confirmed: under `h merge`'s literal reproduction env (`PATH=/usr/bin:/bin:$HOME/.nvm/.../bin`, no `~/.bun/bin`) both the old and new command fail identically with `bun: not found`, so in practice `h merge`'s real `H_PATH_PREPEND` must already carry `~/.bun/bin` (ticket says as much: "only `H_PATH_PREPEND` would add it"); with it present, build+preview+test passed cleanly under `CI=true`.

**Checks run (in this worktree, `~/.bun/bin` prepended to `PATH` where bun was needed):**
- `bun install --frozen-lockfile`: 366 packages, clean.
- `bun run lint`: "Checked 68 files... No fixes applied."
- `bun run check`: 0 errors, 0 warnings, 0 hints.
- `bunx prettier --check "**/*.astro"`: clean.
- `bun run build`: completes, 4 pages built.
- `bun run test:e2e` (no `CI`, `dist/` removed first): webServer logged `astro build` then `astro preview`; 19 passed.
- `bunx playwright test tests/e2e/contact-form.spec.ts tests/e2e/mobile-sheet.spec.ts --repeat-each=30 --workers=4`, no `CI`: 300 passed.
- Same command with `CI=true FORCE_COLOR=1`: run 1 → 296 passed + 4 flaky (host contention, see Notes); run 2 (rerun) → 300 passed clean.
- Reproduced cause 1 directly: `env -i HOME=$HOME PATH=/usr/bin:/bin:$HOME/.nvm/versions/node/v24.21.0/bin FORCE_COLOR=1 npx playwright test tests/e2e/mobile-sheet.spec.ts` (bun absent from PATH, simulating the ticket's exact repro string) → `[WebServer] /bin/sh: 1: bun: not found`, confirming `bun` must already be reachable through whatever `h merge` actually uses, as discussed above; with `~/.bun/bin` added back, same command + `contact-form.spec.ts` under `CI=true FORCE_COLOR=1` → 10 passed in a single worker (CI retries available), no stale-`dist/` dialog failure.
- `git diff` scanned for em-dash (U+2014): none added.
- Commit messages: `fix(KA0022): ...` x2, matching this repo's existing convention for ticket-scoped fixes (`fix(KA0016): ...` precedent in `git log`).
- `git status`: clean, no stray tracked changes; no leftover `astro preview` process after runs.

PASS
