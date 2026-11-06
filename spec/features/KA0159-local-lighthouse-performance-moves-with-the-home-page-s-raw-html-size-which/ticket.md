# KA0159 - Local Lighthouse Performance moves with the home page's raw HTML size, which production never serves

```json
{
  "id": "KA0159",
  "title": "Local Lighthouse Performance moves with the home page's raw HTML size, which production never serves",
  "date": "2026-11-06"
}
```

## Description

F1 of KA0158 (spec/features/KA0158-the-process-animates-in-order-step-1-mark-then-its-drawing-then-step-2-mark-then/findings.md).

- Kind: test
- Found by: 2026-11-05-worker-dbbe606f (worker), 2026-11-05
- Where: `astro preview` (no compression) as the server for the Lighthouse bar; `dist/client/index.html` (about 166 KB raw, 27 KB gzipped)
- What: Lighthouse 12 mobile with Playwright's `chrome-headless-shell` against `bun run preview` reads the home page uncompressed. Its simulated network adds a whole round trip (FCP 1.7 s to 1.9 s, LCP 2.7 s to 2.9 s, Performance 95-96 to 94) once the document crosses about 166.2 KB. `main` (5b0c8a1) sits at 164.6 KB, about 1.6 KB under it. KA0158's CSS adds 3 KB raw (0.5 KB gzipped). It scores 94, 94, 94. The same change without its sequence CSS scores 95, 95, 96. Adding 2 KB of unused CSS to that version, with nothing else changed, brings it back to 94, 94, 94. Served gzipped, as `nginx.conf` does in production, `main` and the branch both score 99, 99, 99. So any later change that adds about 2 KB to the home page fails the bar locally while the production page is unaffected.
- Suggestion: measure the bar against a gzip server: the `Dockerfile` image (nginx with the repository's `nginx.conf`), or a small static server with gzip as part of the KA0150 Lighthouse script. Record which server each run used. Leaves the page itself unchanged.

## Goal

<!-- What we are after, what it moves in spec/vision.md, and the evidence (file:line, a command and its output). -->

- Kind: test

## Done means

<!-- Each observable result, and the test that proves it; the project's checks pass. -->

## Scope

In:
<!-- - `path/to/file.ts`: what changes there. -->

Out:
<!-- - What this ticket does not do, and which ticket does. -->

## Decisions

- 2026-11-06: Source: F1 of KA0158
