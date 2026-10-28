---
version: alpha
name: kacperadler.pl
description: Portfolio site of Kacper Adler, dark only - minimal brutalism as an engineer's drawing, a ruled sheet of square cells drawn with 1px ink rules on a solid substrate, dimension lines and item numbers in small mono caps, drawn by a pen as you scroll; heavy Geist headlines, Geist Mono labels, one navy-blue accent.
colors:
  ink: "#ece7dc"
  ink-2: "#c8c3b8"
  muted: "#9d9c95"
  base: "#0a0c10"
  panel: "#14171c"
  panel-elevated: "#1a1e26"
  blue: "#8eaed8"
  blue-2: "#b4c8e6"
  on-blue: "#0a0c10"
  error: "#e07a70"
typography:
  display-xl:
    fontFamily: Geist
    fontSize: 70px
    fontWeight: 800
    lineHeight: 0.98
    letterSpacing: -0.055em
  display-lg:
    fontFamily: Geist
    fontSize: 54px
    fontWeight: 800
    lineHeight: 1.02
    letterSpacing: -0.045em
  display-md:
    fontFamily: Geist
    fontSize: 20px
    fontWeight: 750
    lineHeight: 1.2
    letterSpacing: -0.035em
  body-lg:
    fontFamily: Geist
    fontSize: 18px
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
rounded:
  none: 0px
  full: 50%
spacing:
  md: 16px
  lg: 32px
  xl: 64px
  2xl: 96px
  section-gap: 136px
  block-gap: 48px
components:
  cell:
    backgroundColor: "{colors.base}"
    rounded: "{rounded.none}"
    padding: "{spacing.lg}"
  button-default:
    backgroundColor: "{colors.blue}"
    textColor: "{colors.on-blue}"
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

`kacperadler.pl` is minimal brutalism drawn as an engineer's blueprint: a ruled sheet. Content sits in cells drawn with 1px `ink` rules that share their edges, on a solid `base` substrate, each cell numbered on its rule as an item of its section; every section opens under a dimension line that reads the section's width in px; the hero carries the drawing's datum and the sheet's title block, the footer its legend. Two rulers run down the page at the container's edges. Headlines are heavy Geist with tight negative tracking, labels Geist Mono; the drawing's annotations are small mono caps. There are no rounded corners (the radio is the one circle), no glass, no gradients, no drifting background: a hovered cell lights up from inside under four corner grips and moves nothing, a button's face lifts off its white layer towards the cursor, and every state change is a short linear switch, except one slide: a loading button's label and spinner. The one thing that moves on its own is the pen: with JavaScript, each part of the drawing is drawn once, over `--mb-pen`, when it comes whole onto the screen, and stays (see Motion).

There is one design, served at `/`, and it is dark only. Its components live in `src/components/mb/`, are shown with every variant and state at `/ui` (`bun dev` only), and every production page is built from them.

## Dark only

`color-scheme: dark` on `:root` (`src/styles/tokens.css`) fixes the page to dark: there is no theme switch and no second palette. The frontmatter lists the values that render. The CSS custom properties behind them:

| Token            | CSS property          | Value                    |
| ---------------- | --------------------- | ------------------------ |
| `base`           | `--v2-bg`             | `#0a0c10`                |
| `panel`          | `--v2-panel`          | `#14171c`                |
| `panel-elevated` | `--v2-panel-elevated` | `#1a1e26`                |
| `ink`            | `--ink`               | `#ece7dc`                |
| `ink-2`          | `--ink-2`             | `#c8c3b8`                |
| `muted`          | `--muted`             | `#9d9c95`                |
| `blue`           | `--blue`              | `#8eaed8`                |
| `blue-2`         | `--blue-2`            | `#b4c8e6`                |
| `error`          | `--error`             | `#e07a70`                |
| hairline         | `--v2-line`           | `rgba(236, 231, 220, 0.1)` |

`on-blue` has no property of its own: text on a `blue` or `error` block is `base` (`--v2-bg`), 8.5:1 and 6.7:1. The `--v2-` prefix is left over from an earlier redesign; it names no separate version.

The minimal brutalism vocabulary, in the same file:

| Token          | Value                 | Use                                                     |
| -------------- | --------------------- | ------------------------------------------------------- |
| `--mb-rule`    | `var(--ink)`          | the 1px rule that draws a cell                          |
| `--mb-hair`    | `var(--v2-line)`      | dividers inside a cell, the page edges, disabled frames |
| `--mb-shift`   | `4px`                 | the hard shadow offset; the white layer under a button is tighter, 2px at every size |
| `--mb-snap`    | `0.12s linear`        | every transition but the two slides                     |
| `--mb-slide`   | `0.3s ease-out`       | a loading button's label and spinner                    |
| `--mb-display` | `var(--sans)` (Geist) | headlines                                               |
| `--mb-pen`     | `1.8s`                | how long the pen takes over one part of the drawing     |
| `--mb-note`    | `500 10px / 1` mono   | the drawing's annotations: dimensions, item numbers, callouts, the datum, the title block header |
| `--mb-grip`    | `7px`                 | the side of a selected cell's corner grips              |

## Colors

- **`base` (`#0a0c10`):** the substrate and the idle fill of every cell. Solid: no dot grid, no gradient.
- **`panel` (`#14171c`):** the flat surface: disabled and loading controls.
- **`panel-elevated` (`#1a1e26`):** the raised surface - the secondary button and badge - and a lit cell: the fill of a hovered card, under a 3px `blue` top rule.
- **`ink` / `ink-2` / `muted`:** `ink` draws the rules and sets headlines and primary text, `ink-2` body copy and labels, `muted` idle form frames, tags and disabled text (6.5:1 on `panel`, never lowered opacity).
- **`blue` (`#8eaed8`):** the **only** chromatic accent: the default button and badge, the dimension brace and callout under `<em>` in a headline, the `§` section counter and the dimension on its line, the datum cross, a selected cell's grips and filled item number, active nav links, focus rings. `blue-2` is the default button's hover.
- **`error` (`#e07a70`):** form errors, the required `*` after a field label and the destructive variants only (the invalid frame, the error line, the send-error banner). Not an accent: it never decorates. 6.15:1 on `panel`, 6.7:1 on `base`.

## Typography

Two faces, both self-hosted variable woff2:

- **Geist** (`--sans`, `--mb-display`) - headlines at 700-800 with tight negative tracking (`display-*`), button labels at 650, running prose, form fields.
- **Geist Mono** (`--mono`) - uppercase labels (`label-mono`: the section label, field labels, status rows), badges, tags, the footer copyright.

`text-wrap: balance` on headlines. `<em>` in a headline stays `ink`, on one line, under a `blue` dimension brace (a 0.14em-high bracket, open at the top, `max(2px, 0.05em)` thick) with a callout letter (A, B, counted per headline) on a `blue` box at its right end.

The drawing's annotations (`--mb-note`: 500 10px/1 Geist Mono, uppercase or figures, 0.08em tracking) are the dimension on a section's line (`blue`), a cell's item number (`ink-2` on `base`, `base` on `blue` when selected), the callout letters, the datum (`X 0  Y 0`), the title block's header and the footer's legend.

## Layout

- **Container:** max-width `1160px` (`--container`), 16px side padding. `page-frame.astro` draws a fixed ruler down each edge of the container width (a `muted` hairline at 0.45 opacity with a tick every 16px, longer at 32 and 64, mirrored on the right); below 1160px they are gone.
- **Sections:** each opens with `section-head.astro` - an `ink` rule drawn as a dimension line (11px extension ticks at both ends, the section's own width in px in `blue` on its middle, from the head's container size through typed trigonometry; a browser without it prints nothing), the numbered mono label (`§ 01 / Problem`, a CSS counter the frame resets; the trust bar has no head, so it takes no number, and its cells read `00.1`, `00.2`), then the headline left and the lede right, bottom-aligned; one column at 880px and below. Sections are `--mb-section-gap` apart (136px, 88px at 880px and below); inside a section, the head, the table and the button under it are `--mb-block-gap` apart (48px, 32px on mobile). The hero opens 96px under the header.
- **Cells:** `cell-grid.astro` collapses cells into one ruled table - no gap, every cell pulled 1px over its neighbour so two cells share one rule. Fixed columns (case highlights: 2; problems and the offer: 3, problems 2 between 560px and 880px, its cells on a shared subgrid; one column at 880px; with 2 an odd last cell spans the row) or as many as fit a minimum width (the experience list: 300px, case studies: 320px). The trust bar sets its own: five logos a row, two at 880px with the lone last one spanning.
- **No radius:** every corner is square. A new component sets `border-radius: 0` on native controls that carry a UA radius.

## Components

Every component is one `.astro` file in `src/components/mb/` with scoped CSS, shown with each variant and state at `/ui`. States there are forced with `[data-state="hover" | "pressed" | "focus-visible" | "focus"]`, `.active` and `disabled`; each component declares those selectors next to its real `:hover` / `:active` / `:focus`, so changing a state means changing one rule. Names and sets follow shadcn/ui (Astro and plain CSS, no React, Base UI, Tailwind or shadcn); shadcn's sub-components are named slots (card `image` / `title` / `description` / `action` / `footer`, alert `title` / `action`), breadcrumb and pagination take data props.

| Component | Variants and sizes |
| --------- | ------------------ |
| `button` | `default` (blue block, ink rule; hover `blue-2`; `.active` an ink block with no layer), `secondary` (hover: only the lift, the hairline stays), `outline` (hover: the lit cell), `ghost`, `destructive`, `link`; the four with a rule sit on the white layer (an `ink` box of its own 2px down and right, which never moves, always under a solid face): hover lifts the face 1px towards the cursor, press puts it down onto the layer in 0.08s; ghost presses to an `ink-2` block, link to `blue-2` text over a 3px underline; sizes `xs` 28 / `sm` 36 / `default` 44 / `lg` 52px and the square `icon-xs` / `icon-sm` / `icon` / `icon-lg` (need `aria-label`); `iconStart` / `iconEnd`, `href`, `loading` (the label slides out left, the spinner in from the right, the width stays) |
| `badge` | `default` (`teraz`, `Zlecenie`), `secondary`, `outline` (year range, step duration), `destructive`, `ghost`, `link`, `tag` (a technology: the `muted` frame, not caps), `status` (availability: `ink` text in a `blue` frame behind a square `blue` dot); icons, `href` (press: an ink block), `fillOnCellHover` |
| `alert` | `default`, `destructive` (the send-error banner) |
| `avatar`, `avatar-group` | `sm` / `default` / `lg` (32 / 48 / 96px); image or initials (decided at build time), `badge`; in a group each overlaps the one before by a quarter of its side inside a 2px `base` ring, and the "+N" count matches the initials avatar |
| `radio` | a circle, a `blue` dot when checked |
| `choice` | a checkbox drawn as the contact form's chip (several can be checked), 44px high like `input`, so a row of chips is level with a field beside it: hover the lit cell, press `panel`, checked a `blue` block, `blue-2` on hover, checked and disabled a `muted` block; the same 1px frame and type weight in every state, so checking one moves nothing; the native input stays in the tab order (Space checks it) |
| `checkbox`, `input`, `textarea`, `label`, `field`, `field-set`, `separator`, `spinner` | shadcn's states; hover shows an unchecked checkbox's check faintly; `field` orientation `vertical` / `horizontal` / `responsive` |
| `accordion`, `accordion-item` | `single` / `multiple`, plain / `bordered`; native `<details>`, height and chevron animate |
| `breadcrumb`, `pagination` | chevron / slash, collapse (the ellipsis opens the hidden pages as a native popover menu); numbers / icons, `jump` (a GET form to a page number) |
| `card`, `cell-grid` | `default` / `sm`; cells share their rules |
| not in shadcn | `link` (`inline` / `nav` / `footer` / `case`), `section-head`, `prose`, `brand`, `header`, `footer`, `mobile-sheet`, `page-frame`, `contact-form`, `contact-link` (an `sm` cell as the link: `blue` icon, mono caps label, the value pushed right, under them when narrow; `newTab`), `step-marker` (a square mono number on the 1px process rail, on its step row's vertical centre; a 2px `blue` line fills the rail as the page scrolls past the viewport's middle line, and a mark turns `blue` when the line reaches its centre - scroll-driven CSS animations; filled from the start under reduced motion or without view timelines), `sections/*` |

### Page frame
`page-frame.astro` goes straight inside `<body>`: the edge hairlines, the skip link, `header.astro` (sticky on the substrate under an `ink` rule: brand, nav links, the `sm` contact CTA; below 880px the menu button instead of the links; at 400px and below the CTA drops its arrow and the row wraps rather than scroll sideways), the page, `footer.astro` (under an `ink` rule: brand and tagline, two link columns, the copyright under a hairline), the EU funding band (`layout/eu-funding.astro`, white - its logos need a white ground) and, as a sibling, `mobile-sheet.astro` (the full-screen menu on the substrate, switched in with an opacity snap). `BaseLayout` wraps every production page in it; `/ui` is its own document around it, without `contact-form.ts`. The footer's bottom row ends in the sheet's legend, `Wymiary w px · Skala 1:1 · Rys. KA-001`, in the copyright's mono.

### Cells
`card.astro` is a cell: `base` fill in a 1px `ink` rule, 32px padding (16px on `sm`), its item number on the top rule, 12px from the left corner (`01.3`: the section's counter, then the cell's within the section - `bl-cell`, reset by the section head). Hover selects it as a CAD selection does: it lights from inside - `panel-elevated` - under four `blue` squares (`--mb-grip`) on its corners, 4px outside the rule, and the item number fills `blue` and reads the cell's outer width (`01.3 ↔ 368`); nothing moves. A service or example number turns `blue`, a logo (trust bar, case highlight, experience list) goes from grey to colour, a `fillOnCellHover` badge fills. The experience list in the about accordion is the one table without a frame of its own (its outer rules clipped, so the cells are ruled only between each other), and there a hovered cell keeps its `base` fill: only the grips, the number and the logo answer. The process steps carry their numbers on the rail, so their cells have no item number. The hero's results card is the sheet's title block: a framed table with the header strip `Rys. KA-001 · Arkusz 1/1` across its top under an `ink` rule, then the caption and the rows under hairlines; the case study facts are a framed table of `label | value` rows under hairlines.

### Hard shadow
The hard offset shadow (`--mb-shift`, no blur) marks what the visitor acts on. Under the `default`, `secondary`, `outline` and `destructive` buttons it is the white layer: an `ink` box of its own (`.mb-btn-layer`), not a `box-shadow`, so it never moves - only the face (`.mb-btn-face`) lifts off it on hover and covers it on press, while the button element itself stays put as the hit area. A focused field shifts a `blue` one out, and the contact form sheet carries a `blue` one after it is sent; focusing a field lights only that field, never the sheet.

### Links
`inline` (ink text over a 2px `blue` underline; hover `blue` text and a 3px underline), `nav` (an ink bar draws in under it from the left on hover; `.active` is a `blue` bar under `blue` text; press: blue), `footer` (`ink-2`, an underline fades in on hover, an optional leading icon turns `blue`), `case` ("Zobacz realizację": heavy ink text over a `blue` underline, the arrow after it nudges 3px right on hover and 6px on press; the company name is in its accessible name).

### Form fields
Idle: a `muted` frame. Hover: an `ink-2` frame. Focus: an `ink` frame and the hard `blue` shadow shifting out from under it. A required field's label ends in a coral `*`. Invalid (`[data-invalid]` on the field or `aria-invalid`): a coral frame and a mono error line behind a coral rule. Disabled: a flat `panel`; while the contact form sends, every field, chip and the submit button are disabled, and come back when it ends. The script hooks are `contact-form.ts`'s: `data-contact-wrap` (`data-state`: `idle | submitting | error-validation | error-submit | success`), `data-contact-form`, `data-field`, `data-invalid`, `data-submit`, `data-form-error`, `data-form-success`, `data-form-reset`, the `website` honeypot.

### Prose
`prose.astro` (`mb-prose`) sets Markdown / MDX bodies - legal pages, case studies: the rhythm of @tailwindcss/typography at 65ch, heavy Geist headings with h2 under an `ink` rule, `blue` square bullets and mono counters, the quote behind a `blue` rule, code in a hairline box, the table fully ruled. A `<pre>` scrolls in its own box and table cells wrap, so neither widens the page.

### Pages
- **Home** (`/`, KA0075): the brief's order - hero (the drawing's datum - a 17px `blue` cross with `X 0  Y 0` - in the top padding over the headline's corner; beside the text a results card as tall as it, the sheet's title block: the header strip `Rys. KA-001 · Arkusz 1/1`, a mono caption, three equal ruled rows of a big figure over its text, an outline button to `#cases`; no photo. The text column is padded for the card's rule, header strip and the gap under it, so the headline starts on the card caption's line and the hero buttons rest on the card button's; at 880px and below one column, every button full width), trust bar (a mono caption over a row of logo cells, no head; each logo sized by optical weight, a bare mark with the company set beside it; low cells on mobile), problems (six cells: a heading, a sentence and, under a hairline, the effect after a `blue` arrow; the cells of a row share a subgrid, so they are equally tall and the effects start on one line), the three-step offer (custom apps as a full-width row under the three steps; rows on a shared subgrid so each label runs straight through the table, the pricing answer as the lede, only the first step's button `default`), case highlights (four, newest first; the company once: the h3 is its logo, two for a project built for two companies, grey until hovered, beside the kind badge; the cells of a row share a subgrid, so they are equally tall and the labels run straight across), process (on the desktop a central rail, the steps alternating left and right and staggered - each card starts about halfway down the one before - each joined to its mark by a short connector, 1px `ink` turning 2px `blue` with the mark; the duration on the title's line at the card head's right end, never wrapped under it; cards on one side 128px apart, so the two sides overlap only a little; one column with the rail on the left at 880px and below, the cards 40px apart, no connectors; ending at a button to `#contact`), about (photo and text on one band: the text starts on the photo's top edge and the photo, filling its frame and cropped to fit, ends with the link cells under the text; the full experience list in a closed accordion), FAQ (two bordered accordions side by side in one ruled table across the container, one column at 880px and below), contact (the form, then the link cells as the last row of the same sheet across the container; once the sheet is 720px wide, the email and the project type sit side by side above the message). Every part ends at, or sits by, a button to `#contact`; the technologies are tags, never in a heading.
- **Legal pages** (`legal-layout.astro`): a section head with the h1 (label `Informacja prawna`, lede `Ostatnia aktualizacja: <date>`), then the prose.
- **Case study** (`/realizacje/<slug>/`): a section head with the company as h1 and the summary as lede, the facts table (role, period, stack as tags), the MDX body in prose, then a default `Napisz do mnie` and an outline `Wszystkie realizacje` (to the list) under an `ink` rule.
- **Case study list** (`/realizacje/`, built only when a case study exists, and then linked by `Wszystkie realizacje` in the home page's `#cases`): a section head with the h1, then a cell grid of cards as in the experience list - period badge (outline), company, role (mono `blue`), summary, the `case` link. The menu holds home page sections only (`Realizacje` is `/#cases`), so no entry is active here.
- **404**: an `ink` rule, the mono `404` in `blue`, the heavy h1, a default and an outline button.
- **OG image** (`/og-default.png`, 1200×630, drawn at build time by `src/pages/og-default.png.ts`): a ruled sheet of two cells on the solid `base` - the photo, square, in its 1px `ink` frame, and a table of rows: the square `blue` mark with the role label, the heavy name on two lines, the tagline in `ink-2`, the url in mono `blue`. The sans text is Geist (ExtraBold for the name and the mark, regular for the tagline) from a TTF of variable Geist (npm `geist` 1.7.2) in `src/assets/fonts`, since librsvg cannot load the woff2; the mono labels are DejaVu Sans Mono.
- **Favicon** (`public/favicon.svg`, and `public/favicon.ico` at 16, 32 and 48px rendered from it): the brand mark of `brand.astro` on a 28-unit box - a `blue` block in a 1px `ink` rule, square, with the Geist ExtraBold `k` in `base` as a path, so it needs no font.

## The drawing

The blueprint is the site's signature (KA0072, KA0080, KA0081, KA0098): a client sees the engineer's drawing being made as they scroll, calm and on a clock, never tied to scroll speed. The marks: the rulers on the frame's edges; the datum and the title block in the hero; a dimension line, `§` label, brace and callout on every section head; a traced frame and an item number on every cell; the dash-dot centre line of the process rail; the footer's rule, hairline and legend. The palette, the type and the hard shadow are unchanged by it.

How it is drawn (`src/styles/global.css`): each drawn piece - an element or a pseudo-element - reads one number, `--bl-p` (a registered property, 0 undrawn, 1 drawn, initial 1), takes its own stage of it as `--bl-s` (0 to 1 over the stage), eases that with a smoothstep into `--bl-e`, and draws by it: a rule by a `background-size` over a border made transparent, a frame by four such backgrounds in turn (top, right, bottom, left), a mark or a word by a `clip-path: inset()` that uncovers it left to right (or top to bottom). The stages of one part run in order: a section head draws its rule (0-0.6), ticks (0.6-0.7), dimension, label and brace (0.7-0.9), callout (0.9-1); a cell its frame (0-0.8) and number (0.8-1); the hero the datum cross (0-0.25), `X 0  Y 0` (0.25-0.5), the brace (0.3-0.7) and callout (0.7-0.8), and the title block its frame (0-0.6), header (0.5-0.8), row hairlines (0.6-1).

When: `scripts/blueprint-live.ts` marks `<html data-bl-live>` before the first paint (an inline script in `base-head.astro`; after a ClientRouter swap, on `astro:after-swap`) and watches every part (a section head, a cell, a process step by its marker, the footer and its bottom row, the title block) with an IntersectionObserver: a part whole on the screen (or filling it, when taller; or scrolled past its top before it was seen whole) is marked `data-bl-drawn` and plays `bl-draw` over `--mb-pen` (1.8s, linear - every stage eases itself) once, then stays drawn however the page scrolls. The hero and the rulers play on load. Each component holds its own pieces at `--bl-p: 0` until marked, inside `prefers-reduced-motion: no-preference` and under `html[data-bl-live]`, next to its real styles. Under reduced motion, and without JavaScript, nothing is held and nothing animates: the drawing stands complete on the components' own borders. A cell under the cursor stands whole, drawn or not.

## Motion

- Every state change is `--mb-snap` (`0.12s linear`): a switch, not a drift. What opens animates in that time and no longer: an accordion item's height (`::details-content` with `interpolate-size`) and its chevron's half turn; the breadcrumb menu and the mobile sheet switch in with an opacity snap. One slide travels further and takes `--mb-slide` (`0.3s ease-out`): a loading button's label and spinner trading places.
- Hover moves one thing, a button's face: it lifts 1px up and left off its still white layer (2px away), towards the cursor; the button element itself never moves and stays under the pointer, so the edge does not flicker. Otherwise hover never moves an element: cells light from inside under their grips and fill their item number, link underlines draw in, thicken or fade in, input frames go `ink-2`, an unchecked checkbox shows its check faintly. The `case` and sheet arrows nudge right; a button's `iconEnd` stays put.
- Press (`:active`) puts a button's face down onto its layer in 0.08s, so no white shows and a quick double click reads as two clean presses; the `case` and sheet arrows nudge further. Everything else answers a press in fill or colour - a step darker, or an ink block on a link badge.
- Focus: the ring (`global.css`, 2px `blue`) grows out of the element's edge to its offset instead of popping in; fields shift their hard `blue` shadow out.
- No always-on motion: no ambient background, no pulsing dots. The spinner turns only while a form is being sent. The pen (The drawing, above) plays each part once, on a clock, when it comes whole onto the screen, never following the scroll's speed. The one motion tied to scrolling is the process rail's blue fill (it follows the scroll, it never plays on its own).
- `prefers-reduced-motion: reduce` turns every transition off and collapses every animation (`global.css`) and stops the spinner; each animated component has its own reduced-motion block too, so hover, press, focus and opening all snap. Transitions go off rather than get shorter: a short duration would turn on the default `all` on every element, and a resize or a media query would show the old style for a frame. A button's face then never moves: hover only fills, press hides the layer and takes the darker press fill.

## Do's and Don'ts

- ✅ **Do** draw a cell with `--mb-rule` and let neighbours share it through `cell-grid.astro`.
- ✅ **Do** give a new color token a single value, the one the dark page renders - there is no second palette to pair it with.
- ✅ **Do** use `--mb-snap` for every transition and add a reduced-motion block next to it; `--mb-slide` is only for the loading swap; the pen's `bl-draw` runs over `--mb-pen` and only once a part is on the screen.
- ❌ **Don't** round a corner. Not on cells, buttons, chips, avatars or inputs. The radio's circle is the one exception.
- ❌ **Don't** add glass (`backdrop-filter`), gradients, a dot grid or ambient motion; the substrate stays solid and still.
- ❌ **Don't** add a second accent color. Navy is the only chromatic element.
- ❌ **Don't** use solid white (`#fff`) - text tops out at the warm `ink` (`#ece7dc`). The EU funding band is the one exception: its logos need a white ground.
- ❌ **Don't** add soft or chromatic drop shadows. The only shadow is the hard `--mb-shift` offset on what the visitor acts on.
- ❌ **Don't** move a hovered element (`translateY` and the like). State shows in fill, rule and shadow; a button's face is the exception, lifting 1px off its still layer on hover and going down onto it (2px, 0.08s) on press.
