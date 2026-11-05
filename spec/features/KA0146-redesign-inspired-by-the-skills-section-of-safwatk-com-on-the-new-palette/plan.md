# KA0146 - Plan

- Job: 2026-11-05-plan-b4732c63
- Planned at: 40b3909de579bcdd616b068f02214efa84952c00

## Approach

The page stays Kacper's engineering drawing (Rys. KA-001). Three things change, all taken from drafting conventions and none from safwatk.com:

1. **The process section becomes the page's signature.** It keeps its five steps on the scroll-filled dash-dot rail (`step-marker.astro`).
   - Each step card gets a line drawing at its top, in the existing `image` slot of `card.astro`.
   - Each card gets an outcome line under a hairline. The line starts with the lime arrow that the problems cards already use.
   - As the rail fills past a step, the lime layer of that step's drawing is drawn in. Scrolling drives it, so it never plays on its own.
2. **The home page's section headings get bigger.** A new `poster` prop on `section-head.astro` puts the headline on its own full-width row at 40px (390px phone) up to 88px (1160px container), weight 850. The lede sits under it in the right column.
3. **More colour per section, while the page stays dark.** Problems, Cases and About sit on a full-width field in `panel` (`#0a2350`). Each field opens and closes with a wavy edge drawn as the freehand break line of technical drawing (linia urwania): 1px `ink` stroke over the field colour. The wave keeps the same wavelength at every width.

**Left alone:**
- Hero, trust bar, header, footer and the EU band.
- The entrance animation, forms and contact behaviour.
- All copy outside the process section.
- The palette tokens and the True Blue = state rule.
- Legal pages, case study pages and the 404. `poster` is opt-in, so their `SectionHead` stays as it is.

**New dependencies: none.**
- **gsap:** not wanted. The one scroll-driven motion is CSS (view timelines, already used by the rail). The skill's engine would add a JS ticker and a second motion system, against the styleguide's "CSS and the platform before a new dependency".
- **lenis:** not wanted. Smooth-scroll libraries take over wheel input, which the skill itself lists under "scroll-jacking". It would also fight `scroll-padding` and the reduced-motion bar.
- **ogl:** not wanted. There is no WebGL, because of the Performance 95 bar on a throttled phone and the vision's "no always-on foreground animation".

**Concepts (awwwards skill, Phase 1).** Scores are Originality / Fit / Feasibility / Portability, where a lower Portability is better.

| | Idea | Anchor | Signature | O/F/Fe/P |
|---|---|---|---|---|
| A. How he works (process) | **Karta technologiczna**: the site is his drawing sheet. The process is its route of five operations, each a detail drawing of what it produces. Section bands are views cut out of the sheet by freehand break lines. | He maps and automates a company's process; the site is already his drawing KA-001 (KA0098) | as the route fills past a station, that station's drawing is drawn in lime | 4 / 5 / 5 / 2 |
| B. Material of the profession | **Workflow canvas**: sections are nodes of an automation, and the process is one run. A data packet travels the edges and each node reports its output. | He builds automations and AI agents | a packet runs along the path with scroll; nodes report "OK" | 3 / 4 / 4 / 4 |
| C. Name | **Adler = eagle, z lotu ptaka**: the page zooms from a bird's-eye map of the company down to each step. The wavy edges are contour lines. | The surname | a scroll-scrubbed zoom from map to detail | 3 / 2 / 3 / 2 |

**Picked: A.** It grows out of the drawing the owner already chose, takes the path and the wavy edges from real drafting marks rather than decoration, and runs entirely on CSS under the vision's bars. One detail is taken from B: each step's output ("→ …") is shown as the operation's result.

**Concept card**, which the worker writes into `DESIGN.md`:
- **Idea:** the site is Kacper's technical drawing, and his process is its route.
- **Metaphor:** a process sheet (karta technologiczna) with detail views.
- **Signature:** the route fills, and each station's detail drawing is drawn in lime.
- **Emotion:** precise and calm; someone has this under control.
- **Motion verb:** drawn by a pen, along the route.
- **Screenshot:** a process card with the rail lit up to it and its revision cloud drawn in lime.
- **Genericness test:** a generic model would land on soft blob waves, pastel illustrated scenes and parallax. This plan instead uses:
  - a 1px drafting break line for the wave;
  - line drawings built from drafting marks (callout boxes, dimension chains, a revision cloud, a tolerance band);
  - square cells everywhere else;
  - colour from the palette's own dark steps;
  - no parallax.

**Home page sections, before and after:**

| Section | Before | After |
|---|---|---|
| Hero | headline, subtitle, two buttons beside the title-block card, entrance animation | unchanged (it is the LCP element and carries the entrance) |
| Trust | logo strip on `base` | unchanged |
| §01 Problem | `base`; heading 32-54px in two columns; six cells | `panel` field with break-line edges top and bottom; `poster` heading; cells unchanged |
| §02 Oferta | `base`; two-column heading; 3 cells plus the wide cell | `base`; `poster` heading |
| §03 Realizacje | `base`; 2×2 cases | `panel` field with edges; `poster` heading |
| §04 Proces | staggered cards round a central rail; lucide icon, title, duration, description | `base`; `poster` heading plus a new lede; each card: drawing on top, then title and duration, description, then the outcome line; same rail, stagger and button |
| §05 O mnie | `base`; photo and text; accordion | `panel` field with edges; `poster` heading |
| §06 FAQ | `base` | `base`; `poster` heading |
| §07 Kontakt | `base`; form | `base`; `poster` heading; form unchanged (a `panel` field would make the field fills equal the disabled state) |

Section spacing: a `panel` section keeps `margin-top: var(--mb-section-gap)` and adds `padding-block: var(--mb-section-gap)`. The fields therefore read as chapters with more air, while the `base` sections keep today's rhythm.

**Process section, wireframe:**
```
1440: § 04 / PROCES ──────────── 1128 ────────────
      Od rozmowy do działającego systemu.            (40→88px, full width)
                              [lede, right column]
      ┌ card 01 ───────────────┐
      │ [drawing, lime layer]  ├─[01]
      │ Rozmowa       ~30 MIN  │  ┆   ┌ card 02 ──────────────┐
      │ description            │  ┆[02]┤ [drawing]             │
      │ ─────────              │  ┆   │ Plan i wycena  2–3 DNI │
      │ → outcome              │  ┆   │ …                     │
      └────────────────────────┘  ┆   └───────────────────────┘
 390: rail on the left, one column: [mark] card (drawing on top) …, cards 40px apart
```

**Process copy.** "Proposal" means new copy for the owner to approve. Placeholders must be replaced by Kacper before merge.

| # | Title | Duration | Description | Outcome line (new) |
|---|---|---|---|---|
| 01 | Rozmowa | ~30 min | unchanged | Proposal: "Pierwszy pomysł na automatyzację w 24 h." (the hero's own fact) |
| 02 | Plan i wycena | 2–3 dni | unchanged | Proposal: "Dokument z zakresem, terminem i ceną." |
| 03 | Wdrożenie etapami | co tydzień | unchanged | Proposal: "Kolejna działająca część systemu do sprawdzenia." |
| 04 | Feedback | na bieżąco | unchanged | [DO UZUPEŁNIENIA - Kacper: co klient dostaje po zgłoszeniu uwag, np. w jakim czasie zmiana trafia do systemu] |
| 05 | Opieka | po wdrożeniu | unchanged | [DO UZUPEŁNIENIA - Kacper: co obejmuje opieka, np. co monitorujesz i jak często klient dostaje raport] |

Lede (proposal): "Pięć kroków. Na każdym wiesz, co robimy i co z niego dostajesz."

**Illustrations to draw.** All are inline SVG, hand-drawn for this site, `aria-hidden` (the text carries the meaning). Each has a 1px `ink` layer and a 2px `lime` layer, square corners except where noted, and a fixed `viewBox` so nothing shifts on load.
1. **Rozmowa:** three process boxes joined by arrows (today's process) and two square callout boxes on leaders (the questions). Lime: a dimension brace under the middle box with a lime callout square (what to automate).
2. **Plan i wycena:** a sheet with a small title-block corner and a schedule of 3-4 bars of different lengths. Lime: the dimension chain over the bars (order and total).
3. **Wdrożenie etapami:** an exploded stack of four modules. Lime: the first two modules filled (delivered).
4. **Feedback:** a drawing fragment. Lime: a revision cloud round one part plus a revision triangle (the drafting mark for a change; the cloud's arcs are the figure's one curve).
5. **Opieka:** a trace on a small grid between two dashed tolerance lines. Lime: the trace, staying inside the band and ending in a square mark.
6. **Break line:** one irregular freehand wave tile (about 240×16px) that repeats seamlessly. It is used as a mask for both the field fill and the 1px `ink` stroke.

**Every motion, with its reduced-motion fallback:**
1. **First-screen entrance** (`header.astro`, `hero.astro`, `trust.astro`): unchanged. Under reduced motion, without JS and after a ClientRouter swap, nothing animates (as today).
2. **Process rail fill, marks and connectors** (scroll-scrubbed CSS): unchanged. Under reduced motion or without `animation-timeline` support, they show filled.
3. **New: each drawing's lime layer.**
   - It is uncovered left to right with `clip-path: inset()`, scrubbed by its own `view()` timeline.
   - The range is the rail segment's: `cover 50vh` to `cover calc(100% - 50vh)`. So it finishes before that card's mark turns lime.
   - It sits only inside `prefers-reduced-motion: no-preference` and `@supports (animation-timeline: view())`.
   - Under reduced motion, without support, or with JS off, it stands drawn (CSS only, no script).
4. **Hover, press and focus:** unchanged (cell selection with grips, the button face lift, link underlines, the focus ring growing out). No new hover effects.
5. **Smooth scroll for in-page links:** unchanged (`no-preference` only).
6. **Not added:**
   - parallax;
   - motion at rest (`DESIGN.md` records "the page holds still at rest" as a decision; the vision has no always-on foreground animation);
   - a loader;
   - a custom page transition.
7. **Break-line edges:** static.

## Not available directly
- **A blind jury score.** `jury/SKILL.md` requires a fresh critic that has never seen the code or `DESIGN.md`, and says a self-score by whoever built the site "isn't blind". The worker that builds the page has seen both. I checked the skill at `add880bd6ec9`: it covers this only with "use a subagent, or say on the card that the score is not independent".
  - Option 1: the worker launches a fresh subagent with only the critic brief from `jury/references/quality-bar.md` plus the evidence paths - cost: needs subagent support in the worker's harness [INFERENCE: not confirmed], risk: low.
  - Option 2: the coordinator runs a separate one-off job given only the brief and the evidence - cost: one extra job, risk: none for blindness.
  - Option 3: the worker scores the site itself and marks the card "not independent" - cost: none, risk: a biased score.
  - Recommendation: Option 1, falling back to Option 3 with the label. The before score is taken before any edit.
- **A Lighthouse runner.**
  - The repo has no Lighthouse dependency or script.
  - In this checkout, `npx -y lighthouse@12` downloaded but could not start Chrome. With `CHROME_PATH` set to Playwright's Chromium (`~/.cache/ms-playwright/chromium-1248/chrome-linux64/chrome`) it ended in "waiting for dynamic debugging port" and then "Unable to connect to Chrome". The same binary crashed when launched directly with `--remote-debugging-port`.
  - KA0098's worker did record a run (Performance 97), so another environment managed it [INFERENCE: how it was run is not recorded].
  - Option 1: the worker runs `npx lighthouse@12` in its own environment with Playwright's Chromium - cost: none, risk: a busy host lowers the score (KA0098's review saw 91-92 under contention).
  - Option 2: add `lighthouse` as a devDependency with a script - cost: a new dev dependency, risk: the same Chrome launch problem.
  - Option 3: run PageSpeed Insights against the preview URL - cost: needs a public preview, risk: an outside tool sees an unreleased page.
  - Recommendation: Option 1, and Option 3 only if Chrome will not start.

## Files
- `src/data/process.ts`:
  - `ProcessStep` loses `icon` and gains `figure` (`"conversation" | "plan" | "stages" | "revision" | "care"`) and `outcome`.
  - The five steps get the outcome lines above.
  - Update the header comment.
- `src/components/mb/process-figure.astro` (new):
  - `name` prop; the five drawings as two stacked `<svg>` elements, ink and a lime overlay.
  - The lime overlay's scroll-scrubbed `clip-path` reveal, inside `no-preference` and `@supports`.
  - `animation-timeline` goes in its own, more specific rule, as `step-marker.astro` does, because the minifier folds it into the shorthand.
- `src/components/mb/field-edge.astro` (new):
  - `side: "top" | "bottom"`; one `aria-hidden` span.
  - `::before`: the field fill, masked by the wave tile, painted with `var(--v2-bg)`.
  - `::after`: the 1px `ink` stroke, masked by the stroke tile.
  - `mask-repeat: repeat-x`, so the wavelength and the 1px line hold at every width.
- `src/components/mb/sections/how-i-work.astro`:
  - `ProcessFigure` in the card's `image` slot; drop `Icon` and the lucide import.
  - The outcome line styled like `.mb-problem-effect` (hairline, lime arrow).
  - The lede; `poster`.
  - Grid, stagger, connectors and the button unchanged.
- `src/components/mb/section-head.astro`:
  - Boolean `poster` prop.
  - Headline spans `1 / -1`; lede in column 2.
  - Size `min(clamp(2.5rem, 0.9805rem + 6.2338vw, 5.5rem), 13vw)`, weight 850; line height and tracking tuned for that size.
  - The default head stays as it is for the other pages.
- `src/components/mb/sections/problems.astro`, `cases.astro`, `about.astro`: `mb-field` class on the section, `<FieldEdge side="top" />` and `<FieldEdge side="bottom" />`, `poster`.
- `src/components/mb/sections/services.astro`, `faq.astro`, `contact.astro`: `poster`.
- `src/styles/global.css`:
  - `.mb-field`: `--v2-bg: var(--v2-panel)` (so cell fills and the dimension mask follow the field), `background: var(--v2-bg)`, `position: relative`, `padding-block: var(--mb-section-gap)`.
  - Its comment notes that text on lime inside a field takes the field colour (8.3:1).
- `src/styles/tokens.css`: `--mb-edge` (the break line's height, 16px) next to the `--mb-*` tokens.
- `src/pages/llms-full.txt.ts`: `processBlock` adds the outcome under each step's description.
- `src/pages/_ui/catalogue.astro`: samples of `ProcessFigure` (all five), `FieldEdge` on a field, and `SectionHead poster` (the convention: a new component goes into `/ui` too).
- `DESIGN.md`:
  - Frontmatter: the `display-lg` size and weight; the description, which still says "drawn by a pen as you scroll".
  - The concept card.
  - Colors: `panel` as a section field; on-accent follows the field.
  - Layout: fields, break line, `poster` head, per-section composition.
  - Components: `process-figure`, `field-edge`, the `poster` prop.
  - The drawing: break line, revision cloud, figures.
  - Motion: the figure layer as the second scroll-tied motion beside the rail; still at rest as a decision.
  - Do's and Don'ts: the break line and the cloud are the only curves besides the radio.
- `AGENTS.md`:
  - The "Wygląd" description of the process section and the fields.
  - The `Don't` line "Jedyny ruch za przewijaniem to wypełnianie szyny procesu", which must also name the figure layer.
  - Doc sync only.
- `tests/e2e/home.spec.ts`:
  - The process layout test: also checks that each card's drawing sits above its title, inside the card.
  - "the process rail fills…": adds the drawings' lime-layer clip state (empty at the top, the first two drawn mid-way, all drawn at the button).
  - The reduced-motion test: drawings complete, 0 animations.
- `tests/e2e/design.spec.ts`:
  - Fluid sizes: `title` 40 / 88px, and 110px at a 20px default font at 1920px.
  - New check: Problems, Cases and About paint `rgb(10, 35, 80)`, and each edge's fill matches its field, so there is no seam.
- `tests/e2e/ui-catalogue.spec.ts`: the catalogue's reduced-motion test covers the new samples; adjust only if a selector changes.
- `spec/features/KA0146-.../`: `screenshots/before-1440.png`, `before-390.png`, `after-1440.png`, `after-390.png`, `jury-before.md`, `jury-after.md`, plus the Lighthouse numbers in the ticket's outcome.

## Risks
- **Scroll-drawn figures go against KA0098** ("nothing draws on scroll", 2026-10-28). The ticket's "motion on scroll only where it adds meaning" allows it.
  - Limit: only the lime layer moves, only in the process section, scrubbed rather than played, on the same range as the rail.
  - The ink drawings stand drawn.
  - This is an Open question, so the owner can drop it.
- **Remapping `--v2-bg` inside a field changes every substrate-coloured surface there:** cell fills, the dimension mask, the outline button's fill, and text on lime (now `#0a2350`, 8.3:1 by my calculation).
  - True Blue grips on `panel`: about 4.6:1. `muted`: 5.6:1 (DESIGN.md).
  - No form sits in a field; Contact stays on `base` for this reason.
  - axe and Lighthouse Accessibility confirm it.
- **Seams or overflow at the break lines:** each edge's fill reads the field colour from the same variable. The new design.spec check plus the existing large-font no-overflow test cover it. `mask` is unprefixed in current Chrome, Safari and Firefox [INFERENCE: I did not check compatibility tables].
- **Bigger headings:**
  - The 13vw cap keeps "działającego" with its callout (about 6.2em, `section-head.astro` comment) inside 390px.
  - At 88px, a full-width headline row holds the longest home headline.
  - The fluid-sizes test is updated, not removed.
- **Process layout tests:** the stagger test expects each card to start 0.8-1 of the way down the card before it. Every card grows by the same drawing height, so it should still hold [INFERENCE]. It is a real layout check, so fix the layout, not the number.
- **Performance:**
  - No JS is added; the drawings are under 2 KB each inline, below the fold, with fixed aspect ratios.
  - Baseline from my `shoot.mjs` run: throttled mobile LCP 1628 ms on `h1`, CLS 0.
  - Lighthouse itself was not run here (see Not available directly).
- **Firefox without view timelines:** drawings and rail show complete, as the rail does today.
- **Placeholders for steps 04 and 05 must not reach `main`:** they ship only after Kacper supplies the words, and the preview comes before merge.
- **Copy:** new Polish lines go through `bindLineBreaks`, so one-letter words are handled. No em-dash.

## How to test
- **Plan approved (concepts with scores, sections before and after, steps and copy, illustrations, motions):** this document. Once approved, the worker records the concept card and composition in `DESIGN.md`.
- **Screenshots before:** before any edit, `bun run build` on the base commit, serve `dist/client`, then `bunx playwright screenshot --full-page --wait-for-timeout=2500 --viewport-size=1440,900` and `--viewport-size=390,844` into `screenshots/before-*.png`. I ran this here and it works. The lazy photo in About renders empty in a full-page shot; scroll it into view or accept that.
- **Screenshots after and the layout at 1440 and 390:** the same commands into `after-*.png`, compared section by section with the table in Approach. Then `bun run build && bun run preview` for the owner's preview before any merge.
- **Jury, before and after:**
  - Clone `juliobsz/skills` at `add880bd6ec9` into a temp directory, outside the repo and outside the agent.
  - From the project directory (it resolves `playwright` and `axe-core`): `node <skills>/jury/scripts/serve.mjs dist/client --port 4400`, then `shoot.mjs http://127.0.0.1:4400/ --out <tmp>/shots` and `audit.mjs … --max 10`, then a fresh critic as in Not available directly.
  - Write `jury-before.md` and `jury-after.md`, each saying it covers one page.
  - My trial run on the current build took about 90 s: 0 FAIL, 3 WARN (en dashes in "2–3"-style ranges and two repeated case sentences, both outside scope); axe 0 violations; 60 fps; `idleMotion: false`; `noHoverChange` on the LinkedIn link and the brand link.
- **Lighthouse mobile on the built page:** Performance ≥ 95, Accessibility, Best Practices and SEO = 100. Run on an idle host and record the numbers.
- **axe zero:** `a11y.spec.ts` plus the jury's `a11y.serious` = 0.
- **Readable with JS off:** the existing no-JS check in `blueprint.spec.ts`, plus a Playwright context with `javaScriptEnabled: false`. The process drawings and edges must show complete; they are CSS only.
- **Reduced motion:** the updated reduced-motion process test and `design.spec.ts` "under reduced motion nothing moves on any page".
- **Scroll motion:** the updated "process rail fills" test, with the figure clip states at the top, middle and end.
- **Project checks:** `bun run check`, `bun run lint`, `bun run build`, `bun run test:e2e`. Docker specs skip with a reason where Docker is unreachable (KA0147). Run each in one call with a 1800 s timeout.

## Open questions
- **Steps 04 and 05:** Kacper needs to supply the outcome lines (placeholders above), and approve the proposed outcome lines for steps 01-03 and the process lede.
- **Scroll-drawn figures:** should the lime layer of the drawings be drawn on scroll? That relaxes KA0098's "nothing draws on scroll" inside the process section. The alternative is that the drawings stand drawn and only the rail moves.
- **Colour fields:** the plan keeps every field dark (`base` / `panel`), for the dark-only bar. Does the owner want one full-width Lime Green band (for example behind the process section), with `base` text on it? It would be the one bright area on the page.