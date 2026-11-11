# KA0170 - Plan

- Job: 2026-11-11-plan-2e09e764
- Planned at: e9f7c14435a0709d052d08dc0fd00376fcb04f9c

## Approach

The page stays Kacper's technical drawing (Rys. KA-001), and the process section stays its signature. I reviewed the live build of `e9f7c14` with the tponscr-debug `/awwwards` skill at `d18aa0c42b71`. I read `SKILL.md` and all seven references from GitHub at that commit and installed nothing. The skill says the site already sits in its own "Dark Immersive" archetype, with a "Tech" type formula and one accent. Most of what it would change is about scale and rhythm. Five changes are proposed, ranked by effect. There are no new dependencies and no new kind of motion.

**Art direction (the skill's Design Decision Framework)**
- **Emotion:** trust first, then calm control: someone has this under control.
- **Industry:** the skill has no entry for a one-person B2B AI/automation partner. The plan crosses two of its entries:
  - "SaaS / Developer Tools": competence, geometric sans with mono, subtle functional motion.
  - "Finance & Fintech": trust, clarity, one accent, number-forward, deliberate motion, no playfulness.
- **Studios:** Basic/Dept ("restraint, do less better") and Aristide Benoist ("typography is 90%"). Not Immersive Garden or Locomotive, which bring WebGL and smooth scroll.
- **Archetype:** Dark Immersive. The skill's tokens are a blue-tinted near-black, off-white text and an "electric green" accent; the site already has these (`base #04183b`, `ink #ece7dc`, `lime #7ed321`). The immersion comes from the drawing, not from 3D.
- **Typography:** Tech Formula (Geist display and body, Geist Mono for data), which is the site's pair already.
  - The skill's rule that the hero is the display tier fails today. The h1 is 64px, smaller than every 88px section headline.
  - Section ledes are 16px under 88px headlines, so they read as captions.
- **Colour:** no change. Its rules hold: one accent plus True Blue for state, four text levels (`ink`, `ink-2`, `muted`, disabled), no pure-black background. The one pure-white background is the EU band (see "Left out").
- **Motion:** use the skill's default easing, power4.out `cubic-bezier(0.16, 1, 0.3, 1)`. Its hero entrance band is 1000-1500ms, against 1.7s today. Motion must answer "where should I look": the call to action must not come last.

**What the skill finds today.** The screenshot references are frames from `record.mjs`, the script KA0153 committed under its `jury/` folder. I ran it on a local build of `e9f7c14`.
- `d/f-NN` is the 1440×900 viewport at scrollY = NN×216.
- `m/f-NN` is the 390×844 viewport at scrollY = NN×338.
- `load-*` frames are taken in the first 2.4 to 3 s after navigation.
- The worker re-runs the script before any edit and keeps only the frames cited here, under `screenshots/before/`.

| Page / section | Frames | Finding (skill rule) |
|---|---|---|
| Home: hero | `d/f-00`, `m/f-00`, `load-d1440/f-05` (763 ms), `load-m390/f-08` (796 ms) | h1 64px against 88px posters; on the phone both are 40px, so the hierarchy is inverted or flat ("Statement hero", "Typography is 90%"). The hero buttons rise at 0.95 to 1.55s, after the pen; at 796 ms on the phone the subtitle is in and the buttons are not. KA0153 measured the first screen settling at 4242 ms on a throttled phone. The 1.7s entrance is over the XL band. Good as is: split hero, one lime call to action, the datum. |
| Trust | `d/f-04` top, `m/f-03` | A dense stats-like row. Fine. |
| Problems | `d/f-04`, `d/f-08`, `m/f-03` | Field, poster head and cells are good. The lede sits 9px under the headline's `<em>` box (measured at 1440 on all 7 heads), with its callout box hanging into that gap; at 16px it reads as a caption ("White space", hierarchy). |
| Offer | `d/f-08`, `d/f-12` | The same head and table form; the lede crowds the "pasuje." callout. |
| Cases | `d/f-15`, `d/f-19`, `m/f-16` | Fourth bordered table in a row of 16px rows ("identical section rhythm"). Two effects hold numbers ("Ponad 200 osób", "Ok. 100 użytkowników") that are buried in sentences ("number-forward", data card value). |
| Process | `d/f-23` | The page's one "wow" (macro trend 8). Keep. |
| About, FAQ | `d/f-27`, `d/f-31` | Same lede crowding (under "Cały", under "pytania"). |
| Contact | `d/f-34`, `d/f-37` | The lede breaks "30-" / "minutowej" at its hyphen ("sweat the details"). The form itself is fine. |
| Footer + EU band | `d/f-39`, `m/f-39` | A pure `#fff` band ("never pure white backgrounds"). Left alone: see "Left out". |
| 404 | `404.html` at 1440×900 and 390×844 (`playwright screenshot`) | A custom 404 exists (checklist ✓), but it is the least designed page: a 54px head on an empty screen. |
| Legal | `polityka-prywatnosci` 1440, `regulamin` 390 | Prose at 65ch is within the skill's 60-75ch. Body is 16px against the skill's 18-20px, but that is the owner's KA0126 scale. Left alone. |

Skill checklist today: ✓ colour, whitespace, consistency, detail, performance, accessibility, originality (process). Typography ✗ (hero hierarchy). First impression ~ (the 3-second test meets a hero smaller than the sections below it).

**Changes, ranked by effect**
1. **Statement hero** (Design 40%, first impression). The h1 gets its own full-width row, as the page's largest type.
   - Size: 44px at 390 to 104px at the 1160 container, `min(clamp(2.75rem, 0.8506rem + 7.7922vw, 6.5rem), 12vw)`, line-height 0.92. The `22ch` max-width goes.
   - Under it, the subtitle sits left. On desktop the two hero buttons stack in the right column, their foot on the subtitle's last line.
   - The "W liczbach" title block becomes a full-width ruled strip, as a drafting title block is drawn: the "Rys. KA-001 · Arkusz 1/1" header, the caption, then three figure cells and the "Zobacz realizacje" cell side by side. Class names and the `aside` stay.
   - At 880px and below everything stacks as today.
   - Acceptance: at 1440×900 both hero buttons sit wholly above the fold; at 390×844 the first one does.
   ```
   1440  + X 0  Y 0
         Wdrożenia AI i                         (h1, 104px, full width)
         automatyzacje, które
         przejmują nudną pracę
         Tworzę automatyzacje… (20px, 56ch)    [Umów bezpłatną konsultację →]
                                               [Zobacz, co mogę zrobić…     ]
         ┌ RYS. KA-001 · ARKUSZ 1/1 ───────────────────────────────────────┐
         │ W liczbach                                                      │
         │ 1000+ / osób…  │ 500+ / osób…  │ 24 h / w tym…  │ [Zobacz realizacje →] │
         └─────────────────────────────────────────────────────────────────┘
         Od korporacji po startupy.  [5 logo cells]
   390   datum, h1 44px, subtitle, two full-width buttons, the title block's rows stacked as today
   ```
   - Motion: the pen traces the strip's frame and writes its header as it does the card today. Under reduced motion, without JS and after a ClientRouter swap, it stands drawn at once (same `html[data-bl-enter]` and `no-preference` mechanism).
   - Dependency: none.
2. **Case effects as display figures** (Design, Creativity, Content: breaks the run of identical tables).
   - When a case has a `result`, its "Efekt" row shows a figure at the `display-lg` size (32 to 54px, weight 800) over a 16px label. Otherwise it keeps its sentence.
   - The subgrid alignment is unchanged. `effect` stays as the source for `llms-full.txt`.
   - Copy, from facts already on the page:

     | Case | Figure | Label |
     |---|---|---|
     | helpfind | `200+` | "osób pracuje w nim codziennie" |
     | EnergiaDirect | `~100` | "użytkowników dziennie" |
     | LeadBuster/LeadApartament | `2` | "serwisy na jednej platformie od 10.2026; utrzymuję ją i rozwijam" |
     | ReX | [DO UZUPEŁNIENIA - Kacper: liczba i podpis, np. ilu użytkowników albo jak często wychodzą nowe funkcje] | |

   - ReX keeps today's sentence until Kacper gives words, so no placeholder text reaches the code.
   - Motion: none. Static, and no count-up.
3. **Shorter, call-to-action-first entrance** (Usability, KA0153 fix 1).
   - The hero buttons rise with the subtitle, starting 0.25s and in place by 0.9s.
   - The rest keeps its order: pen from 0.3s for 0.8s, strip cells 60-80ms apart, trust caption and cells 60ms apart. The whole sequence ends by 1.5s instead of 1.7s.
   - `--mb-enter` becomes power4.out.
   - Fallback: unchanged. Under reduced motion, without JS and after a swap, nothing animates.
4. **Ledes as leads, with air under the brace** (Design craft, KA0153 fixes 4 and 9).
   - On `poster` heads above 880px, the lede becomes 20px (the existing `body-lg` size). Its top stands at least 40px below the headline callout's bottom edge.
   - Phones keep 16px.
   - In the contact lede, "30-minutowej" sits in a `white-space: nowrap` span in `contact.astro`, so it never breaks at its hyphen.
   - Motion: none.
5. **404 uses the poster head** (Detail). `SectionHead as="h1" poster`: "Tej strony nie ma." at the posters' 40 to 88px, with the same lede and buttons. Motion: none.

**Dependencies: none.**
- `gsap` + ScrollTrigger: CSS scroll timelines already drive the one scroll motion. GSAP would add a second motion system and about 25 KB gzipped of JS to a page with 8 KB.
- `lenis`: it takes over wheel input with an always-running rAF loop and fights `glide.ts`/`scroll-padding`.
- `three`/`ogl`/WebGL: the Performance 95 bar on a throttled phone, and no always-on foreground animation.
- SplitType/GSAP SplitText: a new dependency. Splitting the h1 into spans would also change the LCP element and the transform-only slide.

**Left out: what the skill recommends against a bar or a standing rule**
- **Against vision bars:**
  - React Three Fiber, Framer Motion, Next.js/Vite+React: no React or islands framework.
  - Custom cursor (a perpetual rAF lerp), animated gradient borders, particles: no always-on foreground animation.
  - WebGL hero, loader sequence: Performance at least 95 (a loader also delays LCP).
  - Counter animation on the figures: content visible without JS. It would show 0 until a script runs.
  - The `prefers-color-scheme` light/dark token pair: dark-only.
- **Against AGENTS.md "Don't" and decisions:**
  - Scroll reveals (`translateY(30px)` on view): KA0098, 2026-10-28: nothing draws on scroll except the process.
  - Page transitions on navigation: a page reached through the ClientRouter stands at once.
  - The global `reduce` 0.01ms block: motion is opt-in.
  - Glass nav and glass cards (`backdrop-filter`), mesh and text gradients: no glass, no gradients.
  - Rounded 12-20px cards and soft shadows: square corners, hard shadow only.
  - Hover `translateY(-2px)` and image `scale(1.05)`: no hover movement besides the button face.
  - rgba borders at 0.04-0.10 instead of `ink` rules: the 1px ink rule is the design (`DESIGN.md`; hairlines are already 10%).
  - Body text at 18-20px: the KA0126 type scale, `tests/e2e/type-scale.ts`.
  - "Vary padding per section": the break line splits one `--mb-section-gap` by rule.
- **Against a contract:** the white EU band stays `#fff`. `eu-funding.astro` is the funding contract's mandatory disclosure, and its logos are made for white (Open question).
- **Not taken:** oklch token conversion (no visible change), hide-on-scroll nav (needs a scroll listener, and the sticky header carries `scroll-padding`), horizontal scroll and pinned sections.

**Left alone:**
- Trust bar, problems, offer, process (rail, drawings, scroll order), about, FAQ, contact form, header, footer, mobile sheet.
- Legal pages, case study pages, palette and tokens other than the entrance timings, all copy not named above.

## Not available directly
- **A blind jury score.** The worker builds the page, so it has seen the code and cannot be the blind critic KA0153 was. The tponscr skill has no scoring step, so "as KA0153 did" means the `juliobsz/skills` `jury` skill at `add880bd6ec9` plus `record.mjs`. KA0162 still holds: the harness preloads `AGENTS.md` into every job here.
  - Option 1: the coordinator runs two separate blind jobs like KA0153. The "before" job scores a preview of the base commit (it can run alongside the worker); the "after" job scores the branch preview. Each writes into this folder. Cost: two extra jobs. Risk: the KA0162 leak, disclosed on each card as KA0153 did.
  - Option 2: the worker launches a fresh subagent with only the evidence. Cost: low. Risk: subagent support in the worker's harness is not confirmed [INFERENCE].
  - Option 3: the worker self-scores and labels the cards "not independent". Cost: none. Risk: a biased score that does not meet "blind".
  - Recommendation: Option 1.

## Files
- `src/components/mb/sections/hero.astro`:
  - h1 on its own full-width row, with the new size and line-height; `max-width: 22ch` goes.
  - Subtitle left, buttons stacked right, their foot on the subtitle's last line (above 880px).
  - `aside.mb-hero-status` as a full-width strip: header, caption, three `.mb-status-row` cells side by side, `.mb-status-cta` as the fourth cell. It stacks at 880px and below.
  - New entrance delays: `.mb-hero-ctas` with the subtitle; caption, rows and the strip button earlier.
  - Header comment rewritten.
- `src/styles/tokens.css`: `--mb-enter: cubic-bezier(0.16, 1, 0.3, 1)`, `--mb-enter-pen: 0.3s`, `--mb-pen: 0.8s`, and the comment's "about 1.6s".
- `src/components/mb/sections/trust.astro`: caption and cell delays and durations so the last cell lands by 1.5s; comment.
- `src/styles/global.css`: the entrance comment (timings and order); keyframes unchanged.
- `src/components/mb/section-head.astro`: `.mb-section-head-poster .mb-section-lede` at 20px above 880px; its `margin-top` raised so the lede's top is at least 40px under the callout; comment.
- `src/data/home.ts`: `CaseHighlight.result?: { figure: string; label: string }`; values for helpfind, EnergiaDirect and LeadBuster; comment.
- `src/components/mb/sections/cases.astro`: the "Efekt" `dd` renders the figure over its label when `result` is set, otherwise the sentence; styles; comment.
- `src/components/mb/sections/contact.astro`: `nowrap` span around "30-minutowej".
- `src/pages/404.astro`: `poster` on `SectionHead`.
- `DESIGN.md`:
  - Frontmatter `display-xl` (size, lineHeight 0.92).
  - New "Art direction (KA0170)" section beside "Concept (KA0146)": emotion, industry, archetype, type, colour, motion, and what was left out and why.
  - Typography: hero as the display tier; 20px poster ledes.
  - Pages: home hero composition, case figures, 404 poster.
  - The drawing and Motion: entrance order and timings, `--mb-enter` row in the token table.
- `AGENTS.md`: "Wygląd" hero and cases descriptions; entrance "ok. 1.7s" (in Blueprint and in "Don't"); the 9500px line if the cap changes. Doc sync only.
- `tests/e2e/blueprint.spec.ts`: `ENTRANCE_MS`, `PEN_MS`, `PEN_FROM_MS`, each piece's end time, and the 0.15s / 0.8s checkpoints (the buttons are now in by 0.8s).
- `tests/e2e/design.spec.ts`: fluid sizes. Hero 44px at 390 (43.2 at 360 by the 12vw cap) and 104px at 1160/1440; 130px at 1920 under a 20px default font.
- `tests/e2e/home.spec.ts`:
  - The hero grid test is rewritten for the new layout:
    - the h1 spans the container;
    - both buttons are above the fold at 1440×900, and the first at 390×844;
    - the strip's three cells are equal width with figures on one line;
    - stacked at 390, the buttons are full width.
  - The hero h1 is larger than every `.mb-section-title` at 390 and 1440.
  - The cases test reads the three figures and labels and the ReX sentence.
  - Each poster lede's top is at least 40px under its callout at 1440.
  - The 9500px cap follows the Open question.
- `spec/features/KA0170-…/`: `screenshots/before/` (the cited frames), `screenshots/before-{home,404}-{1440,390}.png` and the same `after-*`, `jury-before.md`, `jury-after.md` (cited frames only), and the Lighthouse numbers in the outcome.

## Risks
- **Page height cap.** `home.spec.ts` holds the page to at most 9500px at 1440 (KA0152). Today it is 9326px, measured. My estimate of the additions [INFERENCE, not built]:
  - hero +30 to +110px;
  - ledes +150 to +250px;
  - case figures about +80px.

  That gives about 9600-9750px. See Open questions. The worker measures after each item.
- **CLS and LCP from a 104px h1.** If the fallback font wraps the h1 into a different number of lines than Geist, the content below shifts. Geist is preloaded and LCP stays the `h1` (transform-only slide). The worker checks Lighthouse CLS = 0 and that the LCP element is the `h1`.
- **Lighthouse margin.** On `e9f7c14` I measured three mobile runs against a gzip server (`npx serve@14`): 99/100/100/100, LCP about 1.9s. Against an uncompressed server (`python3 -m http.server`) it scored 94 twice, because the HTML is 166.8 KB raw (KA0159). Measure with gzip, as production `nginx.conf` serves, and record the server. These changes add about 1-2 KB of HTML [INFERENCE].
- **Phone length** grows by the case figures and ledes; the ledes stay 16px on phones to limit it. Today it is 14033px.
- **Entrance tests pin exact milliseconds.** The worker updates the numbers and keeps every assertion (order, transform/opacity only, ends within the sequence).
- **Owner-chosen layout replaced.** The KA0152 hero (text column level with the card) is replaced. Approving this plan approves that.
- **New Polish copy** (case labels) goes through `bindLineBreaks`. No em or en dashes; "~100" uses a tilde, as "~30 min" already does.
- **PNG weight** (KA0164/KA0165 still open): commit only the frames a card or this plan cites.

## How to test
- **Plan with art direction, findings with screenshot references, ranked changes with files, motion and dependencies, and what was left out:** this document. The worker records the art direction in `DESIGN.md`.
- **Pages follow the plan at 1440 and 390; screenshots before and after:**
  - Before any edit: build the base, serve `dist/client`, run `node spec/features/KA0153-…/jury/record.mjs <url> <tmp>` and keep the cited frames.
  - `bunx playwright screenshot --full-page --wait-for-timeout=2500 --viewport-size=1440,900` and `390,844` for `/` and `/404.html` into `before-*`.
  - The same into `after-*` on the branch; compare against the table and wireframe above.
  - The updated `home.spec.ts` hero, cases and lede tests prove the layout.
  - Then a preview for the owner before any merge.
- **Blind jury before and after:** Option 1 under Not available directly. Each card says it covers the home page, names its build, and discloses the KA0162 context leak.
- **Lighthouse mobile:** for three runs, `CHROME_PATH=~/.cache/ms-playwright/chromium_headless_shell-1248/chrome-headless-shell-linux64/chrome-headless-shell npx -y lighthouse@12 <url> --chrome-flags="--no-sandbox --disable-gpu --headless --user-data-dir=<tmp>"` against `npx serve@14 dist/client` (gzip). Pass: Performance at least 95, the others 100. I ran this command on the base build.
- **axe zero:** `a11y.spec.ts`.
- **Readable without JS:** the existing no-JS check in `blueprint.spec.ts`. The strip and figures are static markup.
- **Reduced motion:** `blueprint.spec.ts` reduced-motion tests and `design.spec.ts` "under reduced motion nothing moves".
- **Entrance:** the updated `blueprint.spec.ts` sequence test at 1440 and 360 (ends by 1500 ms, buttons with the subtitle).
- **Project checks:** `bun run check`, `bun run lint`, `bun run build`, `bun run test:e2e` (`npm test` is the same `playwright test`), each in one call with a 1800s timeout.

## Open questions
- **Page height cap.** Should the 1440px cap rise from 9500 to 9800px? These are type and air, not the process growth KA0151 stopped (10967px). I recommend yes.
  - If it stays at 9500: the ledes stay 16px, and their extra clearance comes out of `--mb-block-gap` under poster heads, so it adds no height.
- **ReX figure.** Kacper supplies a figure and label for ReX (placeholder above), or ReX keeps its sentence.
- **EU band.** Does the funding contract allow the EU logo strip on a white plate only as large as the strip, inside the dark footer (KA0153 fix 2, the skill's "no pure white background")? It is left as it is until you confirm.