# KA0153 - Blind jury score of the KA0152 home page, by an agent that has not seen its code or earlier scores

```json
{
  "id": "KA0153",
  "title": "Blind jury score of the KA0152 home page, by an agent that has not seen its code or earlier scores",
  "date": "2026-11-05"
}
```

## Description

The owner, 2026-11-05: "to check the score use new agent, not the same one" (KA-D13). KA0152 must reach a jury estimate of 8.5 or more, and the deciding score comes from an agent that never saw the site's code nor any earlier score. The KA0152 build runs on a preview at http://100.76.234.51:4322/ (the branch `arthur/2026-11-05-worker-e334f830`).

## Goal

A blind jury card of the home page at http://100.76.234.51:4322/, with motion judged from recordings this job makes itself.

Method: the `jury` skill of https://github.com/juliobsz/skills at commit `add880bd6ec9` (`jury/SKILL.md` and the references and scripts it names), read and fetched from GitHub at that commit into a folder outside this repository (for example a temporary folder), nothing installed into the agent. You are the fresh critic the skill asks for.

Blind means, and this is the point of the ticket: do not open `src/`, `tests/`, `DESIGN.md`, `AGENTS.md`, any `jury*.md`, any `plan.md`, `findings.md` or `review-*.md`, or any folder under `spec/features/` other than this ticket's own, and do not read `git log` or diffs. The page as served is the only evidence.

- Kind: test

## Done means

- The skill's shoot run on http://100.76.234.51:4322/ (desktop, throttled phone, reduced motion, focus, hover), its audit, and the critic's scores with the evidence named per criterion, as the skill's card asks.
- Motion: a slow scroll of the whole page at 1440 px and at 390 px, and the same with reduced motion on, recorded by this job (Playwright `recordVideo` or a frame series at a fixed step), at most 40 frames per recording kept as PNG in this folder's `jury/`; Animations/Transitions scored from them, naming the frames.
- `jury.md` in this folder: the card, the critic overall, the jury estimate from the skill's own calibration offset, the band, and the ranked fixes. The first line of the final message gives the critic overall and the estimate.
- Nothing outside this folder changes.

## Scope

In:
- This ticket's folder.

Out:
- Any change to the site: KA0152.

## Decisions
- 2026-11-05: KA0153 starts: a new agent scores the KA0152 page blind, as the owner asked in KA-D13; the owner: "ok, to check the score use new agent, not the same one" (KA-D15)
