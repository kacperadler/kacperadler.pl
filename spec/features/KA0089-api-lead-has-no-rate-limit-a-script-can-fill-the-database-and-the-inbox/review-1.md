# KA0089 - Review 1

- Job: 2026-10-14-review-ka0089-api-rate-l-a8578631
- Branch: h/2026-10-14-ka0089-api-rate-limit-259a6610
- Commit reviewed: 9929431d693f2958ac8f0aaf56d1adaa5950f6a9
- Verdict: PASS

## Final message

Clean worktree, matches reviewed commit.

Findings: none blocking.

Notes (non-blocking):
- `nginx.conf`'s literal config (`burst=5 nodelay`) lets the 7th post be refused, not the 6th as Done means states word-for-word; worker flagged this explicitly as an open decision for the human (task's Focus confirms: not a FAIL reason alone).
- F1 in `findings.md` correctly documents the pre-existing `ui-proposals.spec.ts:775` flake as out-of-scope, status `open` — proper use of the findings mechanism, not a scope violation.

Checks run (in this worktree, against `995513d..9929431`):
- `bun install --frozen-lockfile`: ok, 378 packages.
- `bun run lint`: 115 files, no errors.
- `bun run check`: 0 errors/warnings/hints.
- `bun run build`: completes clean.
- `docker build -t kacperadler-pl-test .`: succeeds (required since `nginx.conf` changed).
- `CI= bun run test:e2e` (full suite, all workers): 161/161 passed, including `lead-rate-limit.spec.ts` (3/3) and the previously-flaky `ui-proposals.spec.ts:775` (passed this run, consistent with the flake diagnosis in F1).
- No leftover Docker containers/networks from the new spec's `afterAll` (`docker ps`/`docker network ls` empty post-run).
- Mutation 1: removed `limit_req zone=lead burst=5 nodelay;` from `nginx.conf` → `lead-rate-limit.spec.ts` test 1 fails as expected (flood all 200s, no 429). Restored.
- Mutation 2: removed `set_real_ip_from 10.0.0.0/8;` → test 1 fails (second client gets 429 instead of 200, since all traffic now keys on nginx's single upstream peer address). Restored. `git diff --stat nginx.conf` empty after restore.
- No em-dash (U+2014) anywhere in the diff.
- Scope: only `nginx.conf`, new Docker e2e spec, `AGENTS.md`/`README.md` doc notes, and `findings.md` — matches ticket's Scope (nginx per-IP limit) exactly; no unrelated files touched.

PASS
