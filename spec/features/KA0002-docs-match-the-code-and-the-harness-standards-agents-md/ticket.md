# KA0002 - Docs match the code and the harness standards (AGENTS.md)

```json
{
  "id": "KA0002",
  "title": "Docs match the code and the harness standards (AGENTS.md)",
  "date": "2026-10-10",
  "after": [
    "KA0001"
  ]
}
```

## Description

The repository's docs describe a state the code left behind: `CLAUDE.md` still has the `/v2` redesign track, `v2-layout` and `data-theme` theming (commit `6e1b55e` moved v2 to `/` and removed theming), and `README.md`, `project-plan.md` and `wrangler.toml` say Cloudflare Pages while production runs on Dokploy (`Dockerfile`, `nginx.conf`).

## Goal

Agents and the human read docs that say what the code does, under our standards: the agent conventions live in `AGENTS.md`, not `CLAUDE.md`. Waits for KA0001 (the vision and criteria it drafts are the source for what stays true).

- Kind: cleanup

## Done means

- `CLAUDE.md` becomes `AGENTS.md` (git mv, so history stays), its content describing the site as it is now: v2 at `/`, dark-only, no theming; no file still points at `CLAUDE.md`.
- `README.md` and `project-plan.md` say production runs on Dokploy (Dockerfile + nginx); Cloudflare Pages is not mentioned as a host; `wrangler.toml` and any other Cloudflare-only config are removed. `project-plan.md` marks the phases as history; the ticket is the unit of scope.
- No em-dash added anywhere.
- `bun run lint`, `bun run check`, `bunx prettier --check "**/*.astro"`, `bun run build` and `bun run test:e2e` pass.

## Scope

In:
- `CLAUDE.md` → `AGENTS.md`, `README.md`, `project-plan.md`, `wrangler.toml` (removed), other agent config that names `CLAUDE.md` (`.claude/`).

Out:
- Any site code.

## Decisions

- 2026-10-10: The human (onboarding answers 5, 6): update the docs to the code, Dokploy is production for now (Cloudflare Pages considered later), and follow our standards, e.g. CLAUDE.md → AGENTS.md.
- 2026-10-10: The human: the whole project is built on Dokploy, Cloudflare Pages is no longer considered.
- 2026-10-10: The human: no CLAUDE.md; AGENTS.md only (Claude Code reads it, and the agents run through omp, which reads AGENTS.md). Merge approved.
