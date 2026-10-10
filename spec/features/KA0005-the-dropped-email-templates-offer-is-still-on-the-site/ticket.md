# KA0005 - The dropped email-templates offer is still on the site

```json
{
  "id": "KA0005",
  "title": "The dropped email-templates offer is still on the site",
  "date": "2026-10-10"
}
```

## Description

Kacper dropped email templates from the offer (KA0001 answers, question 1), but the services collection still publishes "Szablony email" (order 6), so it renders in the services section.

## Goal

What we are after, what it moves in `spec/vision.md`, and the evidence (file:line, a command and its output). A mechanical, fully specified change (a rename, a moved section, a list of exact edits) adds `- Model: haiku` under Kind; anything with behaviour to judge has no Model line.

- Kind: improvement

Evidence:
- `src/content/services/email-templates.json`
- Found by: 2026-10-10-onboard-kacperadler-pl-6c85f5ea (worker), 2026-10-10

## Done means

- The fix, with a test that proves it: remove the entry and check the services grid layout still holds with five items; the new offer (AI agents, automation, Claude Code / Codex training) is its own ticket.
- `npm test` and `npm run check` pass. The structure test holds.

## Scope

In:
- remove the entry and check the services grid layout still holds with five items; the new offer (AI agents, automation, Claude Code / Codex training) is its own ticket.

## Decisions

- 2026-10-10: Source: F2 of KA0001
