# KA0046 - Lighthouse never re-run on the production domain

```json
{
  "id": "KA0046",
  "title": "Lighthouse never re-run on the production domain",
  "date": "2026-10-10"
}
```

## Description

the plan's last open checks were a Lighthouse mobile run against `https://kacperadler.pl` after the Dokploy deploy and a test on real phones. The only recorded 100/100/100/100 is from localhost. No ticket carries these checks, and `spec/vision.md` `## What stays true` asks for Performance at least 95 and 100 elsewhere.

## Goal

What we are after, what it moves in `spec/vision.md`, and the evidence (file:line, a command and its output). A mechanical, fully specified change (a rename, a moved section, a list of exact edits) adds `- Model: haiku` under Kind; anything with behaviour to judge has no Model line.

- Kind: risk

Evidence:
- deleted `project-plan.md` (Faza 8 "Post-deploy Lighthouse re-run", section 9 "Definicja done": CLS < 0.05, LCP < 2s, INP < 200ms, test on a real iOS Safari / Android Chrome device, all unchecked); `spec/vision.md:11`
- Found by: 2026-10-10-drop-project-plan-new-re-c8398883 (worker), 2026-10-10

## Done means

- The fix, with a test that proves it: run Lighthouse mobile against the production URL and on a real iOS and Android device, record the scores and Web Vitals in the ticket, and open tickets for whatever misses the vision. Adding Lighthouse to CI stays out unless the human asks.
- `npm test` and `npm run check` pass. The structure test holds.

## Scope

In:
- run Lighthouse mobile against the production URL and on a real iOS and Android device, record the scores and Web Vitals in the ticket, and open tickets for whatever misses the vision. Adding Lighthouse to CI stays out unless the human asks.

## Decisions

- 2026-10-10: Source: F1 of KA0025
- 2026-10-10: Waits until after the redesign; it measures the live site, which the redesign changes.
- 2026-10-14: The human: skip for now.
- 2026-10-14: The human: still on hold (evening).
