# KA0171 - CI e2e fails at "Install system deps for cached browsers": the runner cannot resolve the Ubuntu package servers

```json
{
  "id": "KA0171",
  "title": "CI e2e fails at \"Install system deps for cached browsers\": the runner cannot resolve the Ubuntu package servers",
  "date": "2026-11-11"
}
```

## Description

Since 2026-11-11 every CI run of kacperadler.pl fails in the `e2e (playwright)` job, before a single test runs, so no KA branch can pass CI and the autoMerge after a PASS never happens. The step that installs Chromium's system packages with apt cannot reach Ubuntu's package servers on GitHub's runner. The e2e job should get those packages without depending on that step succeeding, and should name the cause plainly when it cannot.

## Goal

Evidence: four runs in a row failed at the same step, on commits that change no code (main `c9d418a` attempts 1 and 2, main `bb505e8`, branch `arthur/2026-11-11-worker-2d091eda` `480f53e`). `arthur ci main --project kacperadler.pl` shows step 9, "Install system deps for cached browsers" (`.github/workflows/ci.yml:95-97`, `bunx playwright install-deps chromium`, run when the Playwright browser cache hits), failing with about 20 lines of `Temporary failure resolving 'security.ubuntu.com'` (also `archive.ubuntu.com`, `azure.archive.ubuntu.com`) and `E: Unable to fetch some archives`. The cache-miss path (`:92-93`, `install --with-deps`) uses the same apt sources.

The fix is the worker's to choose and justify, for example: run the e2e job in Microsoft's Playwright container image at the pinned `@playwright/test` version (system packages already inside, no apt), or retry apt with `apt-get update` first. It must not skip the e2e tests.

- Kind: ci

## Done means

- A CI run on the branch passes the `e2e (playwright)` job with the same specs as before, and its log shows no apt fetch from the Ubuntu package servers (or, if a retry is the fix, a passing step after the retry).
- The browser version used in CI still matches the pinned `@playwright/test` version.
- `npm run check`, `npm run lint` and `npm test` pass.

## Scope

In:
- `.github/workflows/ci.yml`: how the e2e job gets Chromium's system packages.

Out:
- Any change to the site or the e2e specs.

## Decisions

- 2026-11-11: KA0171 approved; the owner: "KA-D35 - approve" (KA-D35)
- 2026-11-11: Merge KA0171; the owner: "KA-D36 - 1" (KA-D36)
