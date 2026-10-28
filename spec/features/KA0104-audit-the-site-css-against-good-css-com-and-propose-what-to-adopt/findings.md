# KA0104 - Findings

What was discovered while doing this ticket but is not part of it: bugs, risks, gaps, and suggested changes. Workers add entries on their branch; the coordinator adds the non-blocking notes from reviews. One entry per finding, numbered, never deleted: only its Status changes.

A finding ends in one of three statuses: `fixed` (the branch fixed it; name the commit), `ticket K0000` (a planning ticket carries it), or `dropped (reason)`. `open` lives only until the merge: `h merge` turns every `Status: open` entry into a planning ticket and rewrites its status to `ticket K0000`.

`- Budget:` is optional: set it, in USD, only when the ticket this finding becomes is expected to cost more than the autopilot default, and leave the line out otherwise. `h merge` copies it into the ticket's JSON block as `budget`, which `h ticket status --autopilot` passes to `--budget`, capped at `H_AUTOPILOT_BUDGET_MAX`.

## How this audit was done

Source: https://good-css.com/skills/good-css/SKILL.md and the eight reference files its table names (`foundations`, `layout`, `spacing-and-shape`, `text-and-media`, `interaction`, `motion`, `show-and-hide`, `scroll-and-viewport`), read 2026-10-28. Every entry was held against `src/styles/tokens.css`, `src/styles/global.css`, `src/components/mb/**`, the blueprint and the entrance. Measurements come from throwaway Playwright probes against `bun run build` + `bun run preview` (Chromium 1248); "before/after" screenshots come from throwaway edits to `src/`, rebuilt, captured and reverted (`git diff main -- src` is empty). Screenshots: `screenshots/` in this folder.

F1 to F13 are proposals, ordered by visible benefit; F14 to F21 are the good-css entries that do not fit, dropped with the reason.

Already in place, no finding: the accordion animates `::details-content` with `interpolate-size` (`accordion-item.astro:52-69`); subgrid rows in problems / services / cases; container queries on the contact form and field (`contact-form.astro:224`, `field.astro:83`); form and success card stacked in one grid cell; `@property` for the drawing (`global.css:145-159`); one `:focus-visible` outline ring (`global.css:44-48`); `text-wrap: balance` on h1/h2 (`hero.astro:175`, `section-head.astro:124`); `overflow-x: clip` on the button (`button.astro:229`); `:user-invalid` on the pagination jump field (`pagination.astro:287`); no `transition: all` and no `ease-in` anywhere in `src/` (`rg` count 0).

## F1. In-page links park the section head under the sticky header

- Kind: bug
- Found by: 2026-10-28-ka0104-good-css-audit-d0007900 (worker), 2026-10-28
- Where: `src/styles/global.css:9-11` (the `html` rule, no scroll padding); `src/components/mb/header.astro:56-62` (the sticky header)
- What: good-css "Anchor targets that clear a sticky header" (`scroll-and-viewport.md`). Every nav link (`Oferta`, `Realizacje`, `Proces`, `O mnie`, `FAQ`, `Umów rozmowę`) scrolls its section's top edge to y=0, under the 71px (1440) / 65px (390) header. Measured on `/#cases`: the section's "§ … / Realizacje" label sits at y=25 and the dimension line above it is hidden at both widths; at 390 the h2 starts at y=60, so its top 5px are cut by the header (`screenshots/p1-anchor-cases-390-before.png`). Same numbers for `#services`, `#faq`, `#contact`. With `scroll-padding-block-start: 72px` the section lands at y=72: dimension line, label and headline all show (`p1-anchor-cases-{1440,390}-after.png`).
- Suggestion: one declaration on `html`, `scroll-padding-block-start`, outside the motion query. Tie it to the header: it measured 65px at 360 and 390 but wraps to 105px at 320, so a fixed 72px undershoots on the narrowest phones; give the header a height token (or a per-breakpoint value) and read it in both places. Cost: 2-5 lines in `global.css` / `tokens.css` + `header.astro`, a `nav-active.spec.ts` or `home.spec.ts` assertion that the target's head is below the header. Out: nav-active's IntersectionObserver margins (`nav-active.ts:117`), unchanged.
- Status: open

## F2. One-word last lines in paragraphs (text-wrap: pretty)

- Kind: improvement
- Found by: 2026-10-28-ka0104-good-css-audit-d0007900 (worker), 2026-10-28
- Where: `src/styles/global.css:9-22` (no `text-wrap` on the root; only h1/h2 balance)
- What: good-css "The reset" (`foundations.md`): `text-wrap: pretty` on `:root`. Counting elements in `<main>` (p, h3, li, dd, summary, at least four words) whose last line holds a single word: 21 at 1440 and 28 at 390 today, 3 and 7 with `:root { text-wrap: pretty }` (a `<p>` inside an `<li>` counts twice). The problems cells, the experience entries, the FAQ questions and the section leads lose their lone last words; nothing else moves (`screenshots/p2-wrap-problems-{1440,390}-{before,after}.png`: "poprosisz." no longer sits alone at 390).
- Suggestion: add `text-wrap: pretty` to the `html` rule in `global.css`. Cost: one line; no test pins line breaks. Chrome 117+ and Safari 26+; Firefox ignores it and keeps today's wrapping. It can move a one-letter word to a line end ("zanim o / niego" in the 390 after shot); F10 covers that.
- Status: open

## F3. The mobile menu cannot reach FAQ and "Umów rozmowę" on a phone in landscape

- Kind: bug
- Found by: 2026-10-28-ka0104-good-css-audit-d0007900 (worker), 2026-10-28
- Where: `src/components/mb/mobile-sheet.astro:79-94` (fixed sheet, no `overflow-y`); `src/scripts/mobile-sheet.ts:61-62` (body scroll locked)
- What: good-css "Scroll area between a fixed header and footer" (`scroll-and-viewport.md`). The sheet is `position: fixed; inset: 0` with overflowing content and the page behind it is locked, so its overflow is unreachable. Measured with the sheet open and a 600px wheel scroll over it: at 844x390 FAQ and the CTA stay off-screen (content 128px taller than the sheet); at 667x375 "O mnie", FAQ and the CTA (143px). With `overflow-y: auto; overscroll-behavior: contain` on `.mb-sheet` every link and the CTA scroll into view (`screenshots/p3-sheet-844x390-{before,after}.png`). Portrait 390x844 does not overflow and keeps its layout (`p3-sheet-390x844-*`; 4001 of 1.3M pixels differ, all inside the label text, [INFERENCE] antialiasing of a scroll container). No 1440 shot: the sheet and its trigger exist only at 880px and below.
- Suggestion: those two declarations on `.mb-sheet`. The close button is `position: absolute` in the sheet (`mobile-sheet.astro:115-119`), so it scrolls away with the content; make it sticky, or keep it and rely on Esc and the links, as the ticket decides. Cost: 2-4 lines, a `mobile-sheet.spec.ts` case at 844x390 that scrolls the sheet and clicks the CTA.
- Status: open

## F4. iOS Safari: form fields at 15px, text inflation, 100vh on the 404

- Kind: improvement
- Found by: 2026-10-28-ka0104-good-css-audit-d0007900 (worker), 2026-10-28
- Where: `src/components/mb/input.astro:29`, `src/components/mb/textarea.astro:23` (15px); `src/styles/global.css:13-22` (no `-webkit-text-size-adjust`); `src/pages/404.astro:29` (`min-height: calc(100vh - 240px)`)
- What: good-css "The reset" (`foundations.md`): `input, textarea, select { font-size: max(16px, 1rem) }`, `-webkit-text-size-adjust: 100%`, `svh` for document heights. Measured: the email field and the message box render at 15px (computed style, both widths). [INFERENCE] iOS Safari zooms the page into any focused field under 16px, so a visitor filling the contact form on an iPhone is left zoomed in and pinches out after sending; at 16px it does not zoom. [INFERENCE] the same Safari inflates text after rotating to landscape without `text-size-adjust`, and its `100vh` is the toolbar-hidden height, so the 404 content sits lower than the visible centre. None of these reproduce in Chromium; they need a real iPhone before and after.
- Suggestion: raise the two field sizes to `max(16px, 1rem)` (the visible change: field text 1px larger), add `-webkit-text-size-adjust: 100%` to the root, write `100svh` in `404.astro`. Cost: about 4 lines and a check on an iPhone; would rank second if the zoom is confirmed there. Out: `maximum-scale` / `user-scalable=no` in the viewport meta (good-css forbids it).
- Status: open

## F5. In forced-colors mode a focused field shows no focus at all

- Kind: bug
- Found by: 2026-10-28-ka0104-good-css-audit-d0007900 (worker), 2026-10-28
- Where: `src/components/mb/input.astro:31,49-52`; `src/components/mb/textarea.astro:27,45-48`; `src/components/mb/pagination.astro:269`
- What: good-css "One focus ring with `:focus-visible`" (`interaction.md`): a component that draws its ring with `box-shadow` keeps `outline-color: transparent`, never `outline: none`. The fields set `outline: none` and show focus with the blue hard shadow. Measured on the focused email field with Playwright `forcedColors: "active"`: `outline-style: none`, `box-shadow: none`, so nothing marks the field the visitor is typing in (Windows High Contrast users). Normal mode is unchanged by the fix.
- Suggestion: replace `outline: none` with `outline: 2px solid transparent` in the three places, so forced colors repaint it as a visible ring. Cost: 3 lines, an a11y spec case under `forcedColors: "active"` that the focused field has a non-`none` outline.
- Status: open

## F6. Hover styles answer taps on touch screens

- Kind: improvement
- Found by: 2026-10-28-ka0104-good-css-audit-d0007900 (worker), 2026-10-28
- Where: 43 `:hover` rules in 19 files under `src/components/mb/` (`rg -c ':hover'`), e.g. `card.astro:194-218` (the CAD selection), `button.astro:332-385` (fills and the lifted face); `src/styles/global.css` has no `-webkit-tap-highlight-color` or `touch-action`
- What: good-css "Hover styles only where hover exists" (`interaction.md`) and the reset's `-webkit-tap-highlight-color: transparent` / `touch-action: manipulation` (`foundations.md`). None of the hover rules sit inside `@media (hover: hover) and (pointer: fine)`. [INFERENCE] on a phone a tap can leave a cell selected (panel lit, grips, blue "01.3 ↔ 368") or a button lifted until the next tap elsewhere, and Android draws its grey tap rectangle over the square cells; Chromium's mobile emulation does not reproduce sticky hover (probe: after a tap `:hover` did not match), so this needs a real phone. The press states (24 `:active` rules outside /ui, `rg -c`) already give touch feedback.
- Suggestion: wrap the hover selectors in the media query (they share their rule with `[data-state="hover"]` for the /ui catalogue, so each `:is(:hover, [data-state="hover"])` splits into a guarded `:hover` rule and an unguarded `[data-state]` rule), add the two reset lines. Cost: the largest CSS change in this list, 19 files, no visible change with a mouse; check on a real phone. Out: the `:active` styles.
- Status: open

## F7. Header menu button, header CTA and footer links are small tap targets

- Kind: improvement
- Found by: 2026-10-28-ka0104-good-css-audit-d0007900 (worker), 2026-10-28
- Where: `src/components/mb/header.astro:41-49` and `src/components/mb/button.astro:279-284` (`size="sm"`, 36px); `src/components/mb/link.astro:162` (footer links)
- What: good-css "Hit area larger than the visual" (`interaction.md`). Measured at 390: the menu button is 36x36, the header "Umów rozmowę" 36px tall, the five footer links 22px tall (under WCAG 2.5.8's 24px), the inline "formularzu" link 21px. A `::after` with `inset: min(0px, (100% - 44px) / 2)` grows the tappable area to 44px without changing what is drawn.
- Suggestion: add the hit-area pseudo-element to `.mb-btn-size-sm` and `.mb-link-footer` (`button.astro` has no `::after` today). `overflow-x: clip` on the button face (`button.astro:229`) would clip the area, so it goes on the outer element. Cost: about 10 lines. Visible change: none; taps near the edge land.
- Status: open

## F8. The message box scrolls inside itself instead of growing

- Kind: improvement
- Found by: 2026-10-28-ka0104-good-css-audit-d0007900 (worker), 2026-10-28
- Where: `src/components/mb/textarea.astro:17-34` (`min-height: 130px`, `resize: vertical`)
- What: good-css "Textarea that grows with its content" (`interaction.md`): `field-sizing: content` with `min-height` / `max-height` in `lh`. Today a longer message scrolls inside a 130px box (or the visitor drags the corner); with it the box grows line by line up to the cap, and the contact sheet grows with it. Chrome 123, Safari 26.2, Firefox 152; older browsers keep today's box.
- Suggestion: `field-sizing: content; min-height: 5lh; max-height: 14lh` (values to tune), keep `resize` or drop it. The form and the success card share one grid cell so the sheet keeps its height after sending (AGENTS.md, contact); a taller form makes a taller cell and the success card fills it, which the review checks. Cost: 3 lines. Out: the animated wrapper with a ResizeObserver (it would add a script and a second slide).
- Status: open

## F9. Section rhythm jumps at 880px; headline sizes ignore the reader's font size

- Kind: improvement
- Found by: 2026-10-28-ka0104-good-css-audit-d0007900 (worker), 2026-10-28
- Where: `src/styles/tokens.css:58-59,95-100` (`--mb-section-gap` 136px → 88px, `--mb-block-gap` 48px → 32px at 880px); `src/components/mb/sections/hero.astro:170`, `src/components/mb/section-head.astro:119`, `src/pages/404.astro:55` (`clamp(px, vw, px)`); `src/styles/global.css:16` (`body { font-size: 16px }`)
- What: good-css "Fluid sizes with `clamp()`" (`foundations.md`): fluid values in one token, preferred value `rem + vw`, bounds in `rem`. Today the gap between sections drops by 48px in one step when the window crosses 880px, and the headline clamps use px bounds and a bare `vw`, so a reader who sets a larger default font in the browser gets the same headlines (and, with the body in px, the same body text). Two clamp tokens for the gaps keep 136/48 at 1440 and 88/32 at 390 and interpolate in between; rem bounds let headlines follow the reader's setting.
- Suggestion: `--mb-section-gap` and `--mb-block-gap` as `clamp(rem, rem + vw, rem)` worked out from the 390 and 1160 points, the 880px block removed; the three headline clamps rewritten in `rem + vw`. Cost: about 8 lines, `DESIGN.md` updated with the tokens; 1440 and 390 stay pixel-identical for the gaps, widths in between change. Out: converting the 99 px font sizes of the components to a fluid scale (F16).
- Status: open

## F10. One-letter Polish words end lines

- Kind: improvement
- Found by: 2026-10-28-ka0104-good-css-audit-d0007900 (worker), 2026-10-28
- Where: copy in `src/data/home.ts`, `src/content/**` (rendered everywhere text wraps)
- What: not a good-css entry; seen while measuring F2. Polish typesetting keeps one-letter words (a, i, o, u, w, z) with the next word. Today at 390 the second problems cell ends a line on "maile i" (`screenshots/p2-wrap-problems-390-before.png`), and `text-wrap: pretty` produced "zanim o / niego" (`p2-wrap-problems-390-after.png`). CSS has no rule for it.
- Suggestion: a non-breaking space after one-letter words, written in the copy or added by one build-time helper used where copy is rendered (and in `llms-full.txt` left as a normal space). Cost: a helper plus its call sites, or a copy pass; the copy change goes in `copy(<section>)` commits.
- Status: open

## F11. The mobile sheet re-implements what `<dialog>` gives

- Kind: cleanup
- Found by: 2026-10-28-ka0104-good-css-audit-d0007900 (worker), 2026-10-28
- Where: `src/scripts/mobile-sheet.ts:41-63` (inert on every body child, `aria-hidden`, body scroll lock), `:122-134` (Escape); `src/components/mb/mobile-sheet.astro:35`
- What: good-css "`:has()` for parent and page state" (`html:has(dialog:modal) { overflow: hidden }`) and "Enter and exit transitions from `display: none`" (`interaction.md`, `show-and-hide.md`). A `<dialog>` opened with `showModal()` makes the page inert, closes on Escape, returns focus to the opener and sits in the top layer; the scroll lock becomes one CSS rule. Visible change: none.
- Suggestion: render the sheet as `<dialog>`, open with `showModal()`, close with `close()`; drop the inert loop, the Escape branch and the inline scroll lock. AGENTS.md requires Tab to wrap inside the sheet; a modal dialog lets Tab leave to the browser UI, so `trapTab` stays. Cost: about 30 lines removed, `mobile-sheet.spec.ts` rerun (it asserts inert, focus and Esc), the ClientRouter swap (`syncOnLoad`) checked with an open dialog.
- Status: open

## F12. A global rule strips every transition under reduced motion

- Kind: cleanup
- Found by: 2026-10-28-ka0104-good-css-audit-d0007900 (worker), 2026-10-28
- Where: `src/styles/global.css:95-104` (the global block); 22 `prefers-reduced-motion: reduce` blocks in 21 files that set `transition: none` (e.g. `mobile-sheet.astro:188-195`, `link.astro:213-224`), against 7 `no-preference` blocks (`rg -c`, outside /ui); `src/styles/global.css:9-11` (`scroll-behavior: smooth` outside a motion query)
- What: good-css "Opt-in motion" (`motion.md`): build the state, put only the movement inside `prefers-reduced-motion: no-preference`, and never strip motion afterwards with a global `0.01ms` rule; colour and opacity fades are not motion and may stay. The site does the reverse twice: a global block and one `reduce` block per component, both also killing the 0.12s colour fades. Visible change: under reduced motion, hover and focus colours fade in 0.12s instead of switching; nothing for everyone else.
- Suggestion: move each transform transition (button face, nav underline `link.astro:101-113`, sheet arrow `mobile-sheet.astro:166-175`, case arrow `link.astro:159,204-210`, skip link `global.css:63`, accordion chevron) and `scroll-behavior: smooth` into `no-preference` blocks, then delete the 22 `reduce` blocks and the global one. Cost: 21 component files, [INFERENCE] about 100 lines removed, `blueprint.spec.ts` and `mobile-sheet.spec.ts` reduced-motion cases rerun. Keep today's blocks if reduced motion is meant to mean no fades either: that is the human's call.
- Status: open

## F13. Derived colours are hard-coded instead of mixed from the palette

- Kind: cleanup
- Found by: 2026-10-28-ka0104-good-css-audit-d0007900 (worker), 2026-10-28
- Where: `src/styles/tokens.css:47` (`--v2-line: rgba(236, 231, 220, 0.1)`, a copy of `--ink`); `src/components/mb/button.astro:363,424`, `src/components/mb/badge.astro:169` (`color-mix(in srgb, ...)`)
- What: good-css "OKLCH color" (`foundations.md`): derive tints from the base, no second hard-coded value. `--v2-line` repeats the ink's RGB, so a change to `--ink` leaves the hairline behind. Measured on `--v2-bg`: today's hairline paints rgb(32, 34, 36); good-css's `color-mix(in oklch, var(--ink) 10%, transparent)` paints rgb(33, 33, 38), a cooler grey; `oklch(from var(--ink) l c h / 0.1)` and `color-mix(in srgb, ...)` paint rgb(32, 34, 36), identical. The srgb mixes are on the destructive button and badge, which only the /ui catalogue renders.
- Suggestion: `--v2-line: oklch(from var(--ink) l c h / 0.1)` (relative colour syntax; Chromium renders it, other engines unchecked), `DESIGN.md:107` updated; leave the destructive mixes, nothing on the site shows them. Visible change: none. Cost: 2 lines. Out: rewriting the hex palette in `oklch()` (F14).
- Status: open

## F14. Foundations entries that do not fit

- Kind: improvement
- Found by: 2026-10-28-ka0104-good-css-audit-d0007900 (worker), 2026-10-28
- Where: `src/styles/tokens.css:20-93`, `src/styles/global.css:3-28`
- What: "One set of color tokens for light and dark" (`light-dark()`); "Logical properties" (about 156 lines in `src/` with a physical left/right/top/bottom property, `rg`); "OKLCH color" for the base palette; the reset's `img { height: auto }`, `* { min-width: 0 }`, `font-synthesis: none`, `scrollbar-gutter: stable`, `user-select: none` on buttons.
- Suggestion: none.
- Status: dropped (light-dark: the site is dark-only, AGENTS.md forbids light values. Logical properties: Polish only, no RTL plans, no visible change. OKLCH palette: no visible change, DESIGN.md records the hex values with their contrast ratios; F13 takes the derived one. `img { height: auto }`: four experience logos and one trust logo get a box of the wrong ratio today (e.g. Energia Direct 140x32 for an 11:1 drawing), but they are SVGs with no `preserveAspectRatio` (`rg -c`), so the default `xMidYMid meet` letterboxes them and nothing looks distorted; the global rule also collapsed the Apptension mark in the trust bar to 0x0 (`screenshots/dropped-img-height-auto-trust-390-{before,after}.png`). `min-width: 0`: not tried; no overflow bug turned up in the probes, and good-css warns it shrinks sized icons in flex rows that lack `flex: none`. `font-synthesis: none`: no italic face is shipped, so any `<em>` in Markdown prose would lose its slant. `scrollbar-gutter`: the only scroll lock is the mobile sheet, at 880px and below. `user-select`: no visible change.)

## F15. Layout entries that do not fit

- Kind: improvement
- Found by: 2026-10-28-ka0104-good-css-audit-d0007900 (worker), 2026-10-28
- Where: `src/styles/global.css:86-90` (`.container`), `src/components/mb/sections/trust.astro:77-79,119-126`, problems / hero / about breakpoints at 880 and 560px
- What: "Content grid with breakouts", "Intrinsic grid", "Sidebar that wraps on its own", "Safe alignment", "`overflow: clip` over `hidden`".
- Suggestion: none.
- Status: dropped (content grid: nothing breaks out of the container and the page frame's rulers are drawn on `.container`'s edges, so it would replace 5 lines with 15 for no visible change. Intrinsic grid and wrapping sidebar: the 3/2/1 column counts and the one-column switch at 880px are approved layout (AGENTS.md "Wygląd"), and `auto-fit` would move where they switch. Safe alignment: no centred row can overflow. `overflow: clip`: the only `hidden` uses are the off-screen honeypot (`contact-form.astro:216`) and `.sr-only`, no visible effect.)

## F16. Fluid type scale for the whole site

- Kind: improvement
- Found by: 2026-10-28-ka0104-good-css-audit-d0007900 (worker), 2026-10-28
- Where: 99 `font-size: <n>px` declarations in `src/` (`rg -c`)
- What: "One fluid scale for type and space" (`foundations.md`).
- Suggestion: none.
- Status: dropped (each component's size is part of the look approved in KA0075 / KA0098; a derived scale would change most of them. F9 takes the part that is visible today: the section rhythm and the three headline clamps.)

## F17. Spacing and shape entries that do not fit

- Kind: improvement
- Found by: 2026-10-28-ka0104-good-css-audit-d0007900 (worker), 2026-10-28
- Where: `src/pages/index.astro`, `src/styles/tokens.css:58-59`
- What: "Section spacing that depends on its neighbors", "Concentric nested radius"; "Space between siblings set by the parent" and "Push one item away with an auto margin" are already how the components space their parts.
- Suggestion: none.
- Status: dropped (the section order is fixed in `index.astro`, not editor-controlled, and one gap token serves every meeting; the site has no rounded corners besides the radio dot.)

## F18. Text and media entries that do not fit

- Kind: improvement
- Found by: 2026-10-28-ka0104-good-css-audit-d0007900 (worker), 2026-10-28
- Where: `src/components/mb/button.astro:238-245`, `src/components/mb/section-head.astro`, `src/components/mb/contact-link.astro:66`
- What: "Label centered on its letters with `text-box`", "Tabular numbers", "Icon sized by the text beside it", "Long text that wraps, truncates or clamps", "Image box that holds any upload".
- Suggestion: none.
- Status: dropped (text-box: measured, the cap centre of the button labels already sits 0 to 0.5px from the button centre and `text-box: trim-both cap alphabetic` moved nothing. Tabular numbers: the changing numbers (cell widths, section widths) are in Geist Mono, already fixed-width; the hero figures are static. Icons: sized in px per button size (`button.astro:247-250`); [INFERENCE] `1cap` would re-derive about the same sizes, no visible gain. Truncation: all copy is in the repo; the one `overflow-wrap: anywhere` is on the email in `contact-link.astro`, where it is needed. Image box: the photo already uses `object-fit: cover`; the logos are SVGs.)

## F19. Interaction entries that do not fit

- Kind: improvement
- Found by: 2026-10-28-ka0104-good-css-audit-d0007900 (worker), 2026-10-28
- Where: `src/components/mb/button.astro:381-430`, `src/components/mb/card.astro`, `src/scripts/contact-form.ts`
- What: "Press feedback" (`scale(0.97)`), "Whole card clickable from one link", "Form feedback with `:user-invalid`" for the contact form.
- Suggestion: none.
- Status: dropped (press: the design presses by fill and by laying the face on its layer; AGENTS.md forbids movement on hover and press beyond that. Whole card: no card on the live site navigates; the case links render only when case studies exist, and making the cell the link is a product call for when they do. `:user-invalid`: the contact form's messages come from `checkLead`, shared with the server, and the state machine is the decided pattern.)

## F20. Motion entries that do not fit

- Kind: improvement
- Found by: 2026-10-28-ka0104-good-css-audit-d0007900 (worker), 2026-10-28
- Where: `src/styles/tokens.css:83-89`, `src/layouts/base-layout.astro` (ClientRouter), `src/components/mb/link.astro` (nav underline)
- What: "Motion tokens" (`ease-out` curves), "Shadow change that fades and does not repaint", "Cross-document view transitions", "Indicator that slides to the active item".
- Suggestion: none.
- Status: dropped (tokens: `--mb-snap` is linear by decision, "a switch, not a drift", and no `ease-in` exists. Shadow fade: the shadows are hard, unblurred and switch, nothing to repaint. View transitions: the ClientRouter carries decided behaviour (the entrance only on a document load, never after a swap; Umami's page-load hook; the form's capture-phase submit), and replacing it is a routing change, not CSS. Sliding indicator: AGENTS.md allows one travelling slide, the button's loading label.)

## F21. Show/hide and scroll entries that do not fit

- Kind: improvement
- Found by: 2026-10-28-ka0104-good-css-audit-d0007900 (worker), 2026-10-28
- Where: `src/components/mb/breadcrumb.astro`, `src/components/mb/mobile-sheet.astro`, `src/components/layout/base-head.astro:40`
- What: "Popover anchored to its trigger", "Reveal with `clip-path`", "Carousel on native scroll", "Styles that apply only when a scroller overflows", "No rubber-band bounce on desktop", "Content clear of the notch".
- Suggestion: none.
- Status: dropped (the breadcrumb's collapsed menu renders only on the /ui catalogue; there is no dropdown, carousel or horizontal scroller on the site; it is a document, not an app shell, so the bounce is expected; the viewport meta has no `viewport-fit=cover` and nothing is pinned to the bottom, so the insets are 0.)
