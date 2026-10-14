# KA0027 - Findings

What was discovered while doing this ticket but is not part of it: bugs, risks, gaps, and suggested changes. Workers add entries on their branch; the coordinator adds the non-blocking notes from reviews. One entry per finding, numbered, never deleted: only its Status changes.

A finding ends in one of three statuses: `fixed` (the branch fixed it; name the commit), `ticket K0000` (a planning ticket carries it), or `dropped (reason)`. `open` lives only until the merge: `h merge` turns every `Status: open` entry into a planning ticket and rewrites its status to `ticket K0000`.

`- Budget:` is optional: set it, in USD, only when the ticket this finding becomes is expected to cost more than the autopilot default, and leave the line out otherwise. `h merge` copies it into the ticket's JSON block as `budget`, which `h ticket status --autopilot` passes to `--budget`, capped at `H_AUTOPILOT_BUDGET_MAX`.

## F1. /api/lead has no rate limit: a script can fill the database and the inbox

- Kind: risk
- Found by: 2026-10-14-ka0027-leads-sqlite-2f54061e (worker), 2026-10-14
- Where: `src/pages/api/lead.ts`, `nginx.conf` (`location /api/`)
- What: the only spam guard is the honeypot field, which a script that posts JSON straight to `/api/lead` leaves empty. Every valid post saves a row in `/data/leads.sqlite` and sends one Resend e-mail, so a loop of `curl -X POST https://kacperadler.pl/api/lead -H 'content-type: application/json' -d '{"email":"a@b.cd","type":"ai","message":"x","website":""}'` grows the file without bound and uses up the Resend quota. NocoDB's shared form had the same exposure; the route now owns it.
- Suggestion: a per-IP limit in nginx for `location /api/` (`limit_req_zone $binary_remote_addr zone=lead:1m rate=5r/m;` plus `limit_req zone=lead burst=5 nodelay;`, answering 429, which the form already shows as `error-submit`), with the real client IP taken from Traefik's `X-Forwarded-For` (`set_real_ip_from` the Dokploy network). Out: captchas or anything that loads a third-party script.
- Status: ticket KA0089

## F2. A comment still names dist/og-default.png

- Kind: cleanup
- Found by: 2026-10-14-review-ka0027-leads-sqli-4b5ffc6b (review 2 note), 2026-10-14
- Where: `src/pages/og-default.png.ts:20`
- What: the build now writes pages to `dist/client/`, so the comment's `dist/og-default.png` path is stale.
- Status: dropped (one stale comment line; fix it with the next edit of that file)
