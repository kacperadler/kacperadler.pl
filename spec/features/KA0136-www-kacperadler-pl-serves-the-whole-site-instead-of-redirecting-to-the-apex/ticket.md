# KA0136 - www.kacperadler.pl serves the whole site instead of redirecting to the apex

```json
{
  "id": "KA0136",
  "title": "www.kacperadler.pl serves the whole site instead of redirecting to the apex",
  "date": "2026-10-29"
}
```

## Description

`curl -sSI https://www.kacperadler.pl/` answers `HTTP/2 200` with the home page (no `Location`), so the site lives on two hosts. The pages carry `rel="canonical"` to `https://kacperadler.pl/...`, but Umami records the two hostnames apart, and the tracker's `data-domains` has to list both (`kacperadler.pl,www.kacperadler.pl`) or the www visits go uncounted.

## Goal

www.kacperadler.pl redirects permanently (301) to kacperadler.pl, so search engines see one copy of the site and the statistics count one host. The redirect is set in Dokploy, outside the repo; afterwards `data-domains` can drop the www host.

- Kind: improvement

Evidence:
- Dokploy domain settings / `nginx.conf`, `src/data/site-config.ts` (`analytics.domains`)
- Found by: 2026-10-29-ka0131-umami-in-tests-cf4e0bc9 (worker), 2026-10-29

## Done means

- The fix, with a test that proves it: redirect `www.kacperadler.pl` to `https://kacperadler.pl$request_uri` with a 301 (in Dokploy's domain/Traefik settings or a `server_name www.kacperadler.pl` block in `nginx.conf`), then drop `www.kacperadler.pl` from `siteConfig.analytics.domains` and from `tests/e2e/analytics.spec.ts`. The Dokploy settings are not in the repo, so the human checks where the www host is configured.
- `npm test` and `npm run check` pass. The structure test holds.

## Scope

In:
- redirect `www.kacperadler.pl` to `https://kacperadler.pl$request_uri` with a 301 (in Dokploy's domain/Traefik settings or a `server_name www.kacperadler.pl` block in `nginx.conf`), then drop `www.kacperadler.pl` from `siteConfig.analytics.domains` and from `tests/e2e/analytics.spec.ts`. The Dokploy settings are not in the repo, so the human checks where the www host is configured.

## Decisions

- 2026-10-29: Source: F1 of KA0131
- 2026-10-29: The human approved it and sets the 301 www → apex redirect in Dokploy himself; the worker then drops www from data-domains once curl shows the 301.
