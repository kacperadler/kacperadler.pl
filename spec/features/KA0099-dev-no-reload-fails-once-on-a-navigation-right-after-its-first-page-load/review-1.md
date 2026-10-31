# KA0099 - Review 1

- Job: 2026-10-31-review-ka0099-dev-no-rel-2c8dedc0
- Branch: h/2026-10-31-ka0099-dev-no-reload-fla-8f344986
- Commit reviewed: 6dc768fdb411c9dbcb72f6b73659dc84ba32ffc4
- Verdict: PASS

## Final message

Clean. Worktree restored, no leftover mutations.

## Review summary

**Scope check:** Diff touches only `AGENTS.md`, `playwright.config.ts`, `tests/e2e/dev-no-reload.spec.ts`, and a new `findings.md` entry — matches the ticket's scope exactly (fix the spec to wait for a settled page, log the dev server's reload reason; no-watch setting untouched).

**Focus — does the retry hide a real reload?** Verified directly, not just by reading:

- With `astro.config.mjs`'s `watch.ignored` mutated so the dev server actually watches files (simulating a no-watch regression), the main test (`a file written in the tree during the run does not reload a page`) still correctly logged the absorbed startup reload at `openSettled` (`open 1 of 3`), then failed at the real assertion with `the page reloaded; the dev server wrote meanwhile: [watch] .../button.astro... [watch] catalogue.astro`. This is the key proof for the focus: `openSettled`'s retry only runs before the probe is armed; the actual file-write assertion afterwards has no retry and fails loudly on a genuine reload. The retry cannot mask the behavior the ticket's own no-watch regression test exists to catch.
- Mutation `navigations === 1` → `navigations >= 1`: `reloads-right-after` test fails as the worker's table claims (`Expected: 2, Received: 1`), confirming the settle condition is exactly as tight as needed — it does not tolerate an extra real navigation beyond the one-time startup buffer.

**Other checks run, in this worktree (not main checkout):**
- `bun install --frozen-lockfile` — ok.
- `bun run lint` — `Checked 120 files... No fixes applied.`
- `bun run check` — `0 errors, 0 warnings, 0 hints`.
- `bun run build` — completes, static + server output as expected.
- Full `bunx playwright test --retries=0 --workers=1` — `256 passed (3.6m)`, matches worker's claim; one run of `dev-no-reload.spec.ts` logged `no reload message` on the main test's first attempt (reload detected via navigation count but not captured on the HMR frame listener) and still retried/settled correctly — shows the "no reload message" fallback path in the log formatting works, not just the common case.
- No em-dash in the diff (`grep -P '\x{2014}'` on the range diff: no match).
- Commits are Conventional Commits with `(KA0099)` scope: `fix(KA0099): ...`, `docs(KA0099): ...`.
- Branch touches none of Dockerfile/nginx.conf/og-default.png.ts/tokens.css, so no docker-build or `DESIGN.md` update is required.

**Notes (non-blocking):**
- F1 in `findings.md` (ui-catalogue specs can hit the same startup reload with parallel workers) is correctly filed as a new open finding rather than silently left as a gap — appropriate given the ticket's scope is this one spec file.
- `DEV_LOG`/stdout-to-file wiring in `playwright.config.ts` is new surface but narrow and exercised directly by the suite run above.

No finding rises to a FAIL reason: scope held, all CI-equivalent commands green in this worktree, the specific masking risk named in the review focus was checked by mutation and disproved.

PASS
