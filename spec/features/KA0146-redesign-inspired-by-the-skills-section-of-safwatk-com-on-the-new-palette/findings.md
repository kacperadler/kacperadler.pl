# KA0146 - Findings

What was discovered while doing this ticket but is not part of it: bugs, risks, gaps, and suggested changes. Workers add entries on their branch; the merge adds the passed review's notes of kind security, bug or risk. One entry per finding, numbered, never deleted: only its Status changes.

A finding ends in one of four statuses: `fixed in <commit>` (the branch fixed it), `ticket <id>` (a planning ticket carries it), `deferred (client summary)` (it goes to the client in a summary, not on the board), or `dropped (<reason>)`. `open` lives only until the merge, which settles every `Status: open` entry as the project's findings mode says: a planning ticket each (the default), one planning ticket for all of them, or `deferred (client summary)`.

## F1. Lighthouse cannot run in the job's environment

- Kind: test
- Found by: 2026-11-05-worker-aab5e8bd (worker), 2026-11-05
- Where: no Lighthouse script in `package.json`
- What: `CHROME_PATH=~/.cache/ms-playwright/chromium-1248/chrome-linux64/chrome npx -y lighthouse@12 http://127.0.0.1:4400/ --chrome-flags="--headless=new --no-sandbox"` ends in "waiting for dynamic debugging port in chrome-err.log"; pointing Lighthouse (`--port=9333`) at Playwright's Chromium launched with `--remote-debugging-port=9333` hangs past 150 s with no output. The ticket's Lighthouse bar (Performance 95, the rest 100) was therefore not measured on this branch.
- Suggestion: run Lighthouse mobile (or PageSpeed Insights) against the owner's preview before merge and record the four scores; separately, find a Chrome launch that works on this host (a system Chrome, or `chrome-launcher` with a fixed port) and add it as a script, which stays out of KA0146.
- Status: open

## F2. The process section is about twice as tall as before

- Kind: ux
- Found by: 2026-11-05-worker-aab5e8bd (worker), 2026-11-05
- Where: `src/components/mb/sections/how-i-work.astro` (`row-gap: 280px`)
- What: each process card grew by its drawing (370-420px tall at 900-1440px), and keeping the stagger (each card starting 0.8-1 of the way down the one before, the layout test) needs a same-side gap of about 0.6 of a card, so the gap went from 128px to 280px. The home page went from 8342px to 11807px at 1440px (jury `report.json`, desktop height).
- Suggestion: if the owner finds it long on the preview, lower the drawings' viewBox height (400×120 to about 400×80) and the gap with it, or let the stagger overlap more (relax the 0.8 bound); the drawing itself stays.
- Status: open
