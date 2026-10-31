# KA0144 - The ui-catalogue specs can be the first page of the e2e dev server and get its startup reload

```json
{
  "id": "KA0144",
  "title": "The ui-catalogue specs can be the first page of the e2e dev server and get its startup reload",
  "date": "2026-10-31"
}
```

## Description

a dev server started on a fresh content store (`rm -rf .astro node_modules/.vite`, or the e2e builds rewriting `.astro/` before it starts) writes the store at startup; Astro's `attachDataStoreInvalidation` (`node_modules/astro/dist/content/vite-plugin-content-virtual-mod.js`) answers with `{"type":"full-reload","path":"*"}` while no browser is connected, Vite buffers it (`bufferedMessage` in `node_modules/vite/dist/node/chunks/node.js`) and sends it to the first page that connects, which reloads about 300 ms after its load (3 of 3 runs of a probe script after `rm -rf .astro node_modules/.vite`). KA0099 makes `dev-no-reload.spec.ts` open its page again when that happens, but with several workers (local runs, `fullyParallel`) a `ui-catalogue.spec.ts` test can be the first page instead and fail the same way (`Execution context was destroyed`). [INFERENCE] not seen in a run; with 1 worker (CI) `dev-no-reload` runs before `ui-catalogue` and takes the reload.

## Goal

What we are after, what it moves in `spec/vision.md`, and the evidence (file:line, a command and its output). A mechanical, fully specified change (a rename, a moved section, a list of exact edits) adds `- Model: haiku` under Kind; anything with behaviour to judge has no Model line.

- Kind: bug

Evidence:
- `tests/e2e/ui-catalogue.spec.ts:9` (every `page.goto(\`${DEV_URL}/ui\`)`)
- Found by: 2026-10-31-ka0099-dev-no-reload-fla-8f344986 (worker), 2026-10-31

## Done means

- The fix, with a test that proves it: drain the buffered reload once before any /ui spec, for example a global setup that opens `/ui` on the dev server in a browser and waits for the reload to land, or move `openSettled` from `dev-no-reload.spec.ts` into a shared helper the ui-catalogue specs call; optionally report the startup reload to Astro, whose comment in `invalidateDataStore` says it means to skip it.
- `npm test` and `npm run check` pass. The structure test holds.

## Scope

In:
- drain the buffered reload once before any /ui spec, for example a global setup that opens `/ui` on the dev server in a browser and waits for the reload to land, or move `openSettled` from `dev-no-reload.spec.ts` into a shared helper the ui-catalogue specs call; optionally report the startup reload to Astro, whose comment in `invalidateDataStore` says it means to skip it.

## Decisions

- 2026-10-31: Source: F1 of KA0099
