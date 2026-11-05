# KA0150 - Lighthouse cannot run in the job's environment

```json
{
  "id": "KA0150",
  "title": "Lighthouse cannot run in the job's environment",
  "date": "2026-11-05"
}
```

## Description

F1 of KA0146 (spec/features/KA0146-redesign-inspired-by-the-skills-section-of-safwatk-com-on-the-new-palette/findings.md).

- Kind: test
- Found by: 2026-11-05-worker-aab5e8bd (worker), 2026-11-05
- Where: no Lighthouse script in `package.json`
- What: `CHROME_PATH=~/.cache/ms-playwright/chromium-1248/chrome-linux64/chrome npx -y lighthouse@12 http://127.0.0.1:4400/ --chrome-flags="--headless=new --no-sandbox"` ends in "waiting for dynamic debugging port in chrome-err.log"; pointing Lighthouse (`--port=9333`) at Playwright's Chromium launched with `--remote-debugging-port=9333` hangs past 150 s with no output. The ticket's Lighthouse bar (Performance 95, the rest 100) was therefore not measured on this branch.
- Suggestion: run Lighthouse mobile (or PageSpeed Insights) against the owner's preview before merge and record the four scores; separately, find a Chrome launch that works on this host (a system Chrome, or `chrome-launcher` with a fixed port) and add it as a script, which stays out of KA0146.

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

- 2026-11-05: Source: F1 of KA0146
