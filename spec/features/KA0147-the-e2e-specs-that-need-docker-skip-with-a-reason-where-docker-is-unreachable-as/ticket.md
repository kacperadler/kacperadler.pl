# KA0147 - The e2e specs that need Docker skip with a reason where Docker is unreachable, as in an Arthur job

```json
{
  "id": "KA0147",
  "title": "The e2e specs that need Docker skip with a reason where Docker is unreachable, as in an Arthur job",
  "date": "2026-11-05"
}
```

## Description

Found by the KA0145 worker (2026-11-05-worker-9c8d687a): `npm test` in an Arthur job fails 2 specs, `tests/e2e/lead-rate-limit.spec.ts:207` and `tests/e2e/pagination-jump.spec.ts:83`, both at `permission denied while trying to connect to the docker API at unix:///var/run/docker.sock`. A job's sandbox makes no Unix stream socket, so no job can reach Docker, and every KA job's `npm test` fails: Arthur then starts no review of any KA branch. Outside the sandbox the same specs pass on the KA0145 tip 3622e40 (the coordinator ran `npx playwright test tests/e2e/lead-rate-limit.spec.ts tests/e2e/pagination-jump.spec.ts`: 8 passed).

## Goal

Each spec that runs `docker` checks once, before its `beforeAll`, whether `docker version` answers, and when it does not, skips its tests with the reason `Docker is unreachable here (an Arthur job's sandbox, or no Docker): this spec runs in CI and where Docker runs`. Where Docker answers (CI's e2e job, the owner's shell), nothing changes: the specs run and fail as before.

Second part (KA-D5, found by the coordinator on the first worker's tip 33e1108): Arthur counts a check run `clean` only when no tracked file's inode, size or times changed during it (Arthur's checks extension compares each tracked file's ctime before and after the call). `tests/e2e/dev-no-reload.spec.ts` calls `utimesSync` on two tracked files, `src/components/mb/button.astro` and `src/pages/_ui/catalogue.astro` (its `RENDERED_FROM`), to prove the dev server does not watch them; a touch changes their ctime, so every `npm test` in a job is recorded `dirty` and Arthur starts no review of any KA branch. After the change, the spec proves the same thing without touching a tracked file: for example, it writes a git-ignored file that the catalogue page is rendered from, or copies the two files to an ignored folder the dev server serves; the worker picks the simplest that still fails when the dev server watches.

- Kind: test

Evidence: `tests/e2e/lead-rate-limit.spec.ts:55` and `tests/e2e/pagination-jump.spec.ts:24` call `execFileSync("docker", ...)` with no check that Docker answers.

## Done means

- In a shell where `docker version` fails (for example `DOCKER_HOST=unix:///nonexistent`), `npx playwright test tests/e2e/lead-rate-limit.spec.ts tests/e2e/pagination-jump.spec.ts` reports those tests skipped with the reason, none failed; before the change the same command fails them.
- Where Docker answers, the same command runs them (the worker names which case its own shell is; in a job it is the skip case).
- A run of `npm test` changes no tracked file's ctime: `git ls-files -z | xargs -0 stat -c '%Z %n'` prints the same before and after it, and the job's checks line for `test` ends `clean`.
- `dev-no-reload.spec.ts` still fails when the dev server watches (the worker shows it by running it once with the watch turned on, as the spec's own comment describes).
- `npm run check`, `npm run lint` and `npm test` pass in the job.

## Scope

In:
- `tests/e2e/lead-rate-limit.spec.ts`: the skip.
- `tests/e2e/pagination-jump.spec.ts`: the skip.
- `tests/e2e/dev-no-reload.spec.ts` (and `.gitignore` or `playwright.config.ts` if the probe file needs them): no write to a tracked file.

Out:
- The CI workflow: unchanged, its runners have Docker.
- The specs' assertions: unchanged.

## Decisions
- 2026-11-05: KA0147 joins the queue before KA0145, by the recommendation under KA-D3; the owner: "add this new tasks to queue (KA-D3: any question by its recommendation)" (KA-D4)
- 2026-11-05: KA0147 also makes dev-no-reload.spec touch no tracked file, by the recommendation under KA-D3; the owner: "add this new tasks to queue (KA-D3: any question by its recommendation)" (KA-D5)
