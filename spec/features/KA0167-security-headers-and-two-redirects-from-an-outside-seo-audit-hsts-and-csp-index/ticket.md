# KA0167 - Security headers and two redirects from an outside SEO audit: HSTS and CSP, /index.html, footer links without the trailing slash

```json
{
  "id": "KA0167",
  "title": "Security headers and two redirects from an outside SEO audit: HSTS and CSP, /index.html, footer links without the trailing slash",
  "date": "2026-11-10"
}
```

## Description

Someone sent the owner an automatic SEO and security audit of kacperadler.pl (SETPROFIT, 2026-11-10). The coordinator checked each finding against the live site; three hold and are small: no HSTS or CSP header, the home page answering 200 at `/index.html`, and the footer linking to the legal pages without their trailing slash, so each click goes through a 301. This ticket fixes those three and nothing else.

## Goal

Checked on 2026-11-10 with curl against https://kacperadler.pl:
- `curl -sI https://kacperadler.pl/` has X-Content-Type-Options, X-Frame-Options, Referrer-Policy and Permissions-Policy (`nginx.conf:86-91`) but no `Strict-Transport-Security` and no `Content-Security-Policy`.
- `https://kacperadler.pl/index.html` answers 200 (its canonical points to `/`, so the harm is small).
- `https://kacperadler.pl/regulamin` and `/polityka-prywatnosci` answer 301 to the trailing-slash URL; the footer links to them without the slash (`src/components/mb/footer.astro:30`, `:35`).

The page loads: two module scripts from `/_astro/`, three `application/ld+json` blocks, two inline `<script>` blocks, inline styles (`astro.config.mjs:60`, `inlineStylesheets: "always"`), and the self-hosted analytics if it is on. A CSP must allow exactly what the site needs, by hash or nonce for inline code, and break nothing.

- Kind: security

## Done means

- `nginx.conf` sends `Strict-Transport-Security: max-age=31536000` (no `includeSubDomains`/`preload` without the owner) and a `Content-Security-Policy` that loads every page with no CSP error in the browser console, on the home page, the legal pages and the 404, with motion and the client router working.
- `/index.html` answers 301 to `/`; other `*/index.html` paths of Astro's output also go 301 to their directory URL.
- The footer links point to `/regulamin/` and `/polityka-prywatnosci/`, so no internal link answers 3xx.
- An e2e or container test checks the headers, the redirect and that no CSP violation is reported; the project's checks pass, and Lighthouse and axe are no worse.

## Scope

In:
- `nginx.conf`, `src/components/mb/footer.astro`, the test that checks them.

Out:
- The audit's other advice (meta description length, WebMCP, more content): content and case studies are KA0029 to KA0035 and KA0137.

## Decisions
- 2026-11-10: KA0167 approved; the owner: "KA-D23: approve" (KA-D23)
- 2026-11-10: Merge KA0167 and deploy it; the owner: "KA-D27: merge" (KA-D27)
