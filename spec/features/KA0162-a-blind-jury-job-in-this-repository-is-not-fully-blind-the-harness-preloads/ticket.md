# KA0162 - A blind jury job in this repository is not fully blind: the harness preloads AGENTS.md

```json
{
  "id": "KA0162",
  "title": "A blind jury job in this repository is not fully blind: the harness preloads AGENTS.md",
  "date": "2026-11-06"
}
```

## Description

F1 of KA0153 (spec/features/KA0153-blind-jury-score-of-the-ka0152-home-page-by-an-agent-that-has-not-seen-its-code/findings.md).

- Kind: chore
- Found by: 2026-11-05-worker-9fce7ca4 (worker), 2026-11-05
- Where: the job harness's context loading; `AGENTS.md` at the worktree root
- What: KA0153 forbids opening `AGENTS.md`, but the harness put its full text into this job's context before the task began (the "repo-rules" block). That text describes the intended design in detail (the blueprint concept, the first-screen entry, the palette, the process drawings), which is exactly what the jury skill's "Why blind" section says the critic must not see. This job never opened the file and cites only screenshots, frames and report fields, but it cannot claim it never saw the intent. Any later blind re-score (KA-D13 asks for a new agent each time) has the same leak.
- Suggestion: run blind-critic jobs without repository context files: from a scratch folder holding only the evidence (`jury/shots`, `jury/audit.txt`, `jury/motion`), or with a harness option that skips `AGENTS.md` for a role. Shooting can stay in the worktree; only the scoring step needs isolation. Out: changing what `AGENTS.md` says.

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

- 2026-11-06: Source: F1 of KA0153
