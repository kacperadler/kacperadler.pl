# KA0164 - Jury evidence adds about 29 MB of PNG to the repository per scoring run

```json
{
  "id": "KA0164",
  "title": "Jury evidence adds about 29 MB of PNG to the repository per scoring run",
  "date": "2026-11-06"
}
```

## Description

F3 of KA0153 (spec/features/KA0153-blind-jury-score-of-the-ka0152-home-page-by-an-agent-that-has-not-seen-its-code/findings.md).

- Kind: chore
- Found by: 2026-11-05-worker-9fce7ca4 (worker), 2026-11-05
- Where: `spec/features/KA0153-blind-jury-score-of-the-ka0152-home-page-by-an-agent-that-has-not-seen-its-code/jury/` (`du -sh jury`: 29M; shots 9.9M, motion 19M)
- What: the ticket asks for the frames as PNG in the ticket folder, so they are committed. Every re-score (KA-D13 wants a fresh critic each time) adds another run of the same size to the git history for good.
- Suggestion: keep only the frames a card cites in git (or downscale the 1440 frames to 720 wide), and keep the full runs as a CI artifact or in Git LFS. Out: deleting this run's evidence, which this card cites.

## Goal

<!-- What we are after, what it moves in spec/vision.md, and the evidence (file:line, a command and its output). -->

- Kind: chore

## Done means

<!-- Each observable result, and the test that proves it; the project's checks pass. -->

## Scope

In:
<!-- - `path/to/file.ts`: what changes there. -->

Out:
<!-- - What this ticket does not do, and which ticket does. -->

## Decisions

- 2026-11-06: Source: F3 of KA0153
