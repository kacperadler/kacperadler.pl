# KA0118 - Findings

What was discovered while doing this ticket but is not part of it: bugs, risks, gaps, and suggested changes. Workers add entries on their branch; the coordinator adds the non-blocking notes from reviews. One entry per finding, numbered, never deleted: only its Status changes.

A finding ends in one of three statuses: `fixed` (the branch fixed it; name the commit), `ticket K0000` (a planning ticket carries it), or `dropped (reason)`. `open` lives only until the merge: `h merge` turns every `Status: open` entry into a planning ticket and rewrites its status to `ticket K0000`.

`- Budget:` is optional: set it, in USD, only when the ticket this finding becomes is expected to cost more than the autopilot default, and leave the line out otherwise. `h merge` copies it into the ticket's JSON block as `budget`, which `h ticket status --autopilot` passes to `--budget`, capped at `H_AUTOPILOT_BUDGET_MAX`.

## How this audit was done

Source: github.com/Leonxlnx/taste-skill at 12af471 (v2.1.5), cloned to `/tmp`, nothing installed into the repo. Read: `skills/taste-skill/SKILL.md` (the default skill, `design-taste-frontend`, with its house rules, laws and the "Redesign, restyle or review" route) and its references `critique.md`, `tells.md`, `type.md`, `colour.md`, `layout.md`, `copy.md`, `motion.md`. The audit-first `redesign-skill/SKILL.md` was retired into the default skill on 2026-10-19 (825e306, "Clean up the repo"); its last full version (e04409a) was read from the repo history.

Measured with the skill's own tools against `bun run build` + `bun run preview`: `scripts/inspect.mjs` (Chromium 1248, at 1440/768/390 for home, 1440/390 for `/polityka-prywatnosci/` and the 404) and `scripts/lint.mjs src`. Viewed as viewport-high slices at 1440x900 and 390x844 (throwaway Playwright script). The 404 was re-inspected on a build of `main` at c3012e9, because KA0102 rebuilt it on `section-head` after this branch started. "Before/after" screenshots for F1-F3 come from throwaway edits to `src/` (and two public-site captures in `public/_ka0118/` for F2), rebuilt, captured and reverted: this branch has no change under `src/` or `public/`. Screenshots: `screenshots/` in this folder.

The inspector's verdict on the home page: 14 FAIL, 7 WARN. Ten of the FAILs are the blueprint-live look itself (eyebrow, mono, numbering, micro-label, hairline, outlined-box) or false positives (gradient, button-fx; F15); the rest are the hero's focal point and headline lines (F1), the picture count (F2), small text (F3).

The skill's critique (`critique.md` §4), one round, judged on the screenshots:

```
ROUND 1
Seen in one second: the ruled "W liczbach" title block and a four-line headline beside it - two medium masses, neither leads.
Idea (one sentence): the engineer's technical drawing becomes the page's frame (blueprint-live: rulers, dimension lines, a title block, the pen on load).
Live thing: the cell width readout under the cursor ("01.3 ↔ 368") - from the design, not from the visitor's problem (F6).
Layout words by section: hero=split / trust=strip / problems=grid / services=grid / cases=grid / process=rail / about=split / faq=two lists / contact=sheet
Scores: design 7 · usability 8 · creativity 7 · content 7 → overall 7.3
Caps applied: monospace labels, eyebrows, 01/02 numbering, hairlines → 6.5; fewer than four real pictures → design ≤ 6.5. Final 6.5.
Top three problems (most visible first):
1. The headline is 64px (4.4vw) over four lines in a 43% column; nothing on the first screen dominates (p1-hero-1440-before.png). Fix: F1.
2. "Co już działa" proves the work with words only; one photograph on the whole page, of Kacper (p2-cases-*-before.png). Fix: F2.
3. 52 tiny tracked mono labels; the ones inside content (Dla kogo, Problem, Efekt, Email) read as costume, at 11px (p3-labels-*-before.png). Fix: F3.
```

The scores are a juror's judgement, not a measurement; the caps are the skill's arithmetic. Three neighbouring sections share one layout word (problems, services, cases: ruled cell grids), which `critique.md` pass 9 calls "the template showing"; those layouts are approved (KA0075, 2026-10-26), so no finding moves them; F2 breaks the sameness from inside the cases cells.

Already in place, no finding: `lint.mjs` flags no copy tell (no genre verbs, no "Learn more", em dashes, lorem); one `h1` per page that says what this is, and a heading on every section; navigation is the wordmark, five plain links and one action; square buttons; no glass, no real gradient, no emoji, no pill badges; centred text 4% of the page (`inspect.mjs`); no low-contrast text and no horizontal overflow at any width (`report.json`: `lowContrast: []`, `horizontalOverflow: 0`); both faces load; sections sit 136px apart at 1440, inside the skill's 120-240px; the 404's empty right half (34% of the first screen on this branch's base) is closed on `main` by KA0102's section head (no `hero-void` on the `main` build).

F1 to F11 are proposals, ordered by visible benefit; F12 to F18 are the Taste Skill rules that do not fit, dropped with the reason.

## F1. The hero headline in two lines at a size that leads the first screen

- Kind: improvement
- Found by: 2026-10-28-ka0118-taste-audit-bf2d703a (worker), 2026-10-28
- Where: hero (#top), `src/components/mb/sections/hero.astro:166-177` (h1: `clamp(40px, 5.2vw, 64px)`, `max-width: 22ch`), `:115-122` (two-column grid), `:158-164` (text column padded to the card's caption line), `:289-321` (the card's rows)
- What: Taste Skill house rule "Headlines: two lines or fewer, at every width" and the laws "Two or three sizes do the visible work: one very large" (largest type: median 8.4vw on top sites, 5.0vw on weak ones) and "One dominant thing per screen" (`critique.md` pass 2). `inspect.mjs`: the h1 is 64px (4.4vw), four lines at 1440, `focal-point` FAIL ("the first screen has no dominant element"); the section h2s are 54px, so the hero barely outranks them (`type.md` §8). Throwaway at 1440: the h1 spans the full width above the two columns (subtitle and buttons left, the card right), `clamp(40px, 5.6vw, 84px)`; the card's rows set figure beside text so it is shorter; the subtitle 21px. Measured after: two lines, 80.6px (5.6vw), `focal-point` and the 1440 `headline-lines` FAILs gone; the hero buttons still sit on the card button's line, and the trust bar's caption moves into the first screen (`screenshots/p1-hero-1440-{before,after}.png`). At 390 the throwaway raises the h1 from 40 to 46px: still four lines (`p1-hero-390-{before,after}.png`); two lines on a phone need a headline of about 32 characters, and today's is 57.
- Suggestion: the desktop rearrangement above, the phone at about 46px. Visitor sees: the headline as the one big thing on the first screen, set in two lines across the sheet, the figures and the buttons under it. Cost: about 50 lines of CSS in `hero.astro`, updating `blueprint.spec.ts:492-496` (headline level with the card's caption) and `home.spec.ts:516` ("the hero's text, buttons, card rows and figures sit on one grid"); the entrance moves the same elements (transform only), [INFERENCE] unchanged, to be checked in a recording. Approved decision: touches KA0075's hero layout (2026-10-26, "align everything neatly"; AGENTS.md: the headline on the card's caption line, the buttons on the card button's line - the second still holds); the copy stays. A shorter headline that fits two lines on a phone would touch KA0075's chosen H1 (2026-10-26) and is the human's call, not proposed here.
- Status: ticket KA0121

## F2. "Co już działa" shows the work, not only describes it

- Kind: improvement
- Found by: 2026-10-28-ka0118-taste-audit-bf2d703a (worker), 2026-10-28
- Where: cases (#cases), `src/components/mb/sections/cases.astro:63-106` (cell: logo head, problem / solution / effect), `:132-136` (five subgrid rows), `:165-180` (logos grey at 0.6 opacity until hover)
- What: Taste Skill imagery floor ("at least four real pictures ... for software, its cropped interface fragments count") and `critique.md` cap "fewer than four real pictures: design cannot exceed 6.5"; `copy.md` §5 "Show the thing itself, large. A real demonstration outranks any quote." `inspect.mjs`: 1 real picture on the page (`me.webp`), `few-pictures` FAIL at 1440. The cases are the page's proof and every one of them is text in a ruled table; the logos naming the companies stay grey on a phone, which has no hover to light them. Throwaway: a 16:9 picture of the product under each logo, here the public home pages of rex.hr and leadbuster.pl captured 2026-10-28 as stand-ins (rex.hr's own app screen is visible in its hero) (`screenshots/p2-cases-{1440,390}-{before,after}.png`). The picture also breaks the three-grids-in-a-row sameness (problems, services, cases) from inside the cells.
- Suggestion: one picture per case, chosen by the human: a cropped screen of the interface he built (ReX's recruiter view, the lead marketplace, the Helpfind CRM if it may be shown, two phone screens of the Energia Direct app), same ratio and treatment for all four, `alt` saying what it shows; logos in their colours on touch screens. Visitor sees: the products themselves before the words about them. Cost: the human supplies the screenshots and confirms each may be published (the internal CRM may not); about 25 lines in `cases.astro` (a sixth subgrid row) and `astro:assets` images; `home.spec.ts` cases checks rerun. Approved decision: adds a row to the KA0075 cases cell (2026-10-26: h3 is the logo, badge beside it); the copy stays. Related: KA0095 (own automation with a demo) and the case-study pages KA0030-KA0035.
- Status: ticket KA0122

## F3. Content labels in the text face, in sentence case

- Kind: improvement
- Found by: 2026-10-28-ka0118-taste-audit-bf2d703a (worker), 2026-10-28
- Where: `src/components/mb/sections/services.astro:147-154` (Dla kogo / Co dostajesz / Czas), `src/components/mb/sections/cases.astro:203-209` (Problem / Rozwiązanie / Efekt), `src/components/mb/label.astro:27-35` (form: Email, Wiadomość), `src/components/mb/field-set.astro:55-62` (Czego potrzebujesz), `src/components/mb/contact-link.astro:52-59`, `src/components/mb/sections/hero.astro:277-285` (W liczbach), `src/components/mb/sections/trust.astro:66-75`, `src/components/mb/footer.astro:128-135`
- What: Taste Skill "No tiny uppercase letter-spaced labels" (the one gallery fashion the data condemns: 16% of top sites against 57% of weak ones, `tells.md` §4) and "No text under 13px" (`copy.md` §7). `inspect.mjs`: 52 micro-labels and 20 text blocks under 13px on the home page. Most are labels a visitor reads to understand content (11px Geist Mono caps, 0.12em tracking), not the drawing's own marks. Throwaway on services, cases and the form labels: Geist 13px, weight 500, `--muted`, sentence case. Measured after: 28 micro-labels, 16 blocks under 13px (`screenshots/p3-labels-{1440,390}-{before,after}.png`).
- Suggestion: the same for every content label in the list above; keep Geist Mono for the drawing's marks (the "§ 01 / Oferta" label, cell numbers, dimension lines, the title block's header, the footer legend, the datum). Visitor sees: "Dla kogo", "Problem", "Efekt" as quiet captions above the text they belong to, easier to read on a phone; the drawing stays. Cost: about 8 rules in 8 files, `DESIGN.md` (mono labels) updated; `home.spec.ts:600-615` reads the `dt` text, which stays. Approved decision: touches KA0098's direction ("minimal brutalism: ruled cells, square corners, mono labels, Geist") and DESIGN.md; the human decides where the line between label and drawing sits.
- Status: ticket KA0123

## F4. One name for the main action, one arrow, quieter second actions

- Kind: improvement
- Found by: 2026-10-28-ka0118-taste-audit-bf2d703a (worker), 2026-10-28
- Where: `src/components/mb/header.astro:30-38` ("Umów rozmowę"), `src/components/mb/sections/hero.astro:76-83` ("Umów bezpłatną konsultację", outline "Zobacz, co mogę zrobić dla Twojej firmy") and `:98-102` ("Zobacz realizacje"), `src/components/mb/sections/problems.astro:46-48` and `src/components/mb/sections/how-i-work.astro:50-52` ("Umów bezpłatną rozmowę"); an arrow on 9 buttons of the home page (`iconEnd="lucide:arrow-right"` in `header.astro`, `hero.astro` ×2, `problems.astro`, `services.astro` (one per step, 3), `how-i-work.astro`, `contact-form.astro`)
- What: Taste Skill `copy.md` §4 "The primary action keeps one name everywhere on the page. One primary button per screen; a second action is a plain text link. No arrow glyph on every link and button; at most one arrow, on the primary action". The action that goes to #contact has three names; the 1440 first screen carries four buttons (header CTA, two hero buttons, the card's button), three with an arrow (`p1-hero-1440-before.png`).
- Suggestion: one label for #contact everywhere (e.g. "Umów bezpłatną rozmowę"); the hero's second action and the card's "Zobacz realizacje" as text links (`link.astro`), the arrow only on the primary button. Visitor sees: one obvious thing to press on each screen. Cost: about 10 lines; copy changes in their own `copy(<section>)` commits; `home.spec.ts` checks on button labels updated. Approved decision: touches KA0075's hero buttons and labels (2026-10-26, sent verbatim) and the copy in `tresc.md`.
- Status: dropped (the human followed the coordinator's recommendation on 2026-10-28: it changes approved copy or layout for little gain)

## F5. Running text in the full ink and at 16px

- Kind: improvement
- Found by: 2026-10-28-ka0118-taste-audit-bf2d703a (worker), 2026-10-28
- Where: `--ink-2` on running text: `src/components/mb/section-head.astro:169-174` (section leads), `src/components/mb/sections/hero.astro:218-224` (subtitle), `src/components/mb/sections/problems.astro:74-79`, `src/components/mb/card.astro:262-281`, `src/components/mb/accordion-item.astro:139-144` (FAQ answers); 15px in 15 component files (`grep -rln 'font-size: 15px'`)
- What: Taste Skill "Running text is in the full ink at 16px or more; grey is for secondary notes" (`SKILL.md` step 6.7) and `colour.md` §3. `inspect.mjs`: body 15px (`body-size` WARN at 1440 and 768), and 55% of the page's text is `#c8c3b8` (`--ink-2`) against 37% in `--ink` (`report.json` `textColors`). The difference from ink is small on this ground, so the visible change is modest: every lead and card sentence a step brighter and 1px larger.
- Suggestion: running text (leads, card sentences, FAQ answers, the hero subtitle) in `--ink` at 16px; `--ink-2` for notes, captions and the drawing. Visitor sees: a page that reads finished and confident, less "grey on dark". Cost: about 15 declarations; DESIGN.md's typography roles updated; no test under `tests/` names `--ink-2` or its value. Approved decision: none recorded; the palette is unchanged, only which role running text uses. KA0108 (form fields at 15px) is separate.
- Status: ticket KA0124

## F6. One live thing from the visitor's problem: what the manual work costs

- Kind: improvement
- Found by: 2026-10-28-ka0118-taste-audit-bf2d703a (worker), 2026-10-28
- Where: problems (#problems) or contact (#contact), `src/components/mb/sections/problems.astro:43-49` (the closing sentence and button)
- What: Taste Skill step 4 "One live thing ... made from the idea ... set the loan and read the real monthly figure", `critique.md` cap "No live thing: creativity cannot exceed 7.5" ("in blind tests every winning page had one and the jurors named it first"). The page's one live element is the cell width readout under the cursor: it belongs to the drawing, not to the visitor's business.
- Suggestion: a small calculator in the section that names the problems: people × hours a week spent on the task → hours a month and a year handed back, with the sentence and the button under it. Rules from the skill: real numbers only (no promised savings rate), works with a thumb, a plain fallback without script (the sentence alone), never blocks reading. Visitor sees: their own number before the call. Cost: a component, a vanilla script in `src/scripts/`, e2e for the figure and the no-JS fallback, copy approved by the human. Approved decision: adds an element to a KA0075 section (order and copy unchanged); related to KA0095 (a demo of Kacper's own automation).
- Status: dropped (the human followed the coordinator's recommendation on 2026-10-28: it changes approved copy or layout for little gain)

## F7. "Proces" is the one section head with an empty right half

- Kind: improvement
- Found by: 2026-10-28-ka0118-taste-audit-bf2d703a (worker), 2026-10-28
- Where: `src/components/mb/sections/how-i-work.astro:28-30` (SectionHead without a lede)
- What: Taste Skill "Equal outer margins; no section huddled on one side with the other half of the screen empty" (`layout.md` §5). Every other section head carries a lede on the right; "Od rozmowy do działającego systemu." stands alone, with the right half of the sheet empty beside it and above the first step (seen at 1440 in the audit's page slices, between the cases table and the first process card).
- Suggestion: a one-sentence lede for the process, in the tone of the others (e.g. what the visitor gets at each step and when). Visitor sees: the head row filled like the others. Cost: 3 lines plus the copy, in a `copy(process)` commit. Approved decision: touches KA0075's approved copy (the head has no lede in `tresc.md`).
- Status: dropped (the human followed the coordinator's recommendation on 2026-10-28: it changes approved copy or layout for little gain)

## F8. Legal pages: an empty right column under the lede

- Kind: improvement
- Found by: 2026-10-28-ka0118-taste-audit-bf2d703a (worker), 2026-10-28
- Where: `src/layouts/legal-layout.astro:27-35` (SectionHead and Prose), `src/components/mb/prose.astro` (the column, 690px)
- What: Taste Skill "Use the width the page has set up" (`layout.md` §5). `inspect.mjs` on `/polityka-prywatnosci/`: `hero-void` WARN, 28% of the first screen one empty block (600x600 at 840,300), `off-centre` (content 156px from the left, 330px from the right). The text column is the right measure; the right half holds only "Ostatnia aktualizacja".
- Suggestion: a table of contents of the page's h2s in the right column (the headings already carry ids, e.g. `#1-administrator-danych`), sticky under the header on desktop, above the text on a phone. Visitor sees: where each topic is, one click away, on a page people open to find one answer. Cost: about 40 lines in `legal-layout.astro` (headings from `getHeadings()`), an e2e check that each link reaches its heading. Approved decision: none.
- Status: dropped (the human followed the coordinator's recommendation on 2026-10-28: it changes approved copy or layout for little gain)

## F9. "CRM-y" in "Aplikacje szyte na miarę" breaks at its hyphen

- Kind: improvement
- Found by: 2026-10-28-ka0118-taste-audit-bf2d703a (worker), 2026-10-28
- Where: services, "Aplikacje szyte na miarę" (`customApps` in `src/data/home.ts`, rendered by `src/components/mb/sections/services.astro`)
- What: Taste Skill `type.md` §8 "a break that splits a phrase ... Author the break". At 1440 the line ends "CRM-" and the next starts "y i panele" (`screenshots/p3-labels-1440-before.png`, the 02.4 cell).
- Suggestion: a non-breaking hyphen (U+2011) in "CRM‑y", or carry it in KA0114 (one-letter Polish words), which already touches how copy breaks. Visitor sees: "CRM-y" whole. Cost: one character. Approved decision: none (same words).
- Status: ticket KA0125

## F10. Twelve type sizes where the skill counts five

- Kind: improvement
- Found by: 2026-10-28-ka0118-taste-audit-bf2d703a (worker), 2026-10-28
- Where: `inspect.mjs` sizes at 1440: 11 / 12 / 13 / 14 / 15 / 16 / 18 / 20 / 22 / 30 / 54 / 64; `font-size: 13px` ×9, `14px` ×18, `15px` ×15, `16px` ×5 in components (`grep -rn`)
- What: Taste Skill "Five sizes on a page is the ceiling ... nine sizes that are all near each other reads as mush" (`type.md` §2), `size-count` WARN. The four text sizes 13-16 and the three lead sizes 18-22 are a pixel or two apart.
- Suggestion: fold 13/14 into one small size and 15/16 into the body (F5), 18/20/22 into one lead; keep the mono marks at their size. Visitor sees: little on its own; it makes F1's contrast cleaner. Cost: about 40 declarations; DESIGN.md typography. Approved decision: touches the component sizes of the approved look (KA0075 / KA0098); KA0104 F16 dropped a full fluid scale for that reason, this is the narrower merge. Lowest benefit in this list.
- Status: ticket KA0126

## F11. The phone's logos stay grey

- Kind: improvement
- Found by: 2026-10-28-ka0118-taste-audit-bf2d703a (worker), 2026-10-28
- Where: `src/components/mb/sections/cases.astro:165-180`, the trust bar's logos (`src/components/mb/sections/trust.astro`)
- What: Taste Skill `motion.md` "Hover styles go behind `(hover: hover)`"; the logos are grey (`grayscale(100%)`, 0.6 opacity in cases) until a pointer hovers their cell, so on a phone a visitor never sees ReX, LeadBuster or Energia Direct in their colours (`screenshots/p2-cases-390-before.png`). Not in KA0110, which guards hover styles from sticky taps but leaves the resting state grey.
- Suggestion: under `(hover: none)` show the logos in colour at rest. Visitor sees on a phone: the client logos as the companies use them. Cost: 2 small rules. Approved decision: the grey-until-hover logos are part of the KA0075 trust bar and cases ("grey until the cell is hovered, like every logo on the page"); the human picks.
- Status: ticket KA0127

## F12. Blueprint devices the skill bans as house style

- Kind: improvement
- Found by: 2026-10-28-ka0118-taste-audit-bf2d703a (worker), 2026-10-28
- Where: `src/components/mb/section-head.astro` (§ label, dimension line, `<em>` under the brace with its callout), `src/components/mb/card.astro` (cell numbers, grips, width readout), `src/components/mb/page-frame.astro` (rulers), `src/components/mb/sections/hero.astro` (datum "X 0  Y 0", title block "Rys. KA-001 · Arkusz 1/1"), `src/components/mb/footer.astro:160-170` (legend), `src/data/process.ts` (01-05)
- What: house rules "No eyebrows", "No monospace outside real code", "No index numbering", "No thin rules ... no 1px outlined boxes, no grid lines, crosshairs or crop marks", "No styled accent word in a headline", and `tells.md` §4 (design-tool chrome: rulers, selection handles; micro-meta: coordinates, version stamps, middle-dot strings). `inspect.mjs`: 7 eyebrows, 47 hairlines, 38 outlined boxes, index numbers, Geist Mono at 9% of the text; `critique.md` caps a page with any of them at 6.5.
- Suggestion: none. F3 takes the part that is content, not drawing.
- Status: dropped (this is the blueprint-live look the human chose and approved: KA0081, KA0098 2026-10-14 and 2026-10-28, AGENTS.md "Wygląd". The skill says itself that these devices are more common on its top-scored sites than on weak ones - monospace labels 44% against 24%, index numbering 38% against 21%, thin rules 61% against 52% (`tells.md` §4) - and bans them by its owner's taste, so they are not a measured weakness.)

## F13. Motion the skill requires

- Kind: improvement
- Found by: 2026-10-28-ka0118-taste-audit-bf2d703a (worker), 2026-10-28
- Where: `src/styles/global.css` (the entrance), `src/components/mb/step-marker.astro` (the rail fill)
- What: step 9 "Move": an entrance for the parts of every section as it enters, a signature move, one moving picture (a found clip, a drift on a photograph); `inspect.mjs` `still-page` on the legal page (4 moving elements) and the 404 (6), `no-footage` on all three; `motion.md` scroll scenes, smooth-scroll, page-to-page view transitions.
- Suggestion: none.
- Status: dropped (the human decided on 2026-10-28 (KA0098) that only the first screen moves, once, on load, and nothing draws on scroll; AGENTS.md "Don't" forbids always-on animation and motion beyond the entrance, the rail and the button's slide. The home page has 51 moving elements at 1440 (`report.json`), above the skill's floor of 8. No honest footage exists yet; KA0095's demo of Kacper's own automation is the place for one. View transitions: KA0104 F20.)

## F14. Composition rules the approved layout already settles

- Kind: improvement
- Found by: 2026-10-28-ka0118-taste-audit-bf2d703a (worker), 2026-10-28
- Where: `src/pages/index.astro` (section order), `src/styles/global.css` (`.container`, 1160px), `src/components/mb/sections/{problems,services,cases,about,faq}.astro`
- What: "Tight margins (16-32px), content to the edges" instead of a centred container; "Each section has a different composition; none is a card grid" (problems, services and cases are ruled cell grids in a row; `card-rows` WARN at 390); "Stock section order: hero, logos, features ..."; "Sections told apart by their ground" (colour fields); "two or three anchor lines" (`ragged-edges`: 12 left edges at 1440, e.g. the about text at 580px against the leads at 841px); redesign-skill "Accordion FAQ sections" and "Three equal card columns as feature row".
- Suggestion: none.
- Status: dropped (the order is KA0075's brief; the grids, the about band and the two FAQ accordions side by side are layouts the human approved on 2026-10-14 to 2026-10-27; the rulers of the drawing are drawn on the container's edges and the sheet is one ground (KA0098), so edge-to-edge content and section colour fields would take the drawing apart. F2 varies the cases cells from inside.)

## F15. Inspector results that measure something else

- Kind: improvement
- Found by: 2026-10-28-ka0118-taste-audit-bf2d703a (worker), 2026-10-28
- Where: `src/components/mb/sections/hero.astro:244-258`, `src/components/mb/card.astro:103-104`, `src/components/mb/footer.astro:91,157`, `src/styles/tokens.css:21`
- What: `gradient` FAIL (44 fills) and `button-fx`; `off-centre` WARN on the home page (156px left, 177px right at 1440); `palette-cream` WARN; `icon-cards` FAIL (one row of three cards with an icon, not named by the inspector).
- Suggestion: none.
- Status: dropped (gradient: every "gradient" is `linear-gradient(<one colour> 0 0)`, the flat-colour way the drawing paints its rules and grips so the pen can trace them; nothing on screen is a gradient. Off-centre: the header and the container sit 156px from both edges at 1440 (`p1-hero-1440-before.png`: brand at 156, the card's right rule and the header button end at 1284); 177px is where the rightmost text happens to wrap. Palette-cream: `#ece7dc` is the ink on a near-black ground, not a cream ground, and the palette is recorded in DESIGN.md. Icon-cards: every boxed row on the page is an approved layout (F14).)

## F16. Redesign-skill upgrades the house rules forbid

- Kind: improvement
- Found by: 2026-10-28-ka0118-taste-audit-bf2d703a (worker), 2026-10-28
- Where: whole site
- What: from the retired `redesign-skill` (e04409a): grain and noise overlays, "true glassmorphism", spotlight borders, tinted or coloured shadows, mesh and radial gradients, background imagery at low opacity, parallax card stacks, smooth scroll with inertia, spring physics, `scale(0.98)` press, 200-300ms transitions, squircle avatars, swapping Lucide for another icon set, a font swap.
- Suggestion: none.
- Status: dropped (AGENTS.md "Don't": no gradients, glass, dot-grid or moving backgrounds, no movement on hover, every state change `--mb-snap` 0.12s, square corners; Lucide through `astro-icon` is the stack; Geist is on the redesign skill's own list of good faces, and the default skill no longer names faces at all.)

## F17. Rules for a page that does not exist here

- Kind: improvement
- Found by: 2026-10-28-ka0118-taste-audit-bf2d703a (worker), 2026-10-28
- Where: whole site
- What: a light/dark mode and its toggle (redesign-skill "Light/dark toggle", "Random dark sections in a light mode page"); a design system library or framework (`assets/base.css`, `app.css`); app-screen rules (`app-screens.md`); found archival pictures from open collections (`assets.mjs`); invented sample content; cookie consent.
- Suggestion: none.
- Status: dropped (the site is dark-only, AGENTS.md forbids theming machinery; the design system is the repo's own `tokens.css` and `mb/` components, no library; this is a page, not an app screen; archival pictures of "the subject's world" would show nothing of Kacper's work, F2 asks for the real thing; the page invents nothing; the site sets no cookies.)

## F18. Rules KA0104 already ticketed

- Kind: improvement
- Found by: 2026-10-28-ka0118-taste-audit-bf2d703a (worker), 2026-10-28
- Where: see each ticket
- What: `copy.md` §7 "`text-wrap: pretty` on paragraphs" and orphan words; "Hover styles go behind `(hover: hover)`"; "Touch targets at least 44px"; "Section gap ... 72-112px on a phone" and fluid headline sizes; one-letter words and authored breaks; "`prefers-reduced-motion: reduce` means fewer and gentler, not none"; derived colours from the palette; form fields at 16px.
- Suggestion: none.
- Status: dropped (already tickets from KA0104: KA0106 text-wrap pretty, KA0110 hover on touch, KA0111 tap targets, KA0113 section rhythm and headline clamps, KA0114 one-letter words, KA0116 reduced motion, KA0117 derived colours, KA0108 iOS form fields; also KA0105, KA0107, KA0109, KA0112, KA0115, which the skill does not cover.)
