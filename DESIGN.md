---
version: alpha
name: kacperadler.pl
description: Portfolio site of Kacper Adler, dark only - minimal brutalism as an engineer's drawing, a ruled sheet of square cells drawn with 1px ink rules on a solid Galactic Blue substrate, some sections cut out of it as Panel fields by freehand break lines, dimension lines and item numbers in small mono caps, the process as the sheet's route of detail drawings whose lime layer is drawn in along it; heavy Geist headlines, content captions in Geist in sentence case, the drawing's labels in Geist Mono, one Lime Green accent and True Blue for state.
colors:
  ink: "#ece7dc"
  ink-2: "#c8c3b8"
  muted: "#9d9c95"
  base: "#04183b"
  panel: "#0a2350"
  panel-elevated: "#112c5e"
  lime: "#7ed321"
  lime-2: "#a3e45c"
  true-blue: "#2c92e5"
  on-accent: "#04183b"
  error: "#e07a70"
typography:
  display-xl:
    fontFamily: Geist
    fontSize: "min(clamp(2.5rem, 1.7403rem + 3.1169vw, 4rem), 12vw)"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: -0.05em
  display-lg:
    fontFamily: Geist
    fontSize: "min(clamp(2rem, 1.3036rem + 2.8571vw, 3.375rem), 13vw)"
    fontWeight: 800
    lineHeight: 1.02
    letterSpacing: -0.045em
  display-poster:
    fontFamily: Geist
    fontSize: "min(clamp(2.5rem, 0.9805rem + 6.2338vw, 5.5rem), 13vw)"
    fontWeight: 850
    lineHeight: 0.96
    letterSpacing: -0.05em
  display-md:
    fontFamily: Geist
    fontSize: 20px
    fontWeight: 750
    lineHeight: 1.2
    letterSpacing: -0.035em
  body-lg:
    fontFamily: Geist
    fontSize: 20px
    fontWeight: 400
    lineHeight: 1.55
  body-md:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.55
  body-sm:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.6
  label-mono:
    fontFamily: Geist Mono
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1
    letterSpacing: 0.14em
  caption:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.4
rounded:
  none: 0px
  full: 50%
spacing:
  md: 16px
  lg: 32px
  xl: 64px
  2xl: 96px
  section-gap: "clamp(5.5rem, 4.487rem + 4.1558vw, 7.5rem)"
  block-gap: "clamp(2rem, 1.4935rem + 2.0779vw, 3rem)"
components:
  cell:
    backgroundColor: "{colors.base}"
    rounded: "{rounded.none}"
    padding: "{spacing.lg}"
  button-default:
    backgroundColor: "{colors.lime}"
    textColor: "{colors.on-accent}"
    rounded: "{rounded.none}"
    padding: "0 18px"
  button-outline:
    backgroundColor: transparent
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "0 18px"
  section-label:
    typography: "{typography.label-mono}"
    textColor: "{colors.ink-2}"
---

## Overview

`kacperadler.pl` is minimal brutalism drawn as an engineer's blueprint: a ruled sheet. Content sits in cells drawn with 1px `ink` rules that share their edges, on a solid `base` substrate, each cell numbered on its rule as an item of its section; every section opens under a dimension line that reads the section's width in px; the hero carries the drawing's datum and the sheet's title block, the footer its legend. Two rulers run down the page at the container's edges. Headlines are heavy Geist with tight negative tracking; a label the visitor reads with the content is a quiet Geist caption in sentence case, while the drawing's own labels and annotations are small mono caps. There are no rounded corners (the radio is the one circle), no glass, no gradients, no drifting background: a hovered cell lights up from inside under four corner grips and moves nothing, a button's face lifts off its white layer towards the cursor, and every state change is a short linear switch, except one slide: a loading button's label and spinner. The one thing that moves on its own is the first screen's entrance: with JavaScript, on page load, the header comes down, the headline rises, the hero is drawn by the pen and the trust bar's cells rise in one by one, once, in about 1.7s (see The drawing).

There is one design, served at `/`, and it is dark only. Its components live in `src/components/mb/`, are shown with every variant and state at `/ui` (`bun dev` only), and every production page is built from them.

## Concept (KA0146)

- **Idea:** the site is Kacper's technical drawing (Rys. KA-001), and his process is its route.
- **Metaphor:** a process sheet (karta technologiczna) with detail views.
- **Signature:** the route fills, and each station's detail drawing is drawn in `lime`.
- **Emotion:** precise and calm; someone has this under control.
- **Motion verb:** drawn by a pen, along the route.
- **Screenshot:** a process card with the rail lit up to it and its revision cloud drawn in `lime`.
- **Genericness test:** a generic model lands on soft blob waves, pastel illustrated scenes and parallax. This site instead uses a 1px drafting break line for the wave, line drawings built from drafting marks (callout boxes, dimension chains, a revision cloud, a tolerance band), square cells everywhere else, colour from the palette's own dark steps, and no parallax.

Per section: hero, trust bar, `§ 02 Oferta`, `§ 04 Proces`, `§ 06 FAQ` and `§ 07 Kontakt` stand on `base`; `§ 01 Problem`, `§ 03 Realizacje` and `§ 05 O mnie` on `panel` fields. Every home section head is a `poster`. Contact stays on `base`: a field's fill would equal a disabled field's.

## Dark only

`color-scheme: dark` on `:root` (`src/styles/tokens.css`) fixes the page to dark: there is no theme switch and no second palette. The palette is the owner's three colours (KA0145), each a property of its own: Galactic Blue `--galactic-blue` (`#04183b`), True Blue `--true-blue` (`#2c92e5`) and Lime Green `--lime-green` (`#7ed321`); the tokens below use them. The frontmatter lists the values that render. The CSS custom properties behind them:

| Token            | CSS property          | Value                    |
| ---------------- | --------------------- | ------------------------ |
| `base`           | `--v2-bg`             | `var(--galactic-blue)`, `#04183b` |
| `panel`          | `--v2-panel`          | `#0a2350`, a lighter step of Galactic Blue |
| `panel-elevated` | `--v2-panel-elevated` | `#112c5e`, a step lighter still |
| `ink`            | `--ink`               | `#ece7dc`                |
| `ink-2`          | `--ink-2`             | `#c8c3b8`                |
| `muted`          | `--muted`             | `#9d9c95`                |
| `lime`           | `--blue`              | `var(--lime-green)`, `#7ed321` |
| `lime-2`         | `--blue-2`            | `#a3e45c`, a lighter step of Lime Green |
| `true-blue`      | `--true-blue`         | `#2c92e5`                |
| `error`          | `--error`             | `#e07a70`                |
| hairline         | `--v2-line`           | `oklch(from var(--ink) l c h / 0.1)`: `ink` at 10%, so it follows `--ink`; over `base` it paints `rgb(27, 45, 75)` |

`on-accent` has no property of its own: text on a `lime`, `true-blue` or `error` block is `base` (`--v2-bg`), 9.4:1, 5.3:1 and 6:1; never white, which is 3.3:1 on `true-blue`. The accent's properties keep the names `--blue` and `--blue-2` from the earlier navy accent; they hold Lime Green. The `--v2-` prefix is left over from an earlier redesign; it names no separate version.

The minimal brutalism vocabulary, in the same file:

| Token          | Value                 | Use                                                     |
| -------------- | --------------------- | ------------------------------------------------------- |
| `--mb-rule`    | `var(--ink)`          | the 1px rule that draws a cell                          |
| `--mb-hair`    | `var(--v2-line)`      | dividers inside a cell, the page edges, disabled frames |
| `--mb-shift`   | `4px`                 | the hard shadow offset; the white layer under a button is tighter, 2px at every size |
| `--mb-snap`    | `0.12s linear`        | every transition but the two slides                     |
| `--mb-slide`   | `0.3s ease-out`       | a loading button's label and spinner                    |
| `--mb-display` | `var(--sans)` (Geist) | headlines                                               |
| `--mb-enter`   | `cubic-bezier(0.33, 1, 0.68, 1)` | the entrance's easing; `--mb-enter-rise` (`0.6s`) is one part's travel |
| `--mb-enter-pen` | `0.4s`              | when, into the entrance, the pen starts on the hero     |
| `--mb-pen`     | `1s`                  | how long the pen takes over the hero; the trust bar's cells close the entrance by 1.7s |
| `--mb-note`    | `500 10px / 1` mono   | the drawing's annotations: dimensions, item numbers, callouts, the datum, the title block header |
| `--mb-grip`    | `7px`                 | the side of a selected cell's corner grips              |
| `--mb-header`  | `71px`; `65px` at 880px; `105px` under 360px | the sticky header's height (its `min-height`); the page's `scroll-padding-block-start` is this plus 8px, so an in-page link parks its section head, ticks included, under the header |

## Colors

- **`base` (`#04183b`, Galactic Blue):** the substrate and the idle fill of every cell. Solid: no dot grid, no gradient.
- **`panel` (`#0a2350`):** the flat surface: disabled and loading controls, and the colour field (`.mb-band`) behind `§ 01 Problem`, `§ 03 Realizacje` and `§ 05 O mnie`. A field sets `--v2-bg` to `panel`, so a cell, the dimension's mask, an outline button's face and text on `lime` inside it take the field colour (`panel` on `lime` is 8.3:1; `true-blue` grips on `panel` about 4.6:1; `muted` 5.6:1).
- **`panel-elevated` (`#112c5e`):** the raised surface - the secondary button and badge - and a lit cell: the fill of a hovered card, under its `true-blue` grips and item number.
- **`ink` / `ink-2` / `muted`:** `ink` draws the rules and sets headlines and running text, `ink-2` notes, form labels and the drawing's labels and annotations, `muted` content captions, idle form frames, tags and disabled text (5.6:1 on `panel`, 4.9:1 on `panel-elevated`, never lowered opacity).
- **`lime` (`#7ed321`, Lime Green):** the **only** accent: the main call to action (the default button: the contact form's send button, the header CTA) and the default badge, links (their underline, hover and active colour), the dimension brace and callout under `<em>` in a headline, the `§` section counter and the dimension on its line, the datum cross, service numbers, the process rail's fill and the process drawings' 2px layer, the brand mark, text selection. Inside a `panel` field the text on it is `panel`, 8.3:1. `lime-2` is its hover and press. 9.4:1 on `base`, 7.3:1 on `panel-elevated`.
- **`true-blue` (`#2c92e5`, True Blue):** the second colour, used sparingly and only for state: focus rings, a focused field's hard shadow, a selected cell's grips and filled item number, the sent contact form's shadow. Never text and never the accent: 5.3:1 on `base`, 4.1:1 on `panel-elevated` (above the 3:1 a ring needs).
- **`error` (`#e07a70`):** form errors, the required `*` after a field label and the destructive variants only (the invalid frame, the error line, the send-error banner). Not an accent: it never decorates. 5.25:1 on `panel`, 6:1 on `base`.

## Typography

Two faces, both self-hosted variable woff2:

- **Geist** (`--sans`, `--mb-display`) - headlines at 700-800 with tight negative tracking (`display-*`), button labels at 650, running prose, form fields, and the captions inside content (`caption`: 14px at 500, sentence case as written, no tracking - KA0123): a step's `Dla kogo` / `Co dostajesz` / `Czas`, a case's `Problem` / `Rozwiązanie` / `Efekt`, the title block's `W liczbach`, the trust bar's line, a contact link's `Email` / `LinkedIn` and the footer's column titles in `muted`; a form field's label and a `label` legend in `ink-2`, so a disabled label (`muted`) and the `(opcjonalnie)` hint stay dimmer than it.
- **Geist Mono** (`--mono`) - the drawing's uppercase labels (`label-mono`: the section label `§ 01 / Oferta`), badges, tags, the footer copyright.

`text-wrap: balance` on headlines; every other text takes `text-wrap: pretty` from `html`, so a paragraph does not end on a lone word (Chrome and Safari; Firefox wraps as before). `<em>` in a headline stays `ink`, on one line, under a `lime` dimension brace (a 0.14em-high bracket, open at the top, `max(2px, 0.05em)` thick) with a callout letter (A, B, counted per headline) on a `lime` box at its right end.

Running text is `ink` at 16px or more: the hero subtitle, the about text and a problem's closing line (`body-lg`, 20px), section leads, card sentences (a problem and its effect, a step's facts, a case's rows, a process step, an experience entry, a case study's summary), FAQ answers, the sent form's message and prose (`body-md`, 16px). `ink-2` is for what qualifies it, never for a sentence the visitor reads through: labels and captions, a step's note and the footer's tagline (`body-sm`, 14px), the title block's captions under its figures (16px), a card's description line, the drawing's annotations. Form fields are the separate case of KA0108.

The text face keeps a short scale (KA0126): 14px small (`caption`, `body-sm`, nav and footer links, button labels - `sm` and `default` share it, `lg` is 16px, `xs` 12px), 16px body (`body-md`, and an `sm` card's title), 20px lead (`body-lg`, and `display-md` for a card's or a step's title, an experience entry's title and the footer's brand), and 12px for the form's `(opcjonalnie)` hint. Prose's `em` sizes land on it too (lead and h3 20px, table 14px). Above it only the headlines (`display-*`, prose's h1 and h2, the sent form's title at 24px), the title block's figures (30px, 26px on a phone) and the mobile sheet's links (28px). The drawing's Geist Mono text lands on it too (KA0140): 12px for its labels and badges (`label-mono`, badges, the footer copyright, a case study's labels, prose's table head, a small avatar's initials), 14px for its numbers (a service step's `01`, the process rail's marks, pagination, the skip link, an avatar's initials; 20px in a large one); the brand mark's `k` is 16px, and the favicon draws it as tall. Only the annotations (`--mb-note`, 10px, generated content around the cells) keep their own size. `type scale` in `design.spec.ts` (every page) and its twin in `ui-catalogue.spec.ts` (every component) hold every text to it; `favicon.spec.ts` holds the favicon's `k` to the brand mark's.

Fluid sizes, one `clamp()` each, bounds in `rem` and a `rem + vw` slope worked out from a 390px phone and the 1160px container, held at both ends, so they follow the reader's font size as well as the width: the hero headline (`display-xl`) 40px → 64px, a section headline (`display-lg`) 32px → 54px, `--mb-section-gap` and `--mb-block-gap` (Layout). A `poster` section headline (`display-poster`) runs 40px → 88px on its own slope (`0.9805rem + 6.2338vw`). A headline is also capped at a share of the viewport (12vw in the hero, 13vw in a section) so a large font on a narrow screen never pushes its longest unbreakable word (`automatyzacje,` about 7em, `działającego` with its callout about 6.2em) past the edge. The rest of the type is fixed px (KA0104 F16), apart from the fields (`max(16px, 1rem)`) and prose (`1rem`).

The drawing's annotations (`--mb-note`: 500 10px/1 Geist Mono, uppercase or figures, 0.08em tracking) are the dimension on a section's line (`lime`), a cell's item number (`ink-2` on `base`, `base` on `true-blue` when selected), the callout letters, the datum (`X 0  Y 0`), the title block's header and the footer's legend. They and the section label are the drawing and stay mono; every label a visitor reads with the content is Geist.

## Layout

- **Container:** max-width `1160px` (`--container`), 16px side padding. `page-frame.astro` draws a fixed ruler down each edge of the container width (a `muted` hairline at 0.45 opacity with a tick every 16px, longer at 32 and 64, mirrored on the right); below 1160px they are gone.
- **Sections:** each opens with `section-head.astro` - an `ink` rule as a dimension line (11px extension ticks at both ends, the section's own width in px in `lime` on its middle, from the head's container size through typed trigonometry; a browser without it prints nothing), the numbered mono label (`§ 01 / Problem`, a CSS counter the frame resets; the trust bar has no head, so it takes no number, and its cells read `00.1`, `00.2`), then the headline left and the lede right, bottom-aligned; one column at 880px and below. A `poster` head (every home section) sets the headline on its own full-width row in `display-poster` (40px on a 390px phone to 88px at 1160px, weight 850) and the label 24px over it, the lede 24px under it in the right column; legal pages, case studies and the 404 keep the two-column `display-lg` head. Sections are `--mb-section-gap` apart (88px on a 390px phone growing to 120px at 1160px); a `panel` field's break line cuts that gap in half: half above the field, half inside it at the top and at the bottom, half before the next section, so content to content stays one gap; inside a section, the head, the table and the button under it are `--mb-block-gap` apart (32px growing to 48px over the same widths). The hero opens 96px under the header.
- **Cells:** `cell-grid.astro` collapses cells into one ruled table - no gap, every cell pulled 1px over its neighbour so two cells share one rule. Fixed columns (case highlights: 2; problems and the offer: 3, problems 2 between 560px and 880px, its cells on a shared subgrid; one column at 880px; with 2 an odd last cell spans the row) or as many as fit a minimum width (the experience list: 300px, case studies: 320px). The trust bar sets its own: five logos a row, two at 880px with the lone last one spanning.
- **No radius:** every corner is square. A new component sets `border-radius: 0` on native controls that carry a UA radius.

## Components

Every component is one `.astro` file in `src/components/mb/` with scoped CSS, shown with each variant and state at `/ui`. States there are forced with `[data-state="hover" | "pressed" | "focus-visible" | "focus"]`, `.active` and `disabled`; each component declares those selectors next to its real `:hover` / `:active` / `:focus`, so changing a state means changing one rule. Hover is the exception: the real `:hover` sits in a twin rule inside `@media (hover: hover) and (pointer: fine)`, the forced one outside it, so changing a hover means changing both. Names and sets follow shadcn/ui (Astro and plain CSS, no React, Base UI, Tailwind or shadcn); shadcn's sub-components are named slots (card `image` / `title` / `description` / `action` / `footer`, alert `title` / `action`), breadcrumb and pagination take data props.

| Component | Variants and sizes |
| --------- | ------------------ |
| `button` | `default` (lime block, ink rule; hover `lime-2`; `.active` an ink block with no layer), `secondary` (hover: only the lift, the hairline stays), `outline` (hover: the lit cell), `ghost`, `destructive`, `link`; the four with a rule sit on the white layer (an `ink` box of its own 2px down and right, which never moves, always under a solid face): hover lifts the face 1px towards the cursor, press puts it down onto the layer in 0.08s; ghost presses to an `ink-2` block, link to `lime-2` text over a 3px underline; sizes `xs` 28 / `sm` 36 / `default` 44 / `lg` 52px and the square `icon-xs` / `icon-sm` / `icon` / `icon-lg` (need `aria-label`); `sm` and `icon-sm` take a tap in an empty box drawn nowhere, at least 44px each way (`::after` on the still element); `iconStart` / `iconEnd`, `href`, `loading` (the label slides out left, the spinner in from the right, the width stays) |
| `badge` | `default` (`teraz`, `Zlecenie`), `secondary`, `outline` (year range, step duration), `destructive`, `ghost`, `link`, `tag` (a technology: the `muted` frame, not caps), `status` (availability: `ink` text in a `lime` frame behind a square `lime` dot); icons, `href` (press: an ink block), `fillOnCellHover` |
| `alert` | `default`, `destructive` (the send-error banner) |
| `avatar`, `avatar-group` | `sm` / `default` / `lg` (32 / 48 / 96px); image or initials (decided at build time), `badge`; in a group each overlaps the one before by a quarter of its side inside a 2px `base` ring, and the "+N" count matches the initials avatar |
| `radio` | a circle, a `lime` dot when checked |
| `choice` | a checkbox drawn as the contact form's chip (several can be checked), 44px high like `input`, so a row of chips is level with a field beside it: hover the lit cell, press `panel`, checked a `lime` block, `lime-2` on hover, checked and disabled a `muted` block; the same 1px frame and type weight in every state, so checking one moves nothing; the native input stays in the tab order (Space checks it) |
| `checkbox`, `input`, `textarea`, `label`, `field`, `field-set`, `separator`, `spinner` | shadcn's states; hover shows an unchecked checkbox's check faintly; `textarea` grows with its text from 5lh to 14lh (`field-sizing: content`), then scrolls, with no resize handle (a browser without `field-sizing` keeps a 130px floor and vertical resize); `field` orientation `vertical` / `horizontal` / `responsive` |
| `accordion`, `accordion-item` | `single` / `multiple`, plain / `bordered`; native `<details>`, height and chevron animate |
| `breadcrumb`, `pagination` | chevron / slash, collapse (the ellipsis opens the hidden pages as a native popover menu); numbers / icons, `jump` (a GET form to a page number) |
| `card`, `cell-grid` | `default` / `sm`; cells share their rules |
| not in shadcn | `link` (`inline` / `nav` / `footer` / `case`), `section-head`, `prose`, `brand`, `header`, `footer`, `mobile-sheet`, `page-frame`, `contact-form`, `contact-link` (an `sm` cell as the link: `lime` icon, the label as a `caption`, the value pushed right, under them when narrow; `newTab`), `process-figure` (a process step's detail drawing in a card's `image` slot: a 1px `ink` drawing standing drawn and a 2px `lime` layer over it, drawn in as the page scrolls, piece by piece in the drawing's order, each uncovered left to right and eased: on its own from the drawing's top at 80% of the viewport to its bottom on the middle line, in the process in its own slot of the steps' order (`--mb-figure-timeline`, `--mb-figure-from` / `-to`, set by `how-i-work`); drawn from the start under reduced motion or without view timelines), `field-edge` (a colour field's break line: a 240px freehand wave tile repeated along the edge, the field's fill out to it and its 1px `ink` stroke; `side` top or bottom), `step-marker` (a square mono number on the 1px process rail, on its step row's vertical centre; a 2px `lime` line fills the rail as the page scrolls, in a piece into the mark and a piece out of it, and a mark, empty in an `ink` rule until then, fills `lime` from its top edge to its bottom one, eased, its number turning `base` as the fill passes its middle - scroll-driven CSS animations: on its own each piece and the mark follow the viewport's middle line, in the process each takes its slot of the steps' order (`--mb-step-timeline` and the `--mb-step-*-from` / `-to` ranges, set by `how-i-work`); filled from the start under reduced motion or without view timelines), `sections/*` |

### Page frame
`page-frame.astro` goes straight inside `<body>`: the edge hairlines, the skip link, `header.astro` (sticky on the substrate under an `ink` rule, `--mb-header` tall: brand, nav links, the `sm` contact CTA; below 880px the menu button instead of the links; at 400px and below the CTA drops its arrow and the row wraps rather than scroll sideways; under 360px the CTA and the menu button always take a second row), the page, `footer.astro` (under an `ink` rule: brand and tagline, two link columns, the copyright under a hairline), the EU funding band (`layout/eu-funding.astro`, white - its logos need a white ground) and, as a sibling, `mobile-sheet.astro` (the full-screen menu on the substrate, switched in with an opacity snap; where its links run taller than the screen - a phone held sideways - it scrolls them itself, never the locked page behind, and its close button scrolls away with them). `BaseLayout` wraps every production page in it; `/ui` is its own document around it, without `contact-form.ts`. The footer's bottom row ends in the sheet's legend, `Wymiary w px · Skala 1:1 · Rys. KA-001`, in the copyright's mono.

### Cells
`card.astro` is a cell: `base` fill in a 1px `ink` rule, 32px padding (16px on `sm`), its item number on the top rule, 12px from the left corner (`01.3`: the section's counter, then the cell's within the section - `bl-cell`, reset by the section head). Hover selects it as a CAD selection does: it lights from inside - `panel-elevated` - under four `true-blue` squares (`--mb-grip`) on its corners, 4px outside the rule, and the item number fills `true-blue` and reads the cell's outer width (`01.3 ↔ 368`); nothing moves. A service or example number turns `lime`, a logo (trust bar, case highlight, experience list) goes from grey to colour, a `fillOnCellHover` badge fills. The experience list in the about accordion is the one table without a frame of its own (its outer rules clipped, so the cells are ruled only between each other), and there a hovered cell keeps its `base` fill: only the grips, the number and the logo answer. The process steps carry their numbers on the rail, so their cells have no item number. The hero's results card is the sheet's title block: a framed table with the header strip `Rys. KA-001 · Arkusz 1/1` across its top under an `ink` rule, then the caption and the rows under hairlines; the case study facts are a framed table of `label | value` rows under hairlines.

### Hard shadow
The hard offset shadow (`--mb-shift`, no blur) marks what the visitor acts on. Under the `default`, `secondary`, `outline` and `destructive` buttons it is the white layer: an `ink` box of its own (`.mb-btn-layer`), not a `box-shadow`, so it never moves - only the face (`.mb-btn-face`) lifts off it on hover and covers it on press, while the button element itself stays put as the hit area. A focused field shifts a `true-blue` one out, and the contact form sheet carries a `true-blue` one after it is sent; focusing a field lights only that field, never the sheet. The brand's mark slides an `ink` one out on hover (a `box-shadow`, the one that moves, under `no-preference` only) while `Adler` brightens from `ink-2` to `ink`.

### Links
`inline` (ink text over a 2px `lime` underline; hover: the `lime` underline rises over the word, `base` text on it (a `background-size` grown from 2px to the full height, so it moves only under `no-preference`), press the same in `lime-2`; no hit area past its text, like a link in `prose`: WCAG 2.5.8 exempts a link in running text, each is far wider than 44px, and an area above or below would take taps meant for the lines around it), `nav` (an ink bar draws in under it from the left on hover; `.active` is a `lime` bar under `lime` text; press: lime), `footer` (`ink-2`, an underline fades in on hover, an optional leading icon turns `lime`; at least 24px high; an empty `::after` takes a tap up to 44px each way; the footer's lists keep 22px between links, so those areas never overlap and a tap under a link never opens the next), `case` ("Zobacz realizację": heavy ink text over a `lime` underline, the arrow after it nudges 3px right on hover and 6px on press; the company name is in its accessible name).

### Form fields
Idle: a `muted` frame. Hover: an `ink-2` frame. Focus: an `ink` frame and the hard `true-blue` shadow shifting out from under it. A required field's label ends in a coral `*`; an optional one is followed by `(opcjonalnie)` a size smaller (12px) in `muted` (5.6:1 on `panel`). Invalid (`[data-invalid]` on the field or `aria-invalid`): a coral frame and a mono error line behind a coral rule. Disabled: a flat `panel`; while the contact form sends, every field, chip and the submit button are disabled, and come back when it ends. The script hooks are `contact-form.ts`'s: `data-contact-wrap` (`data-state`: `idle | submitting | error-validation | error-submit | success`), `data-contact-form`, `data-field`, `data-invalid`, `data-submit`, `data-form-error`, `data-form-success`, `data-form-reset`, the `website` honeypot.

### Prose
`prose.astro` (`mb-prose`) sets Markdown / MDX bodies - legal pages, case studies: the rhythm of @tailwindcss/typography at 65ch, heavy Geist headings with h2 under an `ink` rule, `lime` square bullets and mono counters, the quote behind a `lime` rule, code in a hairline box, the table fully ruled. A `<pre>` scrolls in its own box and table cells wrap, so neither widens the page.

### Pages
- **Home** (`/`, KA0075): the brief's order - hero (the drawing's datum - a 17px `lime` cross with `X 0  Y 0` - in the top padding over the headline's corner; beside the text a results card as tall as it, the sheet's title block: the header strip `Rys. KA-001 · Arkusz 1/1`, a caption (`W liczbach`), three equal ruled rows of a big figure over its text, an outline button to `#cases`; no photo. The text column is padded for the card's rule, header strip and the gap under it, so the headline starts on the card caption's line and the hero buttons rest on the card button's; at 880px and below one column, every button full width), trust bar (a caption over a row of logo cells, no head; each logo sized by optical weight, a bare mark with the company set beside it; low cells on mobile), problems (on a `panel` field; six cells: a heading, a sentence and, under a hairline, the effect after a `lime` arrow; the cells of a row share a subgrid, so they are equally tall and the effects start on one line), the three-step offer (custom apps as a full-width row under the three steps; rows on a shared subgrid so each label runs straight through the table, the pricing answer as the lede, only the first step's button `default`), case highlights (on a `panel` field; four, newest first; the company once: the h3 is its logo, two for a project built for two companies, grey until hovered, beside the kind badge; the cells of a row share a subgrid, so they are equally tall and the labels run straight across), process (a lede under the poster head; each card opens on its step's detail drawing (`process-figure`), then the title and duration, the description and, under a hairline, the step's outcome after a `lime` arrow; on the desktop a central rail, the steps alternating left and right and staggered - each card starts a little past the middle of the one before - each joined to its mark by a short connector, 1px `ink` turning 2px `lime` as the mark's fill passes its middle; the duration on the title's line at the card head's right end, never wrapped under it; cards on one side 64px apart (a card with its drawing is about 330px tall, the drawing at most 80px high and centred), so each card starts a little past the middle of the one before and the route reads as one zigzag; one column with the rail on the left at 880px and below, the cards 40px apart, no connectors; ending at a button to `#contact`), about (on a `panel` field; photo and text on one band: the text starts on the photo's top edge and the photo, filling its frame and cropped to fit, ends with the link cells under the text; the full experience list in a closed accordion), FAQ (two bordered accordions side by side in one ruled table across the container, one column at 880px and below), contact (the form, then the link cells as the last row of the same sheet across the container; the fields in the brief's order: email, company (optional, labelled so), project type, message; once the sheet is 720px wide, the email and the company sit side by side, the project types in one row under them, then the message). Every part ends at, or sits by, a button to `#contact`; the technologies are tags, never in a heading.
- **Legal pages** (`legal-layout.astro`): a section head with the h1 (label `Informacja prawna`, lede `Ostatnia aktualizacja: <date>`), then the prose.
- **Case study** (`/realizacje/<slug>/`): a section head with the company as h1 and the summary as lede, the facts table (role, period, stack as tags), the MDX body in prose, then a default `Napisz do mnie` and an outline `Wszystkie realizacje` (to the list) under an `ink` rule.
- **Case study list** (`/realizacje/`, built only when a case study exists, and then linked by `Wszystkie realizacje` in the home page's `#cases`): a section head with the h1, then a cell grid of cards as in the experience list - period badge (outline), company, role (mono `lime`), summary, the `case` link. The menu holds home page sections only (`Realizacje` is `/#cases`), so no entry is active here.
- **404**: a section head with the h1 and `404` for its label (the rule a dimension line, as on every page), the lede beside it, then a default and an outline button.
- **OG image** (`/og-default.png`, 1200×630, drawn at build time by `src/pages/og-default.png.ts`): a ruled sheet of two cells on the solid `base` - the photo, square, in its 1px `ink` frame, and a table of rows: the square `lime` mark with the role label, the heavy name on two lines, the tagline in `ink-2`, the url in mono `lime`. The sans text is Geist (ExtraBold for the name and the mark, regular for the tagline) from a TTF of variable Geist (npm `geist` 1.7.2) in `src/assets/fonts`, since librsvg cannot load the woff2; the mono labels are DejaVu Sans Mono.
- **Favicon** (`public/favicon.svg`, and `public/favicon.ico` at 16, 32 and 48px rendered from it): the brand mark of `brand.astro` on a 28-unit box - a `lime` block in a 1px `ink` rule, square, with the Geist ExtraBold `k` in `base` as a path, so it needs no font.

## The drawing

The blueprint is the site's signature (KA0072, KA0080, KA0081, KA0098): the page is an engineer's drawing, standing complete, and the first screen enters once, on page load, as one short choreographed sequence. The marks: the rulers on the frame's edges; the datum and the title block in the hero; a dimension line, `§` label, brace and callout on every section head; a numbered frame on every cell; the dash-dot centre line of the process rail and the detail drawing on each process step; the freehand break line (linia urwania) that opens and closes a `panel` field, cutting the section out of the sheet as a view; the footer's rule, hairline and legend. Nothing below the first screen plays on its own, and nothing draws on scroll (KA0098, 2026-10-28: the scroll-drawn version read as too many lines moving) but one layer: the `lime` layer of the process drawings, drawn in along the rail (KA0146) - the ink drawings stand drawn. The drawings are built from drafting marks: process boxes and callout squares on leaders (Rozmowa), a sheet with its title block and a schedule under a dimension chain (Plan i wycena), an exploded stack of modules on a centre line (Wdrożenie etapami), a revision cloud and revision triangle round one step of a part (Feedback; the cloud's arcs are the drawings' one curve), a trace between two dashed tolerance lines (Opieka). Strokes do not scale, so they stay 1px and 2px at any width. The palette, the type and the hard shadow are unchanged by it.

The entrance (about 1.7s, `html[data-bl-enter]`, transform and opacity only, no blur) paints its first frame and holds it until that frame is on the screen: every animation is declared `paused`, and the inline head script sets `data-bl-enter="go"` once the browser reports the first contentful paint (where no report can come - no paint timing, a page hidden before it painted - two animation frames later), so the first thing seen is the header above the top edge and the headline below its place, and the whole travel is watched. Then: the header comes down from the top edge (`bl-enter-down`, 0-0.6s, 71px) as the headline rises 64px into place (`bl-enter-slide`, 0.05-0.65s, transform only: painted from the first frame it stays the page's largest contentful paint, which a fade from opacity 0 would take it out of); the subtitle rises into place after it (`bl-enter`: 24px up and opacity in, 0.3-0.9s), every rise over `--mb-enter-rise` 0.6s with `--mb-enter` `cubic-bezier(0.33, 1, 0.68, 1)` (ease-out: half the travel in the first third, a soft landing, so the motion is seen and never pops); the pen starts at `--mb-enter-pen` (0.4s) and runs `--mb-pen` (1s) over the hero: the datum cross grows from its centre (0-0.25 of the pen), `X 0  Y 0` is written (0.25-0.5), the brace runs out under the `<em>` (0.3-0.7) and gets its callout (0.7-0.9), the title block traces its frame clockwise (0-0.6) and writes its header (0.5-0.8); while it is traced its caption (0.75s) and its rows (0.82s, 0.9s, 0.98s, a cascade) rise in, and its button and the hero buttons rise in (0.95s); the trust bar closes the sequence - its caption rises (0.85s), then the five logo cells rise in from below one after another, left to right, 80ms apart (0.93-1.25s, 0.45s each). Everything ends by 1.7s and stays.

How the pen draws (`src/styles/global.css`): each drawn piece of the hero - an element or a pseudo-element - reads one number, `--bl-p` (a registered property, 0 undrawn, 1 drawn, initial 1), takes its own stage of it as `--bl-s`, eases that with a smoothstep into `--bl-e`, and draws by it: a rule by a `background-size` over a border made transparent, the frame by four such backgrounds in turn, a mark or a word by a `clip-path: inset()` that uncovers it left to right. The section heads, cells, rail and footer keep their stages (a pen could draw them again), but no rule ever sets their `--bl-p` under 1.

When: `base-head.astro` marks `<html data-bl-live data-bl-enter>` inline before the first paint and `data-bl-enter="go"` once the `first-contentful-paint` entry is reported, or two animation frames later where none can come (the entrance runs from the first painted frame; a count of frames alone is no such signal, Chrome runs frames before it paints); `scripts/blueprint-live.ts` restores `data-bl-live` after a ClientRouter swap (it means the script runs: the selected cell's width readout) and not `data-bl-enter`, so a page reached through the router shows at once. The motion blocks sit in `header.astro` and `hero.astro` under `html[data-bl-enter]`, inside `prefers-reduced-motion: no-preference`. Under reduced motion, without JavaScript, and after a swap nothing animates: everything shows at once, on the components' own borders.

## Motion

- Every state change is `--mb-snap` (`0.12s linear`): a switch, not a drift. What opens animates in that time and no longer: an accordion item's height (`::details-content` with `interpolate-size`) and its chevron's half turn; the breadcrumb menu and the mobile sheet switch in with an opacity snap. One slide travels further and takes `--mb-slide` (`0.3s ease-out`): a loading button's label and spinner trading places.
- Hover moves one thing, a button's face: it lifts 1px up and left off its still white layer (2px away), towards the cursor; the button element itself never moves and stays under the pointer, so the edge does not flicker. Otherwise hover never moves an element: cells light from inside under their grips and fill their item number, link underlines draw in, thicken or fade in, input frames go `ink-2`, an unchecked checkbox shows its check faintly. The `case` and sheet arrows nudge right; a button's `iconEnd` stays put.
- Hover exists only for a mouse-like pointer (`@media (hover: hover) and (pointer: fine)`): a touch screen applies `:hover` on a tap and keeps it until the next tap elsewhere, which would leave a cell selected or a button lifted. A rest state that only waits for a hover sits in the same query: the client logos of the trust bar and the case highlights are grey at rest under a mouse and in colour at rest on a touch screen. The press states (`:active`) stay for every pointer. The grey tap highlight is off (`-webkit-tap-highlight-color: transparent` in `global.css`), and buttons and links take `touch-action: manipulation`, so a tap clicks without waiting for a double-tap zoom.
- Press (`:active`) puts a button's face down onto its layer in 0.08s, so no white shows and a quick double click reads as two clean presses; the `case` and sheet arrows nudge further. Everything else answers a press in fill or colour - a step darker, or an ink block on a link badge.
- Focus: the ring (`global.css`, 2px `true-blue`) grows out of the element's edge to its offset instead of popping in; fields shift their hard `true-blue` shadow out.
- No always-on motion: no ambient background, no pulsing dots. The spinner turns only while a form is being sent. The entrance (The drawing, above) plays once per page load, about 1.7s, transform and opacity and the pen; nothing else draws on scroll. Two motions are tied to scrolling, both in the process section and both following the scroll, never playing on their own: the rail's lime fill, with each mark filling `lime` top to bottom, eased, as the rail reaches it; and each detail drawing's `lime` layer, its pieces uncovered left to right one after the other (the brace, then its callout; the chain along the bars; one module, then the next; the cloud, then its triangle; the trace, then its end mark), each eased, by a `clip-path` (KA0157). They play strictly in order, one part at a time, on one scroll timeline, the process list's (KA0158): mark 01 fills, then drawing 01 draws in, then the rail runs on to mark 02, which fills, then drawing 02, and so on to drawing 05; scrolling back plays it backwards. The run, from mark 01 coming into the bottom of the viewport to drawing 05 near its top, is cut into consecutive slots (a mark, its drawing, the rail to the next mark), so each mark and drawing plays whole on screen, under the header; a drawing takes about a fifth of the viewport's height of scroll at 1440px, where the zigzag stands five steps in about 1100px, and about a third at 390px. The page holds still at rest; no parallax, no loader, no page transition.
- Motion is opt-in: each component builds its states outside any motion query and puts only what moves inside `prefers-reduced-motion: no-preference` - a transform (a button's face, label and spinner, the nav bar, the `case`, sheet and accordion arrows, the skip link), a height (the accordion), a shadow sliding out, a focus ring growing to its offset, an inline link's fill rising, the spinner's turn, the glide of an in-page link (`global.css`: smooth scrolling only under `html[data-glide]`, which `scripts/glide.ts` sets for 2s, longer than a smooth scroll takes, after a click on a link to a `#fragment`; a Tab, a script's scroll or a page opened on a `#fragment` jump) and the entrance. No rule strips motion afterwards: there is no `reduce` block and no global `0.01ms` rule. Under reduced motion every transform, height, shadow and ring switches at once, while colour, fill, rule, underline-colour, logo and opacity fades still run in `--mb-snap` (they move nothing). A button's face then never moves: hover only fills, press hides the layer and takes the darker press fill.

## Do's and Don'ts

- ✅ **Do** draw a cell with `--mb-rule` and let neighbours share it through `cell-grid.astro`.
- ✅ **Do** give a new color token a single value, the one the dark page renders - there is no second palette to pair it with.
- ✅ **Do** use `--mb-snap` for every transition, and put a transition of anything but colour or opacity inside `prefers-reduced-motion: no-preference`; `--mb-slide` is only for the loading swap; `bl-enter`, `bl-enter-slide`, `bl-enter-down` and the pen's `bl-draw` belong to the entrance alone, on page load.
- ❌ **Don't** round a corner. Not on cells, buttons, chips, avatars or inputs. The radio's circle is the one exception; the only other curves are drawn marks: a field's break line and the revision cloud in the process drawings.
- ❌ **Don't** add glass (`backdrop-filter`), gradients, a dot grid or ambient motion; the substrate stays solid and still.
- ❌ **Don't** add a second accent color. Lime Green is the only accent; True Blue marks state (focus, selection) and never decorates.
- ❌ **Don't** use solid white (`#fff`) - text tops out at the warm `ink` (`#ece7dc`). The EU funding band is the one exception: its logos need a white ground.
- ❌ **Don't** add soft or chromatic drop shadows. The only shadow is the hard `--mb-shift` offset on what the visitor acts on.
- ❌ **Don't** move a hovered element (`translateY` and the like). State shows in fill, rule and shadow; a button's face is the exception, lifting 1px off its still layer on hover and going down onto it (2px, 0.08s) on press.
