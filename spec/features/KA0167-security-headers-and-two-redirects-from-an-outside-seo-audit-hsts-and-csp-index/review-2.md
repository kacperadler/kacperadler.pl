# KA0167 - Review 2

- Job: 2026-11-10-review-8d24eca9
- Branch: arthur/2026-11-10-worker-7f68fb01
- Commit reviewed: 8be714ef8a1309dc635a895a9e41c30841c2dba9
- Verdict: PASS

## Final message

No blocking findings. The branch meets every Done-means item in KA0167. I checked the `nginx.conf` index redirect from several angles and found no way to send a visitor to another site. The CSP lets every page run without a violation, and each mutation I made to the changed behavior failed the new spec.

How I looked for a way around the index redirect (`nginx.conf:41-44`): I ran Ubuntu's nginx 1.24 on the e2e build with this `nginx.conf` and sent each path exactly as written (`curl --path-as-is`).
- `//evil.example/index.html`, `///evil.example/index` and `/%2F%2Fevil.example/index.html` each answer 301 `/evil.example/`, still on this site. `/evil.example%2Findex.html` answers the same.
- These answer 404 with no redirect: `/\evil.example/index.html`, `/%5C…`, `/%09/…`, `/@evil.example/index.html` and `/evil.example:80/index.html`. `/..//evil.example/index.html` answers 400.
- Encoded and dot paths are caught: `/%69ndex.html` and `/%69ndex` go to `/`, `/regulamin/%69ndex.html` to `/regulamin/`, `/./index.html` and `/a/../index.html` to `/`.
- No loops: `/`, `/?a=1`, `/regulamin/` and `/regulamin/?x=1` answer 200, and the query survives the redirect (`/index.html?a=1&b=2` → `/?a=1&b=2`).
- A `%7C` in the path (it decodes to `|`, the map's separator) only gives 301 `/`. It cannot point the redirect anywhere else, because the directory part only allows `[A-Za-z0-9._~-]`.
- HSTS (`max-age=31536000`) and the CSP come on 200, 301, 404 and an asset (`curl -I`).

## Notes
- (minor) `nginx.conf:41-44`: the redirect also catches non-page paths. `/api/index` now answers 301 `/api/`, and `/blog/index.html?strona=2` takes two hops (301, then the 302 to `/blog/2/`). Both stay on the site and do no harm.
- (minor) `tests/e2e/security-headers.spec.ts:211`: the Docker half runs only where the Docker daemon answers. Neither the worker nor I could run it on `nginx:1.30-alpine` (here the socket gives permission denied), so the CI run is the first on the production image. Nginx 1.24 passes all 11 tests in the spec.
- (minor) Ticket Done means "Lighthouse and axe are no worse": axe is covered by the a11y spec in the full suite, but nobody ran Lighthouse. Production gets the CSP from nginx and the preview does not send it, so the only way to measure it is on the live site after deploy.

## Checks
- `bun run check`: 0 errors, 0 warnings, 1 hint.
- `bun run lint`: 139 files checked, no fixes applied.
- `bun run test`: 269 passed, 12 skipped (the Docker specs), in 5.4 minutes. The dev-no-reload spec logged its usual "navigated away" lines.
- `security-headers.spec.ts`, Docker half included, with a throwaway `docker` shim that served `dist/client` through this `nginx.conf` on Ubuntu nginx 1.24 (extracted from the .deb into `/tmp`): 11 passed.
- `npm run mutate`: not declared in `package.json`, so not run. I made these mutations by hand, ran the spec with the shim after each, and restored each with `git checkout -- <file>` (the tree is clean afterwards):
  - Directory class changed to `[^/]+`: the off-site probe test fails (`evil.example`).
  - Analytics host removed from `connect-src`: the home test fails (`"Failed to fetch"`).
  - The first sha256 hash removed: the page tests fail on an unhashed script, and `data-bl-enter` stays `""`.
  - Footer link changed back to `/regulamin`: the router test (`toHaveURL`) and the internal-links test fail.
  - `$is_args$args` dropped from the redirect: the redirect test fails.
  - `data:` removed from `img-src`: the page tests fail on violations.
  - `always` removed from HSTS: the headers test fails.
  - No mutant survived. The shim, the nginx files and the local nginx were removed and stopped before this verdict.

PASS