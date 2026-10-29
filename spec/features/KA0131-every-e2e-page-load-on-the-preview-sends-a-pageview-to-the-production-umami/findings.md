# KA0131 - Findings

What was discovered while doing this ticket but is not part of it: bugs, risks, gaps, and suggested changes. Workers add entries on their branch; the coordinator adds the non-blocking notes from reviews. One entry per finding, numbered, never deleted: only its Status changes.

A finding ends in one of three statuses: `fixed` (the branch fixed it; name the commit), `ticket K0000` (a planning ticket carries it), or `dropped (reason)`. `open` lives only until the merge: `h merge` turns every `Status: open` entry into a planning ticket and rewrites its status to `ticket K0000`.

`- Budget:` is optional: set it, in USD, only when the ticket this finding becomes is expected to cost more than the autopilot default, and leave the line out otherwise. `h merge` copies it into the ticket's JSON block as `budget`, which `h ticket status --autopilot` passes to `--budget`, capped at `H_AUTOPILOT_BUDGET_MAX`.

## F1. www.kacperadler.pl serves the whole site instead of redirecting to the apex

- Kind: improvement
- Found by: 2026-10-29-ka0131-umami-in-tests-cf4e0bc9 (worker), 2026-10-29
- Where: Dokploy domain settings / `nginx.conf`, `src/data/site-config.ts` (`analytics.domains`)
- What: `curl -sSI https://www.kacperadler.pl/` answers `HTTP/2 200` with the home page (no `Location`), so the site lives on two hosts. The pages carry `rel="canonical"` to `https://kacperadler.pl/...`, but Umami records the two hostnames apart, and the tracker's `data-domains` has to list both (`kacperadler.pl,www.kacperadler.pl`) or the www visits go uncounted.
- Suggestion: redirect `www.kacperadler.pl` to `https://kacperadler.pl$request_uri` with a 301 (in Dokploy's domain/Traefik settings or a `server_name www.kacperadler.pl` block in `nginx.conf`), then drop `www.kacperadler.pl` from `siteConfig.analytics.domains` and from `tests/e2e/analytics.spec.ts`. The Dokploy settings are not in the repo, so the human checks where the www host is configured.
- Status: open
