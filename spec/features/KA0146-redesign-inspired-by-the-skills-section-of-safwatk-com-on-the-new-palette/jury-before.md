# kacperadler.pl (before KA0146): jury score

Estimate, not affiliated with Awwwards. **Self-score, not independent**: scored by the worker that then built the redesign (no subagent in its harness), so it is not blind (`jury/SKILL.md` step 4). One page (`/`), local production build of `585802e` served by `jury/scripts/serve.mjs`, 2026-11-05. Skill: `juliobsz/skills` at `add880bd6ec9`.

**The idea, as read from the screens:** an engineer's technical drawing (rulers, a datum, a title block, dimension lines) holding an AI-automation offer.
**Critic overall: 6.5** (0.4 × 6.5 + 0.3 × 7.0 + 0.2 × 5.5 + 0.1 × 6.5 = 6.45)
**Jury estimate: about 7.5** (critic + 1.1, the offset measured on two sites in `calibration.md`)
**Band, from the estimate:** Site of the Day range (7.2 and up), on a self-score

| Criterion | Score | Evidence |
|---|---|---|
| Design (40%) | 6.5 | `d-01-hero.png`: heavy Geist headline, title-block card, lime accent, a coherent drawing system. `d-05-scroll.png`: below the hero every section is the same `base` ground and the same 32-54px head, so the page reads as one long sheet without chapters. |
| Usability (30%) | 7.0 | `report.json`: mobile LCP 1612 ms on `h1`, CLS 0, no horizontal overflow, 60 fps scroll; clear CTA in every section (`d-05-scroll.png`). `hover.noHoverChange`: 4 targets (send button, hero CTA, LinkedIn, brand). |
| Creativity (20%) | 5.5 | The drawing metaphor lives in the hero; the process (`d-05-scroll.png`) is plain cards with stock icons on a rail. |
| Content (10%) | 6.5 | Direct Polish copy with concrete numbers (`d-01-hero.png`); audit: 11 en dashes, two repeated case sentences. |

| Developer | Score | Evidence |
|---|---|---|
| Semantics/SEO | 7.5 | `audit.txt`: 0 FAIL; one `h1`; title and description set. |
| Animations/Transitions | 6.5 | `report.json`: `idleMotion: false`, `reduced.moving: false`; one entrance on load, the scroll-filled rail. |
| Accessibility | 7.5 | `a11y.serious: 0`, no violations; focus rings visible (`k-01..04-focus.png`). |
| WPO | 7.5 | ~225 KB page, JS 8 KB gz; mobile LCP 1612 ms throttled. |
| Responsive | 7.0 | `m-01..06`: one column, no overflow. |
| Markup/Meta-data | 7.0 | `audit.txt`: no FAIL. |

## Fixes, most score first
1. [Creativity] `d-05-scroll.png`: the process is the offer's story but is the plainest part; give each step its own drawn detail and result.
2. [Design] `d-05-scroll.png`: every section on one ground under one head size; separate chapters with colour and a larger head.
3. [Content] `audit.txt`: two case sentences repeat verbatim; en dashes in ranges.

## Measured
Mobile LCP 1612 ms (`h1`), CLS 0; desktop LCP 88 ms; loader none; scroll 60 fps (worst frame 17 ms); serious axe violations 0; overflow none; `noHoverChange` 4; idle motion none; reduced motion: nothing moving; audit 0 FAIL, 3 WARN. Page height 8342 px desktop, 12729 px mobile.

Not scored: anything stills can't show (how motion feels, sound).
