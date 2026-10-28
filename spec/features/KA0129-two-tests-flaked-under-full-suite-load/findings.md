# KA0129 - Findings

What was discovered while doing this ticket but is not part of it: bugs, risks, gaps, and suggested changes. Workers add entries on their branch; the coordinator adds the non-blocking notes from reviews. One entry per finding, numbered, never deleted: only its Status changes.

A finding ends in one of three statuses: `fixed` (the branch fixed it; name the commit), `ticket K0000` (a planning ticket carries it), or `dropped (reason)`. `open` lives only until the merge: `h merge` turns every `Status: open` entry into a planning ticket and rewrites its status to `ticket K0000`.

`- Budget:` is optional: set it, in USD, only when the ticket this finding becomes is expected to cost more than the autopilot default, and leave the line out otherwise. `h merge` copies it into the ticket's JSON block as `budget`, which `h ticket status --autopilot` passes to `--budget`, capped at `H_AUTOPILOT_BUDGET_MAX`.

## F1. Every e2e page load on the preview sends a pageview to the production Umami

- Kind: bug
- Found by: 2026-10-28-ka0129-load-flakes-af11ddfd (worker), 2026-10-28
- Where: `src/components/layout/base-head.astro:157-189`, `playwright.config.ts` (`use`)
- What: the e2e preview is a PROD build, so each page a spec opens loads `https://analytics.kacperadler.pl/script.js` when the browser is idle and POSTs a pageview to `https://analytics.kacperadler.pl/api/send` (seen with a Playwright script on `bun run preview`: one GET and one POST per `goto("/#contact")`, about 150-450 ms each). Headless Chromium sends no Do Not Track and the loader sets no `data-domains`, so the production dashboard counts `localhost` pageviews from every run of every worktree, and every spec that waits for `networkidle` on the preview depends on that remote server answering.
- Suggestion: keep the e2e browser off the analytics host, for example `launchOptions: { args: ["--host-resolver-rules=MAP analytics.kacperadler.pl ~NOTFOUND"] }` in `use` of `playwright.config.ts` (the script then fails at once), and decide whether the production loader should set `data-domains="kacperadler.pl"`. The `stubUmami` stubs in `contact-form.spec.ts` keep working either way (the tracker leaves an existing `window.umami` alone).
- Status: open

## F2. Other specs still wait for networkidle on preview pages

- Kind: bug
- Found by: 2026-10-28-ka0129-load-flakes-af11ddfd (worker), 2026-10-28
- Where: `tests/e2e/a11y.spec.ts:84`, `tests/e2e/design.spec.ts:70`, `tests/e2e/send-a-lead.ts:21` (used by `ui-catalogue.spec.ts:1208` on the preview)
- What: the same wait this ticket removed from `contact-form.spec.ts`: on the preview it waits for the Umami round trips (F1), and with the analytics host hanging the old submit-lock test timed out in `page.waitForLoadState` after 30 s. In `send-a-lead.ts` the wait comes after the submit click on a page that reached networkidle long before, so it most likely returns at once and the function can return before the route handler counted the request [INFERENCE: Playwright resolves `waitForLoadState` at once for a state already reached; not run].
- Suggestion: wait for the state each test asserts instead (in `sendALead`, for the stubbed request itself, e.g. `page.waitForRequest`); F1 alone would also take the remote server out of these waits.
- Status: open

## F3. Above the default worker count, more specs time out

- Kind: risk
- Found by: 2026-10-28-ka0129-load-flakes-af11ddfd (worker), 2026-10-28
- Where: `tests/e2e/a11y.spec.ts:28`, `tests/e2e/ui-catalogue.spec.ts:254`, `tests/e2e/ui-catalogue.spec.ts:783`
- What: `bunx playwright test --workers=12 --retries=0` on a 7-core machine already loaded by other worktrees: 8 failed, 210 passed. Four were the "database is locked" reads this ticket fixed; the rest were the axe scans of the home/legal pages and of `/ui` running past the 30 s test timeout and the pagination jump on the dev catalogue not finding the current page within 5 s. With the default workers (`CI` set: 1) two full runs passed 218 and 219 of 218 and 219.
- Suggestion: if runs with more workers are wanted, give the axe tests a longer `test.setTimeout` (they scan several pages in one test) and look at the dev-server pagination test under load; otherwise keep the worker count as it is.
- Status: open
