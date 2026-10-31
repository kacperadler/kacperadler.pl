# KA0143 - Outcome

- Merged: 2026-10-31, `a8d9a36`
- Branch: h/2026-10-31-ka0143-readme-f9ed5c3f
- Reviews: review-1.md PASS
- Cost: worker $1.56, reviews $0.61; review rounds 1

## What went in

- `README.md`: a 74-line README in plain Polish: what the site is, stack, requirements, commands, checks, environment variables, local runs, and a short deploy note linking to the runbook.
- `docs/deploy.md`: the full Dokploy runbook (Resend domain, volume, environment, deploy, checking a lead, the rate-limit subnet check).
- `AGENTS.md`: holds the lead API, rate-limit and e2e details cut from the README; its Dokploy pointer goes to `docs/deploy.md`.
- `Dockerfile`: the Environment-tab comment points to `docs/deploy.md`.

## Checks on main

- `npm run check`: passed.
- `npm test`: passed.
- CI macOS: off (--no-ci)

## Left open

- Findings: F1, F2 dropped; the dev-no-reload flake is KA0099.
