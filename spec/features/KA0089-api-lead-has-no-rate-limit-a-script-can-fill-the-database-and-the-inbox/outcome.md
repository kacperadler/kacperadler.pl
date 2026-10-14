# KA0089 - Outcome

- Merged: 2026-10-14, `1878aa9`
- Branch: h/2026-10-14-ka0089-api-rate-limit-259a6610
- Reviews: review-1.md PASS, review-2.md PASS
- Cost: worker $3.08, reviews $0.88; review rounds 2

## What went in

- `nginx.conf`: `limit_req_zone` keyed on the client IP, 5 posts a minute with `burst=4 nodelay` on `location /api/`, so five rapid posts pass and the sixth gets 429 (the form shows its send error); the client IP comes from Traefik's `X-Forwarded-For` only when the connection arrives from `10.0.0.0/8` (Dokploy, confirmed 10.0.1.11).
- `tests/e2e/lead-rate-limit.spec.ts` (new): real nginx in Docker with a stub API: the 6th post gets 429, another client still gets 200, and the forwarded IP counts only from the trusted network.
- `README.md`, `AGENTS.md`: the limit and the subnet check in Dokploy.
- `findings.md`: F1 flaky ui-proposals spec (ticket KA0090); F2 dropped.

## Checks on main

- `npm run check`: passed.
- `npm test`: passed.
- CI macOS: off (no H_GITHUB_ACTIONS_TOKEN)

## Left open

- Tickets from findings: KA0090 (F1).
