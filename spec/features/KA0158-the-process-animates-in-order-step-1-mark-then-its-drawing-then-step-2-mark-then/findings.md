# KA0158 - Findings

What was discovered while doing this ticket but is not part of it: bugs, risks, gaps, and suggested changes. Workers add entries on their branch; the merge adds the passed review's notes of kind security, bug or risk. One entry per finding, numbered, never deleted: only its Status changes.

A finding ends in one of four statuses: `fixed in <commit>` (the branch fixed it), `ticket <id>` (a planning ticket carries it), `deferred (client summary)` (it goes to the client in a summary, not on the board), or `dropped (<reason>)`. `open` lives only until the merge, which settles every `Status: open` entry as the project's findings mode says: a planning ticket each (the default), one planning ticket for all of them, or `deferred (client summary)`.

## F1. Local Lighthouse Performance moves with the home page's raw HTML size, which production never serves

- Kind: test
- Found by: 2026-11-05-worker-dbbe606f (worker), 2026-11-05
- Where: `astro preview` (no compression) as the server for the Lighthouse bar; `dist/client/index.html` (about 166 KB raw, 27 KB gzipped)
- What: Lighthouse 12 mobile with Playwright's `chrome-headless-shell` against `bun run preview` reads the home page uncompressed. Its simulated network adds a whole round trip (FCP 1.7 s to 1.9 s, LCP 2.7 s to 2.9 s, Performance 95-96 to 94) once the document crosses about 166.2 KB. `main` (5b0c8a1) sits at 164.6 KB, about 1.6 KB under it. KA0158's CSS adds 3 KB raw (0.5 KB gzipped). It scores 94, 94, 94. The same change without its sequence CSS scores 95, 95, 96. Adding 2 KB of unused CSS to that version, with nothing else changed, brings it back to 94, 94, 94. Served gzipped, as `nginx.conf` does in production, `main` and the branch both score 99, 99, 99. So any later change that adds about 2 KB to the home page fails the bar locally while the production page is unaffected.
- Suggestion: measure the bar against a gzip server: the `Dockerfile` image (nginx with the repository's `nginx.conf`), or a small static server with gzip as part of the KA0150 Lighthouse script. Record which server each run used. Leaves the page itself unchanged.
- Status: open

## F2. On desktop a drawing draws over about a fifth of the viewport's scroll, not KA0157's 30%

- Kind: ux
- Found by: 2026-11-05-worker-dbbe606f (worker), 2026-11-05
- Where: `src/components/mb/sections/how-i-work.astro` (the run's slots), `tests/e2e/home.spec.ts` (the `draw` share per viewport)
- What: KA0158 plays the five marks, rails and drawings one after another, each whole on screen. The desktop zigzag (KA0152) puts all five steps in about 1100px of list. A 900 to 1000px viewport sees all of them within about 1400px of scroll, so the five drawings share that span. Each gets about 210 to 230px of scroll at 1440px (21 to 23% of the viewport) where KA0157 had at least 30%. At 390px a drawing still gets about 270px (32%). The e2e test pins 18% at 1440x1000 and 28% at 390x844.
- Suggestion: if the owner finds the desktop draw too quick on the preview, give the desktop process more scroll. That means a taller list (KA0152's layout and height, out of KA0158's scope) or letting a drawing play while partly under the header. Otherwise drop this entry.
- Status: open
