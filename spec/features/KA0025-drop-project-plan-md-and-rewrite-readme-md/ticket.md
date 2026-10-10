# KA0025 - Drop project-plan.md and rewrite README.md

```json
{
  "id": "KA0025",
  "title": "Drop project-plan.md and rewrite README.md",
  "date": "2026-10-10",
  "after": [
    "KA0024"
  ]
}
```

## Description

`project-plan.md` (379 lines) is the migration plan from the prototype: phases 0-8 done, 9 dropped, 10 (blog) open. Its architecture decisions and structure partly repeat `AGENTS.md`; open work now lives in tickets KA0026-KA0029 and `spec/vision.md`. `README.md` (107 lines) still reads as a migration project.

## Goal

A reader of the repository finds what the site is, how to run, check and deploy it, and where the rules are, with no plan that has run its course.

- Kind: cleanup

## Done means

- Every decision in `project-plan.md` still true in the code and missing from `AGENTS.md`, `DESIGN.md` and `README.md` is moved to one of them (named in the final message); then `project-plan.md` is deleted and nothing links to it.
- `README.md`: what the site is and who it is for (from `spec/vision.md`), stack, requirements (`bun`), commands (dev, build, preview, lint, format, check, test), how checks run (pre-commit, CI), deployment on Dokploy (Dockerfile + nginx), and links to `AGENTS.md`, `DESIGN.md` and `spec/vision.md`; Polish, no em-dash; no migration history.
- `bun run lint`, `bun run check`, `bun run build` and `bun run test:e2e` pass (and the Biome format check that replaces `prettier --check`, once KA0024 is in).

## Scope

In:
- `project-plan.md` (removed), `README.md`, `AGENTS.md` and `DESIGN.md` only for moved decisions.

Out:
- Tooling changes (KA0024).

## Decisions

- 2026-10-10: The human: focus on developing KA first; remove `.claude`, `.vscode`, `.zed`; with Biome, Prettier is not needed; look over the repo for what to clean and what to keep; drop `project-plan.md`, turn what is left into tickets, and improve `README.md`.
- 2026-10-10: Runs after KA0024, which changes the tools README describes.
