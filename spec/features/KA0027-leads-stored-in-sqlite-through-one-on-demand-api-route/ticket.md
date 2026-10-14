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
- Plan: tak

## Done means

- `@astrojs/node` adapter; `src/pages/api/lead.ts` with `prerender = false` validates the form server-side (same fields and honeypot as today) and inserts into SQLite (`bun:sqlite` or `better-sqlite3`), the file on a Docker volume; every other page stays prerendered (`dist/` has their HTML).
- The form posts to it; its states (`idle | submitting | error-validation | error-submit | success`) and Umami events stay; NocoDB code and `nocodbFormUrl` are gone.
- Dockerfile and `nginx.conf` run the Node server for `/api/*` and serve the static pages; `docker build` and a run that posts a lead and reads it back from the volume are in the final message; e2e covers success, validation error and server error.
- Each new lead sends an e-mail to the human through Resend's HTTP API with `fetch` (no mail library); the key and the addresses come from env vars named in `README.md`, never committed; a failed or unconfigured send is logged and the lead stays saved and the visitor sees success; e2e or a unit test covers a send failure.
- Modular, at the human's request: sending e-mail is its own module (e.g. `src/lib/send-email.ts`) with one function that takes everything it needs as arguments (API key, from, to, subject, text) and reads no env and knows nothing about leads; saving a lead is its own module too (e.g. `src/lib/leads-db.ts`, path passed in). `src/pages/api/lead.ts` only reads env, validates, and calls the two. This overrides the plan's single-file route; each module gets its own test.
- A step-by-step Dokploy guide for the human in `README.md`: the volume (mount path, where the SQLite file lives), the env vars to set, the redeploy, and how to check a lead landed; the coordinator walks the human through it.
- `bun run lint`, `bun run check`, `bun run build` and `bun run test:e2e` pass (and the Biome format check that replaces `prettier --check`, once KA0024 is in).

## Scope

In:
- `astro.config.mjs`, `src/pages/api/`, the contact form script, `src/data/site-config.ts`, `Dockerfile`, `nginx.conf`, `package.json`, `tests/e2e/contact-form.spec.ts`, `AGENTS.md` and `README.md` lines about the form.

Out:
- Postgres or any other database service.
- A panel to read leads: KA0087.

## Decisions

- 2026-10-10: The human: focus on developing KA first; remove `.claude`, `.vscode`, `.zed`; with Biome, Prettier is not needed; look over the repo for what to clean and what to keep; drop `project-plan.md`, turn what is left into tickets, and improve `README.md`.
- 2026-10-10: The human: the Dokploy app may get a volume for the database; add a notification about a new lead.
- 2026-10-10: Waits for the notification channel (Telegram or e-mail) before it starts.
- 2026-10-10: The human: the notification goes by e-mail. The coordinator: Resend's HTTP API, pending the human's word on the provider.
- 2026-10-14: The human approved it, plan first; he wants help with Dokploy (the volume): the plan and README carry the exact Dokploy steps.
- 2026-10-14: The human: stay on SQLite (not Postgres); with the coordinator's proposal of a small password-protected panel (list, details, CSV export) so leads can be read and downloaded.
- 2026-10-14: The human: the panel is a separate ticket (KA0087), not part of KA0027.
- 2026-10-14: The human chose node:sqlite (the plan's Option 1) and the e-mail without visitor data (lead number and project type only; privacy policy unchanged).
- 2026-10-14: Plan approved by the human: plan.md at 3c350cf
- 2026-10-14: The human confirmed Resend as the e-mail provider (HTTP API with fetch).
- 2026-10-14: The human: build it modular: a standalone e-mail function that takes its inputs as parameters, reusable beyond leads; the route only wires modules together.
