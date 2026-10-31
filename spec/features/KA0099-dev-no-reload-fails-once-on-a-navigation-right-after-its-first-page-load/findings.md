# KA0099 - Findings

What was discovered while doing this ticket but is not part of it: bugs, risks, gaps, and suggested changes. Workers add entries on their branch; the coordinator adds the non-blocking notes from reviews. One entry per finding, numbered, never deleted: only its Status changes.

A finding ends in one of three statuses: `fixed` (the branch fixed it; name the commit), `ticket K0000` (a planning ticket carries it), or `dropped (reason)`. `open` lives only until the merge: `h merge` turns every `Status: open` entry into a planning ticket and rewrites its status to `ticket K0000`.

`- Budget:` is optional: set it, in USD, only when the ticket this finding becomes is expected to cost more than the autopilot default, and leave the line out otherwise. `h merge` copies it into the ticket's JSON block as `budget`, which `h ticket status --autopilot` passes to `--budget`, capped at `H_AUTOPILOT_BUDGET_MAX`.

## F1. The ui-catalogue specs can be the first page of the e2e dev server and get its startup reload

- Kind: bug
- Found by: 2026-10-31-ka0099-dev-no-reload-fla-8f344986 (worker), 2026-10-31
- Where: `tests/e2e/ui-catalogue.spec.ts:9` (every `page.goto(\`${DEV_URL}/ui\`)`)
- What: a dev server started on a fresh content store (`rm -rf .astro node_modules/.vite`, or the e2e builds rewriting `.astro/` before it starts) writes the store at startup; Astro's `attachDataStoreInvalidation` (`node_modules/astro/dist/content/vite-plugin-content-virtual-mod.js`) answers with `{"type":"full-reload","path":"*"}` while no browser is connected, Vite buffers it (`bufferedMessage` in `node_modules/vite/dist/node/chunks/node.js`) and sends it to the first page that connects, which reloads about 300 ms after its load (3 of 3 runs of a probe script after `rm -rf .astro node_modules/.vite`). KA0099 makes `dev-no-reload.spec.ts` open its page again when that happens, but with several workers (local runs, `fullyParallel`) a `ui-catalogue.spec.ts` test can be the first page instead and fail the same way (`Execution context was destroyed`). [INFERENCE] not seen in a run; with 1 worker (CI) `dev-no-reload` runs before `ui-catalogue` and takes the reload.
- Suggestion: drain the buffered reload once before any /ui spec, for example a global setup that opens `/ui` on the dev server in a browser and waits for the reload to land, or move `openSettled` from `dev-no-reload.spec.ts` into a shared helper the ui-catalogue specs call; optionally report the startup reload to Astro, whose comment in `invalidateDataStore` says it means to skip it.
- Status: open
