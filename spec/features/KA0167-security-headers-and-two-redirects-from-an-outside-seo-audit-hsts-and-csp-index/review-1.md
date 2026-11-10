# KA0167 - Review 1

- Job: 2026-11-10-review-6a88c3b1
- Branch: arthur/2026-11-10-worker-7f68fb01
- Commit reviewed: c4f742e47e4460e92f2b941032a1d97d67f51829
- Verdict: FAIL

## Final message

The branch adds an open redirect, so it fails. HSTS, the CSP and the footer links work and all checks pass, but the new index redirect sends visitors to any outside site.

## Findings

1. **`nginx.conf:33`, `:67`: the index redirect sends visitors to any other site (security, FAIL).** The map matches against `$request_uri`, which is the address exactly as the visitor typed it. nginx does not collapse a double slash in it, and `[^?]*/` accepts a path that starts with `//`. Run against the branch's `nginx.conf` on nginx 1.24 (with `absolute_redirect off` as configured):
   - `GET //evil.example/index.html` → `301 Location: //evil.example/`
   - `GET //evil.example/index` → `301 Location: //evil.example/`
   - `GET /\evil.example/index.html` → `301 Location: /\evil.example/`. Browsers read `\` as `/` in http(s) addresses, so this goes to the same place.

   A browser reads `//evil.example/` as "same protocol, other host", so `https://kacperadler.pl//evil.example/index.html` lands on `https://evil.example/`. That is an open redirect: a phishing link that starts with the owner's domain. Because the answer is a 301, browsers cache it.
   - Before this branch the same URI got a 404, so the branch introduced it, in a ticket whose kind is security.
   - The ticket's Done-means asks for "other `*/index.html` paths of Astro's output" to go to "their directory URL". `//evil.example/` is neither.
   - Whether Traefik in front collapses `//` (its `sanitizePath` option) is not something the repo controls or verifies, so it is no defence here [INFERENCE].
   - Neither half of `security-headers.spec.ts` sends such a path, so nothing catches it.
   - Possible fix: require the directory part to be either exactly `/` or `/` followed by a character that is not `/` or `\`, for example `^(?<index_dir>/(?:[^/\\?][^?]*/)?)index…`. Then add `//evil.example/index.html` to the redirect test, expecting it not to answer 301 to another host.

## Notes
- (minor) `nginx.conf:33`: the redirect can be skipped with an encoded name. `GET /%69ndex.html` and `/regulamin/%69ndex.html` answer 200, because `$request_uri` is not decoded but `try_files` decodes `$uri`. The canonical tag still points to `/`, so the SEO cost is small.
- (minor) `AGENTS.md:83`, `tests/e2e/security-headers.spec.ts:44-49`: the docs say the spec names the blocked inline script ("nazywa zablokowany skrypt"). It doesn't: `blockedURI` for inline code is just `inline`. With one hash removed, the failure reads `"script-src-elem inline"` and doesn't say which script lost its hash.
- (minor) `src/pages/regulamin.md:42`, `AGENTS.md`: both are outside the ticket's listed In scope. The `regulamin.md` link fix is needed for "no internal link answers 3xx", and the `AGENTS.md` lines are doc upkeep, so I accept both.
- (minor) `tests/e2e/security-headers.spec.ts:198-207`: this is the third copy of `dockerAnswers` (it is also in `pagination-jump.spec.ts` and `lead-rate-limit.spec.ts`).

## Checks run
- `bun install --frozen-lockfile`: failed (`EACCES` on the temp directory). The existing `node_modules` was used.
- `bun run lint`: 139 files, no fixes applied.
- `bun run check`: 113 files, 0 errors, 0 warnings, 1 hint.
- `bun run test:e2e` (this builds `dist/` too): 269 passed, 11 skipped. The skipped tests are the Docker specs: the Docker socket gives "permission denied" here.
- `docker build -t kacperadler-pl-test .`: **not run**, because the Docker daemon is unreachable. Neither did the worker, so the review criteria's Docker build check is still open.
- The Docker half of `security-headers.spec.ts`, run with a stand-in `docker` command serving `dist/client` through the branch's `nginx.conf` on Ubuntu nginx 1.24 (extracted with `apt-get download`, not the production `nginx:1.30-alpine` image): 10/10 passed.
- curl against that nginx:
  - HSTS `max-age=31536000` and the CSP are on a 200, a 301, a 404 and `/favicon.svg`.
  - `/polityka-prywatnosci/index.html` → 301 `/polityka-prywatnosci/`, and `/realizacje/index` → 301 `/realizacje/`.
  - `/realizacje/index.html?strona=2` → 301 `/realizacje/?strona=2`, which hands over to the pagination redirect.
  - `/index.html?strona=3` → 301 `/?strona=3`.
  - The open-redirect probes in Finding 1.
- Mutation by hand (no mutate script exists):
  - Removing the second `sha256` from the CSP fails the preview tests, which report `script-src-elem inline` and show `script.js` never loading.
  - Restoring the footer's `/regulamin` without the slash fails the client-router test (`toHaveURL`).
  - Both changes were restored with `git checkout --`, and `git status` is clean.

FAIL