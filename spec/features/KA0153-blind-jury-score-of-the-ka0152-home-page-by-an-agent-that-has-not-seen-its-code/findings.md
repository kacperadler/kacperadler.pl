# KA0153 - Findings

What was discovered while doing this ticket but is not part of it: bugs, risks, gaps, and suggested changes. Workers add entries on their branch; the merge adds the passed review's notes of kind security, bug or risk. One entry per finding, numbered, never deleted: only its Status changes.

A finding ends in one of four statuses: `fixed in <commit>` (the branch fixed it), `ticket <id>` (a planning ticket carries it), `deferred (client summary)` (it goes to the client in a summary, not on the board), or `dropped (<reason>)`. `open` lives only until the merge, which settles every `Status: open` entry as the project's findings mode says: a planning ticket each (the default), one planning ticket for all of them, or `deferred (client summary)`.

## F1. A blind jury job in this repository is not fully blind: the harness preloads AGENTS.md

- Kind: chore
- Found by: 2026-11-05-worker-9fce7ca4 (worker), 2026-11-05
- Where: the job harness's context loading; `AGENTS.md` at the worktree root
- What: KA0153 forbids opening `AGENTS.md`, but the harness put its full text into this job's context before the task began (the "repo-rules" block). That text describes the intended design in detail (the blueprint concept, the first-screen entry, the palette, the process drawings), which is exactly what the jury skill's "Why blind" section says the critic must not see. This job never opened the file and cites only screenshots, frames and report fields, but it cannot claim it never saw the intent. Any later blind re-score (KA-D13 asks for a new agent each time) has the same leak.
- Suggestion: run blind-critic jobs without repository context files: from a scratch folder holding only the evidence (`jury/shots`, `jury/audit.txt`, `jury/motion`), or with a harness option that skips `AGENTS.md` for a role. Shooting can stay in the worktree; only the scoring step needs isolation. Out: changing what `AGENTS.md` says.
- Status: open

## F2. jury skill's `skipLinkFirst` misses a non-English skip link

- Kind: fix
- Found by: 2026-11-05-worker-9fce7ca4 (worker), 2026-11-05
- Where: https://github.com/juliobsz/skills `jury/scripts/shoot.mjs:259` at `add880bd6ec9`
- What: `skipLinkFirst` tests `/skip|#main|#content/i` against the first stop's label, which is its `innerText` ("Przejdź do treści"), not its href. The home page's first Tab stop is the skip link (`jury/shots/home/k-01-focus.png`), yet `report.json` says `skipLinkFirst: false` on every page. A critic that trusts the field scores Accessibility a point low; this card read the frame instead.
- Suggestion: in the skill, test the first stop's `href` (an in-page `#` target whose element is `main` or contains the page's h1) instead of, or besides, the label. Upstream change, outside this repository; until then, a card for this site reads `k-01-focus`.
- Status: open

## F3. Jury evidence adds about 29 MB of PNG to the repository per scoring run

- Kind: chore
- Found by: 2026-11-05-worker-9fce7ca4 (worker), 2026-11-05
- Where: `spec/features/KA0153-blind-jury-score-of-the-ka0152-home-page-by-an-agent-that-has-not-seen-its-code/jury/` (`du -sh jury`: 29M; shots 9.9M, motion 19M)
- What: the ticket asks for the frames as PNG in the ticket folder, so they are committed. Every re-score (KA-D13 wants a fresh critic each time) adds another run of the same size to the git history for good.
- Suggestion: keep only the frames a card cites in git (or downscale the 1440 frames to 720 wide), and keep the full runs as a CI artifact or in Git LFS. Out: deleting this run's evidence, which this card cites.
- Status: open
