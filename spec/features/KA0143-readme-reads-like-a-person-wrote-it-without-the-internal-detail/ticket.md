# KA0143 - README reads like a person wrote it, without the internal detail

```json
{
  "id": "KA0143",
  "title": "README reads like a person wrote it, without the internal detail",
  "date": "2026-10-31"
}
```

## Description

`README.md` grew ticket by ticket into 147 lines of implementation detail: the lead API's field rules and migration notes, how the e2e builds use fixtures, nginx rate-limit internals, a full Dokploy click-through. The human finds it cluttered and machine-written. It becomes a short README a developer opening the repo reads in a minute, written in plain human Polish.

## Goal

A README that says what the site is, how to run it, how to check it, and how it is deployed, and points to `AGENTS.md`, `DESIGN.md` and `spec/vision.md` for the rest. Detail that only an agent or a maintainer debugging the form needs lives where it already lives (`AGENTS.md`) or in one ops page, not in the README.

- Kind: cleanup

## Done means

- `README.md` is at most about 70 lines, in Polish, written in full plain sentences a person would write: no chains of parenthesised file paths, no ticket ids, no history ("wiersze zapisane wcześniej", "tabela sprzed tego pola"), no em-dashes (U+2014).
- It keeps: one paragraph on what the site is and for whom; the stack as a short list (one line per item, no sub-clauses); requirements; the commands table; what pre-commit and CI run, in two or three lines; the four environment variables and that a lead is saved even without e-mail; how to run the form and the Docker image locally; deploy on Dokploy in a few lines.
- Nothing is lost: every fact cut from the README that is not already in `AGENTS.md` goes there (lead API behaviour, rate limit and `X-Forwarded-For` trust, e2e fixtures and `E2E_DEV_NO_WATCH`), or into the ops page below. The worker lists in its final message each cut paragraph and where it now lives.
- The Dokploy step-by-step (Resend domain, volume, environment, checking a lead, the subnet check) moves to `docs/deploy.md`, kept complete and tidied the same way; the README links to it. `Dockerfile`'s comment that points to "README.md" for the Environment tab points to `docs/deploy.md`.
- No link in README, `AGENTS.md` or `docs/deploy.md` points at a file or heading that does not exist (checked by the worker with a grep of each link target).
- `bun run lint`, `bun run check` and `bun run build` pass.

## Scope

In:
- `README.md`: rewritten.
- `docs/deploy.md`: new, the Dokploy runbook.
- `AGENTS.md`: only additions of facts cut from the README and missing there.
- `Dockerfile`: the one comment.

Out:
- Site code, `DESIGN.md`, `CHANGELOG.md`.

## Decisions

- 2026-10-31: The human: the README looks bad, full of unnecessary stuff; optimise it and rewrite it as a person would write it.
