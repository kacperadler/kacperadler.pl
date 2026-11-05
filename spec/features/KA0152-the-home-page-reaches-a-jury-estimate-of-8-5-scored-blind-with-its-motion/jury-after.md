# kacperadler.pl (after KA0152): jury score

Estimate, not affiliated with Awwwards. **Self-score, not independent**: scored by the worker that built the changes (no subagent in its harness), who has seen the code, `DESIGN.md` and the KA0146 cards, so it is not blind (`jury/SKILL.md` step 4). The deciding score is the separate blind job's. One page (`/`), local production build of the KA0152 branch served by `jury/scripts/serve.mjs`, 2026-11-05. Skill: `juliobsz/skills` at `add880bd6ec9`, read from GitHub, nothing installed into the agent.

**The idea, as read from the screens:** a technical drawing (rulers, datum, title block, dimension lines, numbered cells) holding an AI-automation offer, whose process is a route of detail drawings filled in lime as you scroll down it.
**Critic overall: 7.45** (0.4 × 7.5 + 0.3 × 7.5 + 0.2 × 7.5 + 0.1 × 7.0)
**Jury estimate: about 8.5** (critic + 1.1, the offset measured on two sites in `calibration.md`)
**Band, from the estimate:** Site of the Day range (7.2 and up), on a self-score

## Evidence

- `jury/evidence/`: `shoot.mjs http://127.0.0.1:4400/` (desktop `d-*`, throttled phone `m-*`, reduced motion `r-*`, keyboard `k-*`, hover pairs `h-*`, `report.json`) and `audit.txt` (`audit.mjs --max 10`).
- `jury/*.png`, `jury/frames.json`: the motion recordings, made by `jury/record.mjs` (it says how to run it). Four recordings, each opened fresh: eight frames 250 ms apart through the first-screen entrance (two under reduced motion), then the whole page scrolled top to foot at a fixed step, a frame at each stop. `d-motion` 40 frames and `d-reduced` 20 at 1440×900; `m-motion` 40 and `m-reduced` 20 at 390×844. `frames.json` gives each frame's time from navigation and scroll position.
- `screenshots/before-*.png`, `screenshots/after-*.png`: the full page at 1440 and 390px on the base commit (`e0c7029`) and on this branch.

| Criterion | Score | Evidence |
|---|---|---|
| Design (40%) | 7.5 | `d-01-hero.png`: a poster headline on the datum beside the title block "Rys. KA-001", lime only on the CTA, braces and fills. `d-02`..`d-06`: 88px poster heads, `panel` fields cut by a 1px freehand break line, numbered cells; the rhythm alternates field and ground, content to content one gap. Details designed in one voice: cell selection with grips and width (`h-04-hover`), the brand mark's hard layer (`h-06`), the inline link's lime rising over the word (`h-05`), the footer legend (`d-07`). Not 8: the 404 and inner pages are not in this run. |
| Usability (30%) | 7.5 | `report.json`: mobile LCP 1232 ms on `h1`, CLS 0, 60 fps desktop and throttled phone, no overflow, `hover.noHoverChange` and `colorOnly` empty, `keyboard.invisibleFocus` and `noVisibleFocus` empty, `reduced.hiddenText` 0. Page 9326px at 1440 (before 10967). `keyboard.skipLinkFirst: false` is the script's English regex missing the Polish skip link: `stops[0]` is "Przejdź do treści" (`k-01-focus.png`). Not 8: the phone page is 14033px, long for the hand (`m-*`). |
| Creativity (20%) | 7.5 | `d-motion-01`..`08`: the first screen is drawn in - the header coming down and the headline rising at 261 ms (`01`), then the datum and the title-block frame (`03`), brace and rows (`05`, `06`), trust cells last. `d-motion-26`..`30`: the route fills lime down the rail and each step's detail drawing (schedule under a dimension chain, exploded modules, a revision cloud, a tolerance trace) is drawn in lime as it passes. The concept drives layout, the entrance and the signature moment; it rests at the hero and the process, the other sections stand drawn. |
| Content (10%) | 7.0 | `audit.txt`: 0 FAIL, 0 WARN (no en dashes, no repeated sentence). Cases told as problem, solution and effect with real clients and numbers (`d-03`, `d-04`); each process step ends on an outcome line. Imagery is logos, one portrait and line drawings, no screens of the systems built. |

| Developer | Score | Evidence |
|---|---|---|
| Semantics/SEO | 7.5 | `audit.txt`: 0 FAIL; one `h1`, the same in the served HTML and after JS (`desktop.h1`). |
| Animations/Transitions | 7.5 | `d-motion-01`..`08` and `m-motion-01`..`08`: one entrance, about 1.7 s, transform and opacity and the pen; `d-motion-26`..`30`: scroll-scrubbed rail and drawings; `idleMotion: false`; every primary hover answers with movement (`h-01`..`07`). Not 8: no continuous transition between pages (not in this one-page run). |
| Accessibility | 8.0 | `a11y.serious` 0, no violations; `k-01`..`04` visible rings; `reduced.moving: false`, `hiddenText` 0; `d-reduced-01` and `m-reduced-01` (266 ms and 261 ms after navigation) already show the finished first screen, and the `*-reduced` scroll frames show rail and drawings complete. |
| WPO | 8.0 | `audit.txt`: ~225 KB page, JS 8 KB gz, CSS inlined; mobile LCP 1232 ms throttled, CLS 0, no loader. |
| Responsive | 7.5 | `m-01`..`06`: one column composed for the width, no overflow; `smallTargets`: only the inline link "formularzu" (79×21) in running text. |
| Markup/Meta-data | 7.5 | `audit.txt`: no FAIL; OG image, favicon, alt text present. |

## Fixes, most score first
1. [Usability] `m-*`: the phone page is 14033px; the process cards each carry a full-width drawing and the case cells stack four tall rows - a shorter phone process (drawing beside the title, or smaller) would cut a screen or two.
2. [Creativity] `d-motion-31`..`40`: below the process every section stands drawn; the drawing's marks there (dimension lines, item numbers) never answer the scroll, so the idea reads strongest in the first half.
3. [Content] `d-03`, `d-04`: the cases show logos only; a drawn detail of the system built (as the process steps have) would make them as specific as the process.

## Measured
Desktop LCP 84 ms (`h1`), mobile LCP 1232 ms (`h1`), CLS 0; loader none; settled 2246 ms desktop, 4151 ms phone; scroll 60 fps (worst frame 17 ms) on both; serious axe violations 0; overflow none; `noHoverChange` 0; `colorOnly` 0; idle motion none; reduced motion: nothing moving, hidden text 0; audit 0 FAIL, 0 WARN. Page height 9326px desktop (before 10967), 14033px phone (before 14566).

Lighthouse 12 mobile, three runs on this build (`chrome-headless-shell` 156 from Playwright, `dist/client` served locally): Performance 95, 95, 95 (median 95); Accessibility, Best Practices, SEO 100 in every run; FCP 1.7-1.8 s, LCP 2.7 s, TBT 20 ms, CLS 0. The base commit `e0c7029` measured on the same host the same way: 95, 95, 96.

Motion is scored from the frames above, not felt: how it feels in a browser is not scored.
