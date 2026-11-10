# KA0168 - CI runs on Arthur's branches, so a KA branch merges on its own after a PASS and green CI

```json
{
  "id": "KA0168",
  "title": "CI runs on Arthur's branches, so a KA branch merges on its own after a PASS and green CI",
  "date": "2026-11-10"
}
```

## Description

GitHub Actions runs CI only on pushes to `main` and on pull requests, never on the branches Arthur's workers push, so a KA branch that passed review cannot merge on its own: Arthur's automatic merge waits for green CI on the branch, and there is none. This ticket runs CI on those branches too, so a reviewed KA ticket merges by itself as the owner asked (AR-D620).

## Goal

On 2026-11-10 KA0167 passed review, and the automatic merge refused it: `--auto merges only with CI passed on the branch: github could not tell: project kacperadler.pl has no github.project({ workflow }), so github watches no run of it`. `.github/workflows/ci.yml:3-7` runs on `push` to `main` and `pull_request` to `main` only; `gh run list` shows runs on `main` only.

- Kind: ci

## Done means

- `.github/workflows/ci.yml` also runs on a push to a branch named `arthur/**`; the jobs and steps are unchanged, and the concurrency group stays per ref.
- The coordinator adds `github.project({ workflow: "ci.yml" })` to the project's file in Arthur (outside this repository) once this merges.
- Proof: after the merge, a push of an `arthur/` branch starts a CI run on that branch (`gh run list --branch <branch>`), and `arthur ci <branch> --project kacperadler.pl` reports it.

## Scope

In:
- `.github/workflows/ci.yml`: the push trigger.

Out:
- Any change to the CI jobs themselves.

## Decisions

