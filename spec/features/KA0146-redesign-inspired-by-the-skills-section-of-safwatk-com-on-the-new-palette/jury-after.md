# kacperadler.pl (after KA0146): jury score

Estimate, not affiliated with Awwwards. **Self-score, not independent**: scored by the worker that built the redesign (no subagent in its harness), so it is not blind (`jury/SKILL.md` step 4); it also saw the before card, which the skill's re-score rule forbids for a fresh critic. One page (`/`), local production build of the KA0146 branch (band classes apart from the form fields, the owner's outcome lines for all five steps, CSS inlined into the HTML) served by `jury/scripts/serve.mjs`, 2026-11-05. Skill: `juliobsz/skills` at `add880bd6ec9`.

**The idea, as read from the screens:** a technical drawing whose process is a route of detail drawings, the sections cut out of the sheet as darker-blue views.
**Critic overall: 6.9** (0.4 × 7.0 + 0.3 × 7.0 + 0.2 × 6.5 + 0.1 × 6.5 = 6.85)
**Jury estimate: about 8.0** (critic + 1.1, the offset measured on two sites in `calibration.md`)
**Band, from the estimate:** Site of the Day range (7.2 and up), on a self-score

| Criterion | Score | Evidence |
|---|---|---|
| Design (40%) | 7.0 | `d-02-scroll.png`, `d-05-scroll.png`: `panel` bands opened and closed by a 1px break line give the page chapters; poster heads at 88px carry each section. The drawing system holds from hero to footer; the contact form keeps its own fields on `base`. |
| Usability (30%) | 7.0 | `report.json`: mobile LCP 1236 ms on `h1` (before: 1612 ms), CLS 0, no overflow, 60 fps. The page is taller than before (10967 px against 8342 px at 1440px), mostly the process; every section still ends at a CTA. `noHoverChange`: 1 (brand link). |
| Creativity (20%) | 6.5 | `m-04-scroll.png`: each step opens on its own drafted detail (exploded modules with the delivered two in lime, a schedule under a dimension chain), drawn in along the rail; specific to the offer, not stock icons. |
| Content (10%) | 6.5 | Every step ends on a concrete outcome line (all five in the owner's words); audit: 11 en dashes, two repeated case sentences. |

| Developer | Score | Evidence |
|---|---|---|
| Semantics/SEO | 7.5 | `audit.txt`: 0 FAIL; one `h1`; drawings `aria-hidden`. |
| Animations/Transitions | 7.0 | `idleMotion: false`, `reduced.moving: false`; the second scroll-tied motion (drawings' lime layer) follows the rail. |
| Accessibility | 7.5 | `a11y.serious: 0`, no violations on the `panel` bands; focus rings visible (`k-01..04-focus.png`). |
| WPO | 8.0 | `audit.txt`: ~225 KB page, HTML 26 KB gz with the CSS inlined (no stylesheet request), JS 8 KB gz; mobile LCP 1236 ms throttled. |
| Responsive | 7.0 | `m-01..06`: one column, drawings scale with fixed strokes, no overflow. |
| Markup/Meta-data | 7.0 | `audit.txt`: no FAIL. |

## Fixes, most score first
1. [Usability] The process section is about twice as tall as before; smaller drawings or a tighter stagger would shorten the page (F2).
2. [Content] `audit.txt`: two case sentences repeat verbatim; en dashes in ranges.
3. [Usability] `h-03`: the brand link shows no hover change.

## Measured
Mobile LCP 1236 ms (`h1`), CLS 0; desktop LCP 112 ms; loader none; scroll 60 fps (worst frame 17 ms); serious axe violations 0; overflow none; `noHoverChange` 1; idle motion none; reduced motion: nothing moving; audit 0 FAIL, 3 WARN. Page height 10967 px desktop, 14566 px mobile.

Not scored: anything stills can't show (how motion feels, sound).
