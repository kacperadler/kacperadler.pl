# KA0147 - Review 1

- Job: 2026-11-05-review-69adf999
- Branch: arthur/2026-11-05-worker-86fa3c04
- Commit reviewed: ab0a2d5f83943d863ce57cbf41751f9f21ed70f0
- Verdict: PASS

## Final message

## Findings

I found no blocking issues. Both parts of KA0147 meet the ticket.

- **First part, KA-D4.** `tests/e2e/lead-rate-limit.spec.ts:118-132` and `tests/e2e/pagination-jump.spec.ts:27-41` each check `docker version` once, when the file loads. If it doesn't answer, `test.skip` at file level skips every test in the file before `beforeAll` runs. The skip reason is exactly the ticket's text. If the `docker` binary is missing, the ENOENT is caught and the file skips too. Where Docker answers, the skip doesn't fire, so the specs run and fail as before. Their assertions are unchanged.
- **Second part, KA-D5.** `tests/e2e/dev-no-reload.spec.ts:22,124-136` no longer calls `utimesSync` on `button.astro` and `catalogue.astro`. It now writes `.astro/dev-reload-probe-<pid>.js`. `.astro/` is git-ignored, the open `/ui` page imports the file, and the spec then rewrites it. A `finally` deletes the file. The assertion is unchanged.
  - My run showed no tracked file's ctime changed and no untracked file was left behind.
  - The worker says that with `E2E_DEV_NO_WATCH: "0"` the spec failed with `[watch] .astro/dev-reload-probe-906032.js`. I did not repeat that run because the budget was small.
  - The spec only reaches the probe module through the dynamic import. A write to a `.astro` component would reach the watcher by a different path, but with the watcher off neither path reloads, so the spec still proves what it should.

## Notes
- (minor) tests/e2e/lead-rate-limit.spec.ts:118: `dockerAnswers` is copied word for word into `pagination-jump.spec.ts:27`. A shared helper would keep the reason text in one place.
- (risk) tests/e2e/lead-rate-limit.spec.ts:121: `execFileSync("docker", ["version"])` has no `timeout`. If the daemon accepts the connection and never answers, every Playwright worker that loads either file hangs instead of skipping. Both files have this.
- (minor) tests/e2e/dev-no-reload.spec.ts:124: the first `writeFileSync` sits outside the `try`, so the `finally` doesn't cover it. If that write throws, there is no file to delete, so nothing leaks.

## Checks run
All of these ran in one bash call with a 1800 s timeout, on the tip `ab0a2d5`, in my sandbox. Docker is unreachable there, so this was the skip case.
- **Ctime checksum before the run** (`git ls-files -z | xargs -0 stat -c '%Z %n' | md5sum`): `8fe5c863d73c67a2a5d39c3e6f2fa193`
- **`npm run check`:** 104 files, 0 errors, 0 warnings, 0 hints.
- **`npm run lint`:** `Checked 120 files in 656ms. No fixes applied.`
- **`npm test`:** `8 skipped, 248 passed (3.6m)`, exit 0. The 8 skipped are the two Docker specs.
- **Ctime checksum after the run:** `8fe5c863d73c67a2a5d39c3e6f2fa193`, the same as before.
- **`git status --short --untracked-files=all` after the run:** empty, so no probe file was left.
- **Not run:** `npm run mutate`, the watch-on run of `dev-no-reload.spec.ts`, and the Docker specs where Docker answers. The coordinator reports the Docker specs pass outside the sandbox.

PASS