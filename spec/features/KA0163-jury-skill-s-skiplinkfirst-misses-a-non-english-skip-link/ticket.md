# KA0163 - jury skill's `skipLinkFirst` misses a non-English skip link

```json
{
  "id": "KA0163",
  "title": "jury skill's `skipLinkFirst` misses a non-English skip link",
  "date": "2026-11-06"
}
```

## Description

F2 of KA0153 (spec/features/KA0153-blind-jury-score-of-the-ka0152-home-page-by-an-agent-that-has-not-seen-its-code/findings.md).

- Kind: fix
- Found by: 2026-11-05-worker-9fce7ca4 (worker), 2026-11-05
- Where: https://github.com/juliobsz/skills `jury/scripts/shoot.mjs:259` at `add880bd6ec9`
- What: `skipLinkFirst` tests `/skip|#main|#content/i` against the first stop's label, which is its `innerText` ("Przejdź do treści"), not its href. The home page's first Tab stop is the skip link (`jury/shots/home/k-01-focus.png`), yet `report.json` says `skipLinkFirst: false` on every page. A critic that trusts the field scores Accessibility a point low; this card read the frame instead.
- Suggestion: in the skill, test the first stop's `href` (an in-page `#` target whose element is `main` or contains the page's h1) instead of, or besides, the label. Upstream change, outside this repository; until then, a card for this site reads `k-01-focus`.

## Goal

<!-- What we are after, what it moves in spec/vision.md, and the evidence (file:line, a command and its output). -->

- Kind: fix

## Done means

<!-- Each observable result, and the test that proves it; the project's checks pass. -->

## Scope

In:
<!-- - `path/to/file.ts`: what changes there. -->

Out:
<!-- - What this ticket does not do, and which ticket does. -->

## Decisions

- 2026-11-06: Source: F2 of KA0153
