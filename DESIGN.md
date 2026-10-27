---
version: alpha
name: kacperadler.pl
description: Portfolio site of Kacper Adler, dark only - minimal brutalism, a ruled sheet of square cells drawn with 1px ink rules on a solid substrate, heavy Geist headlines, Geist Mono labels, one navy-blue accent.
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

`kacperadler.pl` is minimal brutalism: a ruled sheet. Content sits in cells drawn with 1px `ink` rules that share their edges, on a solid `base` substrate. Two hairlines run down the page at the container's edges. Headlines are heavy Geist with tight negative tracking, labels Geist Mono. There are no rounded corners (the radio is the one circle), no glass, no gradients, no drifting background: a hovered cell lights up from inside and moves nothing, a button's face lifts off its white layer towards the cursor, and every state change is a short linear switch, except two slides: a loading button's label and spinner, and a card's top rule.

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
| `--mb-slide`   | `0.3s ease-out`       | a loading button's label and spinner, a card's top rule |
| `--mb-display` | `var(--sans)` (Geist) | headlines                                               |

## Colors

- **`base` (`#0a0c10`):** the substrate and the idle fill of every cell. Solid: no dot grid, no gradient.
- **`panel` (`#14171c`):** the flat surface: disabled and loading controls, the proposal bar on `/ui/proposal/<id>`.
- **`panel-elevated` (`#1a1e26`):** the raised surface - the secondary button and badge - and a lit cell: the fill of a hovered card, under a 3px `blue` top rule.
- **`ink` / `ink-2` / `muted`:** `ink` draws the rules and sets headlines and primary text, `ink-2` body copy and labels, `muted` idle form frames, tags and disabled text (6.5:1 on `panel`, never lowered opacity).
- **`blue` (`#8eaed8`):** the **only** chromatic accent: the default button and badge, the underline under `<em>` in a headline, the section counter, the hover rule of a cell, active nav links, focus rings. `blue-2` is the default button's hover.
- **`error` (`#e07a70`):** form errors, the required `*` after a field label and the destructive variants only (the invalid frame, the error line, the send-error banner). Not an accent: it never decorates. 6.15:1 on `panel`, 6.7:1 on `base`.

## Typography

Two faces, both self-hosted variable woff2:

- **Geist** (`--sans`, `--mb-display`) - headlines at 700-800 with tight negative tracking (`display-*`), button labels at 650, running prose, form fields.
- **Geist Mono** (`--mono`) - uppercase labels (`label-mono`: the section label, field labels, status rows), badges, tags, the footer copyright.

`text-wrap: balance` on headlines. `<em>` in a headline stays `ink`, struck under with a thick (0.1em) `blue` underline.

## Layout

- **Container:** max-width `1160px` (`--container`), 16px side padding. `page-frame.astro` draws a fixed 1px `--mb-hair` line down each edge of the container width; below 1160px they are gone.
- **Sections:** each opens with `section-head.astro` - an `ink` rule, the numbered mono label (`01 / Problem`, a CSS counter the frame resets; the trust bar has no head, so it takes no number), then the headline left and the lede right, bottom-aligned; one column at 880px and below. Sections are `--mb-section-gap` apart (136px, 88px at 880px and below); inside a section, the head, the table and the button under it are `--mb-block-gap` apart (48px, 32px on mobile). The hero opens 96px under the header.
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
`page-frame.astro` goes straight inside `<body>`: the edge hairlines, the skip link, `header.astro` (sticky on the substrate under an `ink` rule: brand, nav links, the `sm` contact CTA; below 880px the menu button instead of the links; at 400px and below the CTA drops its arrow and the row wraps rather than scroll sideways), the page, `footer.astro` (under an `ink` rule: brand and tagline, two link columns, the copyright under a hairline), the EU funding band (`layout/eu-funding.astro`, white - its logos need a white ground) and, as a sibling, `mobile-sheet.astro` (the full-screen menu on the substrate, switched in with an opacity snap). `BaseLayout` wraps every production page in it; `/ui` and `/ui/proposal/<id>` are their own documents around it, without `contact-form.ts`.

### Cells
`card.astro` is a cell: `base` fill in a 1px `ink` rule, 32px padding (16px on `sm`). Hover lights it from inside - `panel-elevated` under a 3px `blue` top rule that slides in and, when the pointer leaves, slides out (`--mb-slide`) - and moves nothing; a service or example number turns `blue`, a logo (trust bar, case highlight, experience list) goes from grey to colour, a `fillOnCellHover` badge fills. The experience list in the about accordion is the one table without a frame of its own (its outer rules clipped, so the cells are ruled only between each other), and there a hovered cell keeps its `base` fill: only the `blue` top rule and the logo answer. The rule follows a mouse: it draws in from the side edge nearer where the pointer came in and leaves toward the side nearer where it went out (through the top or bottom, the nearer side by horizontal position), so a sweep across a grid reads as one movement either way; touch, keyboard and no JavaScript keep in from the left, out to the right. The hero status card and the case study facts are framed tables of `label | value` rows under hairlines.

### Hard shadow
The hard offset shadow (`--mb-shift`, no blur) marks what the visitor acts on. Under the `default`, `secondary`, `outline` and `destructive` buttons it is the white layer: an `ink` box of its own (`.mb-btn-layer`), not a `box-shadow`, so it never moves - only the face (`.mb-btn-face`) lifts off it on hover and covers it on press, while the button element itself stays put as the hit area. A focused field shifts a `blue` one out, and the contact form sheet carries a `blue` one after it is sent; focusing a field lights only that field, never the sheet.

### Links
`inline` (ink text over a 2px `blue` underline; hover `blue` text and a 3px underline), `nav` (an ink bar draws in under it from the left on hover; `.active` is a `blue` bar under `blue` text; press: blue), `footer` (`ink-2`, an underline fades in on hover, an optional leading icon turns `blue`), `case` ("Zobacz realizację": heavy ink text over a `blue` underline, the arrow after it nudges 3px right on hover and 6px on press; the company name is in its accessible name).

### Form fields
Idle: a `muted` frame. Hover: an `ink-2` frame. Focus: an `ink` frame and the hard `blue` shadow shifting out from under it. A required field's label ends in a coral `*`. Invalid (`[data-invalid]` on the field or `aria-invalid`): a coral frame and a mono error line behind a coral rule. Disabled: a flat `panel`; while the contact form sends, every field, chip and the submit button are disabled, and come back when it ends. The script hooks are `contact-form.ts`'s: `data-contact-wrap` (`data-state`: `idle | submitting | error-validation | error-submit | success`), `data-contact-form`, `data-field`, `data-invalid`, `data-submit`, `data-form-error`, `data-form-success`, `data-form-reset`, the `website` honeypot.

### Prose
`prose.astro` (`mb-prose`) sets Markdown / MDX bodies - legal pages, case studies: the rhythm of @tailwindcss/typography at 65ch, heavy Geist headings with h2 under an `ink` rule, `blue` square bullets and mono counters, the quote behind a `blue` rule, code in a hairline box, the table fully ruled. A `<pre>` scrolls in its own box and table cells wrap, so neither widens the page.

### Pages
- **Home** (`/`, KA0075): the brief's order - hero (beside the text a results card as tall as it: a mono caption alone, three equal ruled rows of a big figure over its text, an outline button to `#cases`; no photo. The text column is padded like the card, so the headline starts on the card caption's line and the hero buttons rest on the card button's; at 880px and below one column, every button full width), trust bar (a mono caption over a row of logo cells, no head; each logo sized by optical weight, a bare mark with the company set beside it; low cells on mobile), problems (six cells: a heading, a sentence and, under a hairline, the effect after a `blue` arrow; the cells of a row share a subgrid, so they are equally tall and the effects start on one line), the three-step offer (custom apps as a full-width row under the three steps; rows on a shared subgrid so each label runs straight through the table, the pricing answer as the lede, only the first step's button `default`), case highlights (four, newest first; the company once: the h3 is its logo, two for a project built for two companies, grey until hovered, beside the kind badge; the cells of a row share a subgrid, so they are equally tall and the labels run straight across), process (on the desktop a central rail, the steps alternating left and right and staggered - each card starts about halfway down the one before - each joined to its mark by a short connector, 1px `ink` turning 2px `blue` with the mark; the duration on the title's line at the card head's right end, never wrapped under it; cards on one side 128px apart, so the two sides overlap only a little; one column with the rail on the left at 880px and below, the cards 40px apart, no connectors; ending at a button to `#contact`), about (photo and text on one band: the text starts on the photo's top edge and the photo, filling its frame and cropped to fit, ends with the link cells under the text; the full experience list in a closed accordion), FAQ (two bordered accordions side by side in one ruled table across the container, one column at 880px and below), contact (the form, then the link cells as the last row of the same sheet across the container; once the sheet is 720px wide, the email and the project type sit side by side above the message). Every part ends at, or sits by, a button to `#contact`; the technologies are tags, never in a heading.
- **Legal pages** (`legal-layout.astro`): a section head with the h1 (label `Informacja prawna`, lede `Ostatnia aktualizacja: <date>`), then the prose.
- **Case study** (`/realizacje/<slug>/`): a section head with the company as h1 and the summary as lede, the facts table (role, period, stack as tags), the MDX body in prose, then a default `Napisz do mnie` and an outline `Wszystkie realizacje` (to the list) under an `ink` rule.
- **Case study list** (`/realizacje/`, built only when a case study exists, and then linked by `Wszystkie realizacje` in the home page's `#cases`): a section head with the h1, then a cell grid of cards as in the experience list - period badge (outline), company, role (mono `blue`), summary, the `case` link. The menu holds home page sections only (`Realizacje` is `/#cases`), so no entry is active here.
- **404**: an `ink` rule, the mono `404` in `blue`, the heavy h1, a default and an outline button.
- **OG image** (`/og-default.png`, 1200×630, drawn at build time by `src/pages/og-default.png.ts`): a ruled sheet of two cells on the solid `base` - the photo, square, in its 1px `ink` frame, and a table of rows: the square `blue` mark with the role label, the heavy name on two lines, the tagline in `ink-2`, the url in mono `blue`. The sans text is Geist (ExtraBold for the name and the mark, regular for the tagline) from a TTF of variable Geist (npm `geist` 1.7.2) in `src/assets/fonts`, since librsvg cannot load the woff2; the mono labels are DejaVu Sans Mono.
- **Favicon** (`public/favicon.svg`, and `public/favicon.ico` at 16, 32 and 48px rendered from it): the brand mark of `brand.astro` on a 28-unit box - a `blue` block in a 1px `ink` rule, square, with the Geist ExtraBold `k` in `base` as a path, so it needs no font.

## Design proposals

`/ui/proposal` (`bun dev` only) lists the directions in `src/styles/proposals/<id>/`; `/ui/proposal/<id>` shows a copy of the home page and the whole `/ui` catalogue with the proposal's CSS on top, scoped under `html[data-proposal="<id>"]`. `baseline` is this design with no overrides - the reference a new direction (KA0072) is drawn on and compared against. A proposal keeps the palette above and may change fonts, type scale, rules, borders, shadows, spacing and shapes; adopting one means moving its rules into `tokens.css` and the components, and updating this file.

## Motion

- Every state change is `--mb-snap` (`0.12s linear`): a switch, not a drift. What opens animates in that time and no longer: an accordion item's height (`::details-content` with `interpolate-size`) and its chevron's half turn; the breadcrumb menu and the mobile sheet switch in with an opacity snap. Two slides travel further and take `--mb-slide` (`0.3s ease-out`): a loading button's label and spinner trading places, and a card's top rule drawing in and out in the direction the mouse moves (left to right without a mouse).
- Hover moves one thing, a button's face: it lifts 1px up and left off its still white layer (2px away), towards the cursor; the button element itself never moves and stays under the pointer, so the edge does not flicker. Otherwise hover never moves an element: cells light from inside and draw their top rule in, link underlines draw in, thicken or fade in, input frames go `ink-2`, an unchecked checkbox shows its check faintly. The `case` and sheet arrows nudge right; a button's `iconEnd` stays put.
- Press (`:active`) puts a button's face down onto its layer in 0.08s, so no white shows and a quick double click reads as two clean presses; the `case` and sheet arrows nudge further. Everything else answers a press in fill or colour - a step darker, or an ink block on a link badge.
- Focus: the ring (`global.css`, 2px `blue`) grows out of the element's edge to its offset instead of popping in; fields shift their hard `blue` shadow out.
- No always-on motion: no ambient background, no pulsing dots. The spinner turns only while a form is being sent. The one motion tied to scrolling is the process rail filling (it follows the scroll, it never plays on its own).
- `prefers-reduced-motion: reduce` turns every transition off and collapses every animation (`global.css`) and stops the spinner; each animated component has its own reduced-motion block too, so hover, press, focus and opening all snap. Transitions go off rather than get shorter: a short duration would turn on the default `all` on every element, and a resize or a media query would show the old style for a frame. A button's face then never moves: hover only fills, press hides the layer and takes the darker press fill.

## Do's and Don'ts

- ✅ **Do** draw a cell with `--mb-rule` and let neighbours share it through `cell-grid.astro`.
- ✅ **Do** give a new color token a single value, the one the dark page renders - there is no second palette to pair it with.
- ✅ **Do** use `--mb-snap` for every transition and add a reduced-motion block next to it; `--mb-slide` is only for the loading swap and the card rule.
- ❌ **Don't** round a corner. Not on cells, buttons, chips, avatars or inputs. The radio's circle is the one exception.
- ❌ **Don't** add glass (`backdrop-filter`), gradients, a dot grid or ambient motion; the substrate stays solid and still.
- ❌ **Don't** add a second accent color. Navy is the only chromatic element.
- ❌ **Don't** use solid white (`#fff`) - text tops out at the warm `ink` (`#ece7dc`). The EU funding band is the one exception: its logos need a white ground.
- ❌ **Don't** add soft or chromatic drop shadows. The only shadow is the hard `--mb-shift` offset on what the visitor acts on.
- ❌ **Don't** move a hovered element (`translateY` and the like). State shows in fill, rule and shadow; a button's face is the exception, lifting 1px off its still layer on hover and going down onto it (2px, 0.08s) on press.
