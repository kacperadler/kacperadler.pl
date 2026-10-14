# KA0089 - /api/lead has no rate limit: a script can fill the database and the inbox

```json
{
  "id": "KA0089",
  "title": "/api/lead has no rate limit: a script can fill the database and the inbox",
  "date": "2026-10-14"
}
```

## Description

the only spam guard is the honeypot field, which a script that posts JSON straight to `/api/lead` leaves empty. Every valid post saves a row in `/data/leads.sqlite` and sends one Resend e-mail, so a loop of `curl -X POST https://kacperadler.pl/api/lead -H 'content-type: application/json' -d '{"email":"a@b.cd","type":"ai","message":"x","website":""}'` grows the file without bound and uses up the Resend quota. NocoDB's shared form had the same exposure; the route now owns it.

## Goal

A script cannot flood the lead store or the inbox: past a few posts a minute from one address `/api/lead` answers 429 (shown as the form's send error), while a real visitor sending one form never hits it.

- Kind: risk

Evidence:
- `src/pages/api/lead.ts`, `nginx.conf` (`location /api/`)
- Found by: 2026-10-14-ka0027-leads-sqlite-2f54061e (worker), 2026-10-14

## Done means

- The fix, with a test that proves it: a per-IP limit in nginx for `location /api/` (`limit_req_zone $binary_remote_addr zone=lead:1m rate=5r/m;` plus `limit_req zone=lead burst=5 nodelay;`, answering 429, which the form already shows as `error-submit`), with the real client IP taken from Traefik's `X-Forwarded-For` (`set_real_ip_from` the Dokploy network). Out: captchas or anything that loads a third-party script.
- A Docker e2e test (like `pagination-jump.spec.ts`): the 6th+ rapid post from one client gets 429, another client is unaffected, and the client IP comes from `X-Forwarded-For` only when the request arrives from the trusted proxy network.
- `bun run check` and `bun run test` pass.

## Scope

In:
- a per-IP limit in nginx for `location /api/` (`limit_req_zone $binary_remote_addr zone=lead:1m rate=5r/m;` plus `limit_req zone=lead burst=5 nodelay;`, answering 429, which the form already shows as `error-submit`), with the real client IP taken from Traefik's `X-Forwarded-For` (`set_real_ip_from` the Dokploy network). Out: captchas or anything that loads a third-party script.

## Decisions

- 2026-10-14: Source: F1 of KA0027
- 2026-10-14: The human approved the ticket ("rusz z tiketem na limit zapytan"); no push to the remote in KA until he says so.
