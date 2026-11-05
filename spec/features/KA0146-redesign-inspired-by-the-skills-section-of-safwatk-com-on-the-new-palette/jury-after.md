# kacperadler.pl (after KA0146): jury score

Estimate, not affiliated with Awwwards. **Self-score, not independent**: scored by the worker that built the redesign (no subagent in its harness), so it is not blind (`jury/SKILL.md` step 4); it also saw the before card, which the skill's re-score rule forbids for a fresh critic. One page (`/`), local production build of the KA0146 branch served by `jury/scripts/serve.mjs`, 2026-11-05. Skill: `juliobsz/skills` at `add880bd6ec9`. The page still carries the two placeholder outcome lines of steps 04 and 05.

**The idea, as read from the screens:** a technical drawing whose process is a route of detail drawings, the sections cut out of the sheet as darker-blue views.
**Critic overall: 6.7** (0.4 × 7.0 + 0.3 × 6.8 + 0.2 × 6.5 + 0.1 × 5.5 = 6.69)
**Jury estimate: about 7.8** (critic + 1.1, the offset measured on two sites in `calibration.md`)
**Band, from the estimate:** Site of the Day range (7.2 and up), on a self-score

| Criterion | Score | Evidence |
|---|---|---|
| Design (40%) | 7.0 | `d-02-scroll.png`, `d-05-scroll.png`: `panel` fields opened and closed by a 1px break line give the page chapters; poster heads at 88px carry each section. The drawing system holds from hero to footer. |
| Usability (30%) | 6.8 | `report.json`: mobile LCP 1708 ms on `h1`, CLS 0, no overflow, 60 fps. The page grew to 11807 px (desktop) from 8342 px, mostly the process (cards with drawings, 280px stagger), so reaching contact takes longer; every section still ends at a CTA. `noHoverChange`: 1 (brand link). |
| Creativity (20%) | 6.5 | `m-04-scroll.png`: each step opens on its own drafted detail (exploded modules with the delivered two in lime, a schedule under a dimension chain), drawn in along the rail; specific to the offer, not stock icons. |
| Content (10%) | 5.5 | Outcome lines make each step concrete, but steps 04 and 05 show `[DO UZUPEŁNIENIA ...]` placeholders on the page; audit: 11 en dashes, two repeated case sentences. |

| Developer | Score | Evidence |
|---|---|---|
| Semantics/SEO | 7.5 | `audit.txt`: 0 FAIL; one `h1`; drawings `aria-hidden`. |
| Animations/Transitions | 7.0 | `idleMotion: false`, `reduced.moving: false`; the second scroll-tied motion (drawings' lime layer) follows the rail. |
| Accessibility | 7.5 | `a11y.serious: 0`, no violations on `panel` fields; focus rings visible (`k-01..04-focus.png`). |
| WPO | 7.5 | ~226 KB page, JS 8 KB gz, CSS 14 KB gz; mobile LCP 1708 ms throttled. |
| Responsive | 7.0 | `m-01..06`: one column, drawings scale with fixed strokes, no overflow. |
| Markup/Meta-data | 7.0 | `audit.txt`: no FAIL. |

## Fixes, most score first
1. [Content] Process steps 04 and 05: replace the placeholders with Kacper's words (they must not ship).
2. [Usability] The process section is about twice as tall as before; smaller drawings or a tighter stagger would shorten the page.
3. [Content] `audit.txt`: two case sentences repeat verbatim; en dashes in ranges.

## Measured
Mobile LCP 1708 ms (`h1`), CLS 0; desktop LCP 80 ms; loader none; scroll 60 fps (worst frame 17 ms); serious axe violations 0; overflow none; `noHoverChange` 1; idle motion none; reduced motion: nothing moving; audit 0 FAIL, 3 WARN. Page height 11807 px desktop, 15318 px mobile.

Not scored: anything stills can't show (how motion feels, sound).
