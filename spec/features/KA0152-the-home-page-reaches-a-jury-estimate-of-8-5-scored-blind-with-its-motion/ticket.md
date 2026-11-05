# KA0152 - The home page reaches a jury estimate of 8.5, scored blind with its motion

```json
{
  "id": "KA0152",
  "title": "The home page reaches a jury estimate of 8.5, scored blind with its motion",
  "date": "2026-11-05"
}
```

## Description

The owner, 2026-11-05, after KA0146: "we need at least 8.5 so do what we need to have that 8.5 ... the score check the animations too? also remember about accessibility". KA0146 took the home page from a jury estimate of about 7.5 to about 8.0 (critic 6.5 to 6.9, `spec/features/KA0146-redesign-inspired-by-the-skills-section-of-safwatk-com-on-the-new-palette/jury-before.md` and `jury-after.md`), but that score was a self-score by the worker that built it, and the jury skill judges motion only from stills ("Not scored: anything stills can't show (how motion feels, sound)").

Its ranked fixes: (1) the process section is about twice as tall as before (10967 px against 8342 px at 1440 px; KA0151, folded in here); (2) two case sentences repeat verbatim, en dashes in ranges; (3) the brand link shows no hover change. Its weakest criteria: Creativity 6.5, Content 6.5, Design 7.0, Usability 7.0.

## Goal

The home page scores a jury estimate of 8.5 or more (critic overall 7.4 or more, the skill's estimate being critic + 1.1), from a critic that never saw the code nor the earlier cards, with motion judged from a recording, while every bar of `spec/vision.md` holds, accessibility first.

Method: the `awwwards` and `jury` skills of https://github.com/juliobsz/skills at commit `add880bd6ec9`, read from GitHub at that commit, nothing installed into the agent, as in KA0146. Where the skill conflicts with a bar below, the bar wins.

Bars that hold: dark-only; Lighthouse mobile Performance 95 or more, Accessibility, Best Practices and SEO 100; axe zero violations; every focus visible and every control reachable by keyboard; text contrast 4.5:1 or more; content visible and links working without JavaScript; `prefers-reduced-motion` turns off every motion that is not a state change; nothing always moving in the foreground; no React or another islands framework; no Tailwind; no new runtime dependency; Polish copy only, and no new claim, number, client or result that the page does not already state (the owner supplies facts).

- Kind: ux

## Done means

- Motion is scored, not only stills: a recording of a slow scroll of the whole home page at 1440 px and at 390 px (Playwright `recordVideo` or a frame series at a fixed step), and the same with reduced motion on, kept in this folder's `jury/` (frames as PNG, at most 40 per recording). The critic sees these frames and scores Animations/Transitions from them, naming the frames it judged by.
- The page is changed by the jury's ranked fixes, highest gain first, until the worker's own score reaches critic 7.4; KA0151's problem (the process section's height) is fixed: the page at 1440 px is no taller than 9500 px.
- `jury-after.md` in this folder: the card for the final build, its evidence and the motion frames; it says it is a self-score.
- Accessibility: axe zero violations at 1440 and 390 px and with reduced motion, every interactive element shows a visible focus, keyboard order follows the page, and a test in the e2e suite fails when a focus ring or a reduced-motion fallback is removed.
- Lighthouse mobile on the built page, median of 3 runs: Performance 95 or more, the other three 100 (if Lighthouse cannot run in the job, say so; the coordinator measures it).
- Screenshots before and after at 1440 px and 390 px in this folder.
- The project's checks (`npm run check`, `npm run lint`, `npm run build`) and its e2e suite pass.
- The owner sees the branch on a preview before the merge; a blind jury score by a separate job, which has not seen the code or these cards, is 8.5 or more before the merge.

## Scope

In:
- The home page and the components and styles it uses, its SVG drawings, `DESIGN.md`, the e2e specs of the home page, this folder.

Out:
- The palette (KA0145), case study pages and the blog (KA0029 to KA0035), the leads store.

## Decisions
- 2026-11-05: KA0152 starts now: home page to jury 8.5+, blind score with motion, accessibility kept, preview before merge; the owner: "tbh, we need at least 8.5 so do what we need to have that 8.5, and run this so i can open in my browser, and the score check the animations too? also remember about accessibility" (KA-D12)
