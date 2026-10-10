# KA0016 - The e2e suite cannot start Astro 7 preview: it detaches

```json
{
  "id": "KA0016",
  "title": "The e2e suite cannot start Astro 7 preview: it detaches",
  "date": "2026-10-10"
}
```

## Description

Since KA0003 (Astro 7), `astro preview` without a TTY starts a background server, prints one JSON line and exits 0. Playwright's `webServer` then reports `Process from config.webServer exited early`, so `bun run test:e2e` fails on a clean machine. Earlier green runs reused a stray preview another worktree had left on port 4329 (`reuseExistingServer` outside CI), so they did not test the branch's own build. Reproduced on main by the coordinator on 2026-10-10: `bunx astro preview --port 4399 </dev/null` exited 0 within seconds and the server kept answering 200.

## Goal

The e2e suite tests the build of the tree it runs in, on any machine and next to other worktrees: the vision's a11y and behaviour checks rest on it, and `npm test` (KA0004) runs it before every merge.

- Kind: bug

## Done means

- `playwright.config.ts` starts a preview that stays in the foreground for Playwright to own and stop (an Astro 7 flag or setting that keeps it attached, or `node`/`bun` serving `dist/` directly), and leaves no server behind after the run (`astro preview status` reports none, nothing listens on the port).
- The port comes from an env var with 4329 as default (KA0004 F1), and the run never reuses a server it did not start, so a stray server on 4329 cannot make it pass or fail.
- `bun run test:e2e` passes from a shell without a TTY (`</dev/null`), with and without `CI=true`, while another server listens on 4329.
- `bun run lint`, `bun run check`, `bunx prettier --check "**/*.astro"`, `bun run build` and `bun run test:e2e` pass.

## Scope

In:
- `playwright.config.ts`; `package.json` scripts only if the preview command moves there; `.github/workflows/ci.yml` only if the env var needs setting.

Out:
- Any spec in `tests/e2e/` beyond what the config change needs.

## Decisions

- 2026-10-10: Found by the KA0012 worker after merging main; confirmed by the coordinator. Waits for the human's approval; KA0004 (npm test runs e2e) waits for it, since h merge would otherwise run a broken suite.
- 2026-10-10: The human approved it.
- 2026-10-10: The human: every KA finding and merge is approved until the coordinator reports the project ready; no push until he has read that report.
