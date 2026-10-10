# KA0011 - Claude Code may no longer load the agent conventions

```json
{
  "id": "KA0011",
  "title": "Claude Code may no longer load the agent conventions",
  "date": "2026-10-10"
}
```

## Description

[INFERENCE] The repository keeps a `.claude/` config, so Kacper may run Claude Code here directly. Claude Code loads `CLAUDE.md` into context; whether it also loads `AGENTS.md` was not checked. If it does not, a session started outside the harness works without the conventions.

## Goal

What we are after, what it moves in `spec/vision.md`, and the evidence (file:line, a command and its output). A mechanical, fully specified change (a rename, a moved section, a list of exact edits) adds `- Model: haiku` under Kind; anything with behaviour to judge has no Model line.

- Kind: risk

Evidence:
- `AGENTS.md` (was `CLAUDE.md`), `.claude/settings.json`
- Found by: 2026-10-10-docs-and-agents-md-508a76bc (worker), 2026-10-10

## Done means

- The fix, with a test that proves it: Kacper decides whether a one-line `CLAUDE.md` containing `@AGENTS.md` (an import, not a second copy) is wanted; KA0002 removed `CLAUDE.md` as the ticket asks.
- `npm test` and `npm run check` pass. The structure test holds.

## Scope

In:
- Kacper decides whether a one-line `CLAUDE.md` containing `@AGENTS.md` (an import, not a second copy) is wanted; KA0002 removed `CLAUDE.md` as the ticket asks.

## Decisions

- 2026-10-10: Source: F4 of KA0002
- 2026-10-10: The human dropped it: AGENTS.md only, no CLAUDE.md (Claude Code reads AGENTS.md; agents run through omp).
