# KA0027 - Leads stored in SQLite through one on-demand API route

```json
{
  "id": "KA0027",
  "title": "Leads stored in SQLite through one on-demand API route",
  "date": "2026-10-10"
}
```

## Description

The contact form posts to a self-hosted NocoDB shared form (`siteConfig.nocodbFormUrl`). The vision replaces it: leads in SQLite on the Dokploy server through one Astro API route rendered on demand (`prerender = false`) with the Node adapter; the rest stays static.

## Goal

Every contact form, the site's measure of success, lands in a store the site owns, without NocoDB.

- Kind: improvement

## Done means

- `@astrojs/node` adapter; `src/pages/api/lead.ts` with `prerender = false` validates the form server-side (same fields and honeypot as today) and inserts into SQLite (`bun:sqlite` or `better-sqlite3`), the file on a Docker volume; every other page stays prerendered (`dist/` has their HTML).
- The form posts to it; its states (`idle | submitting | error-validation | error-submit | success`) and Umami events stay; NocoDB code and `nocodbFormUrl` are gone.
- Dockerfile and `nginx.conf` run the Node server for `/api/*` and serve the static pages; `docker build` and a run that posts a lead and reads it back from the volume are in the final message; e2e covers success, validation error and server error.
- `bun run lint`, `bun run check`, `bun run build` and `bun run test:e2e` pass (and the Biome format check that replaces `prettier --check`, once KA0024 is in).

## Scope

In:
- `astro.config.mjs`, `src/pages/api/`, the contact form script, `src/data/site-config.ts`, `Dockerfile`, `nginx.conf`, `package.json`, `tests/e2e/contact-form.spec.ts`, `AGENTS.md` and `README.md` lines about the form.

Out:
- A panel to read leads, notifications by mail.

## Decisions

- 2026-10-10: The human: focus on developing KA first; remove `.claude`, `.vscode`, `.zed`; with Biome, Prettier is not needed; look over the repo for what to clean and what to keep; drop `project-plan.md`, turn what is left into tickets, and improve `README.md`.
- 2026-10-10: Needs from the human before it starts: how he reads the leads (sqlite on the server is enough, or a notification), and whether the Dokploy app may get a volume.
