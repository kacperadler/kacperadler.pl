# KA0154 - Lighthouse runs in a job with Playwright's headless shell

```json
{
  "id": "KA0154",
  "title": "Lighthouse runs in a job with Playwright's headless shell",
  "date": "2026-11-05"
}
```

## Description

F1 of KA0152 (spec/features/KA0152-the-home-page-reaches-a-jury-estimate-of-8-5-scored-blind-with-its-motion/findings.md).

- Kind: test
- Found by: 2026-11-05-worker-e334f830 (worker), 2026-11-05
- Where: no Lighthouse script in `package.json` (KA0146 F1, KA0150)
- What: Playwright's full Chromium still dies here (`process_singleton_posix.cc: socket() failed: Permission denied`, in `chrome-err.log`), but `chrome-headless-shell` starts: `CHROME_PATH=~/.cache/ms-playwright/chromium_headless_shell-1248/chrome-headless-shell-linux64/chrome-headless-shell npx -y lighthouse@12 http://127.0.0.1:4400/ --chrome-flags="--no-sandbox --disable-gpu --user-data-dir=<tmp>"` with `TMPDIR` and `npm_config_cache` inside the worktree gave three mobile runs of 95/100/100/100 on this branch and 95, 95, 96 Performance on the base commit.
- Suggestion: KA0150 can use this launch for its script; Performance sits at 95-96 on this host for both builds, so the bar has no margin.

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

- 2026-11-05: Source: F1 of KA0152
