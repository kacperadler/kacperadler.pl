# KA0002 - Outcome

- Merged: 2026-10-10, `237e8a7`
- Branch: h/2026-10-10-docs-and-agents-md-508a76bc
- Reviews: review-1.md PASS
- Cost: worker $3.20, reviews $0.70; review rounds 1

## What went in

- `AGENTS.md` (was `CLAUDE.md`, history kept): the agents' conventions for the site as it is: v2 at `/`, dark-only, no theming, Dokploy, ticket scope, no em-dashes.
- `README.md`, `project-plan.md`: Dokploy is the host, the phases are history, CI lists the e2e job.
- `wrangler.toml` removed; `.claude/` allowlist without Cloudflare entries; criteria and `.dockerignore` point at `AGENTS.md`.
- `biome.jsonc`: ignores the harness-written `spec/build.json`.

## Checks on main

- `npm run check`: passed.
- CI macOS: off (no H_GITHUB_ACTIONS_TOKEN)

## Left open

- Tickets from findings: KA0008 (F1), KA0009 (F2), KA0010 (F3), KA0012 (F5); F4 (KA0011) and F6 dropped.
