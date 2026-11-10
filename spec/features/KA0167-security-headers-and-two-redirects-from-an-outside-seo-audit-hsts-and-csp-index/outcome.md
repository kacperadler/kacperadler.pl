# KA0167 - Outcome

- Merged: 2026-11-10, `e277630`
- Branch: arthur/2026-11-10-worker-7f68fb01
- Reviews: review-1.md FAIL, review-2.md PASS
- Cost: worker $5.49, reviews $1.86; review rounds 2

## What went in

- `nginx.conf`: sends HSTS for a year and a CSP that allows only the site's own scripts, the two inline scripts of `base-head.astro` by sha256, and Umami; sends `<dir>/index.html` and `<dir>/index` (also when encoded) to `<dir>/` with a 301, keeping the query, never to another host.
- `src/components/mb/footer.astro`: the legal links point to `/polityka-prywatnosci/` and `/regulamin/`, so neither answers 301.
- `src/pages/regulamin.md`: the privacy policy link ends in `/`.
- `tests/e2e/security-headers.spec.ts`: on the preview, puts the `nginx.conf` CSP on every page and checks there is no violation and no inline script without its hash (naming it), including the analytics script and the client router; in Docker, checks HSTS and the CSP on every kind of response, the index redirects including encoded names, that no index path redirects to another host, and that no internal link answers 3xx.
- `AGENTS.md`: describes HSTS, the CSP and its hash upkeep, the index redirect and how it stays on the site, trailing-slash internal links, and the new spec.
- `spec/features/KA0167-security-headers-and-two-redirects-from-an-outside-seo-audit-hsts-and-csp-index/findings.md`: F1, the three copies of the Docker check and nginx container setup in the e2e specs.

## Checks on main

- `bun install --frozen-lockfile`: passed.
- `npm run check`: passed.
- `npm test`: passed.

## Left open

- Tickets from findings: KA0169 (F1).
