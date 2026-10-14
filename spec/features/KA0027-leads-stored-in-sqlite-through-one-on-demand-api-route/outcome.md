# KA0027 - Outcome

- Merged: 2026-10-14, `ca675a8`
- Branch: h/2026-10-14-ka0027-leads-sqlite-2f54061e
- Reviews: review-1.md PASS, review-2.md PASS
- Cost: worker $7.56, reviews $1.60; review rounds 2

## What went in

- `astro.config.mjs`, `package.json`: `@astrojs/node` (standalone); pages still build as static files, now into `dist/client/`; the only server code is `/api/lead` in `dist/server/`.
- `src/lib/lead.ts` (new): the form's rules (`projectTypes`, `checkLead`, e-mail pattern, length limit), shared by the browser and the server.
- `src/lib/send-email.ts` (new): `sendEmail({ apiKey, from, to, subject, text })` through Resend's HTTP API with `fetch`, 5 s limit; reads no env, knows nothing about leads.
- `src/lib/leads-db.ts` (new): `saveLead(path, lead)` writes with `node:sqlite`, creating the `leads` table on first use.
- `src/pages/api/lead.ts` (new): reads `process.env`, validates, saves, then sends an e-mail with only the lead number, project type and time; honeypot 200, invalid 400, save failure 500; a failed or missing e-mail is only logged.
- `src/scripts/contact-form.ts`, `src/data/site-config.ts`: the form posts JSON to `/api/lead`; states and Umami events unchanged; NocoDB gone.
- `Dockerfile`, `docker-start.sh`, `nginx.conf`: one image runs nginx (static pages, `/api/` proxied) and Node; `LEADS_DB_PATH=/data/leads.sqlite` on the `/data` volume; either process exiting ends the container.
- `README.md`: "Leady i powiadomienia" and "Dokploy krok po kroku". Tests: request-level 400/honeypot, real SQLite row, e-mail failure paths, each module.
- `findings.md`: F1, no rate limit (ticket KA0089); F2 dropped.

## Checks on main

- `bun install --frozen-lockfile`: passed.
- `npm run check`: passed.
- `npm test`: passed.
- CI macOS: off (no H_GITHUB_ACTIONS_TOKEN)

## Left open

- Tickets from findings: KA0089 (F1).
