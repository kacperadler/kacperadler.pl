# KA0068 - Plan

- Job: 2026-10-10-plan-ticket-spec-feature-121bb851
- Planned at: 38ef06ae69372f500420ffdf659ab81d5be6ea7d

## Approach
This builds a separate set of minimal brutalism components in `src/components/mb/` and shows them on a new dev-only page, `/ui/mb`. The look is taken from `src/styles/proposals/minimal-brutalism/proposal.css`: thin ink lines, no radius, no glass, no spotlight, heavy Geist headlines, Geist Mono labels, and a hard shadow only on the primary button and on the form while someone is typing in it. No production page, layout, `src/components/ui/`, `src/styles/` file or the proposal itself changes, so the built site stays byte-identical. I built twice on HEAD and `cmp` of `dist/index.html` matched, so before/after comparison is a valid check.

- **Tokens**: `src/components/mb/tokens.css` defines only the proposal's own words: `--mb-rule` (ink), `--mb-hair` (`--v2-line`), `--mb-shift` (4px), `--mb-snap` (`0.12s linear`) and `--mb-display` (Geist). They point at palette variables that already exist in `src/styles/tokens.css`, which stays untouched. Editing it would change the hash of the production CSS file and so the home HTML.
- **Components**: one `.astro` file each, with scoped styles. Class names start with `mb-` so they never meet the global `.prose`, `.section-head`, `.eyebrow` and spotlight selectors in `global.css`. Props match `src/components/ui/` so KA0069 can swap imports. Forced states (`[data-state="hover"|"focus-visible"|"focus"]`, `.active`, `disabled`) sit next to the real `:hover`/`:focus`, as in `/ui`. Each component has its own `prefers-reduced-motion` block, on top of the global rule in `global.css`. The list:
  - button: primary/ghost, md/sm, active, disabled, loading. The arrow nudges 3px; the arrow has `flex-shrink: 0`, as KA0058 asks.
  - link: inline/nav/footer, plus `case` for "Zobacz realizację".
  - badge (outline/filled, fills on cell hover), tag, status pill.
  - cell and cell grid: cells share their 1px lines. Hover makes the cell lighter with a 3px blue top line, and nothing moves.
  - input, textarea, radio, field. Field keeps the `data-field` / `data-invalid` hooks that `contact-form.ts` uses.
  - section head: "01 /" label, headline left, lede right. The number is a CSS counter with empty alt text, as in the proposal.
  - typography block: `mb-prose`, standalone. It does not depend on `prose.css` or the global `.prose`.
- **Page frame**: the page sits on a solid substrate. Two hairlines at the container edges are drawn by fixed pseudo-elements, not by a background gradient, so axe can compute text contrast. The frame also holds:
  - the skip link and the header (brand, nav links, small CTA, menu button);
  - the footer and the mobile sheet, with the same data hooks as today (`data-nav-wrap`, `data-nav-cta`, `data-nav-link`, `id="mobile-sheet"`, `data-menu-open/close`, `data-sheet-link`);
  - the existing `layout/eu-funding.astro`, used as is.

  I read "page frame" to include header, footer and sheet because KA0069 moves those onto mb (see Open questions).
- **Home sections**: `src/components/mb/sections/` rebuilds hero (with the status card), services, how-i-work, experience and contact (with the contact form) from these components. They use the same data (`getCollection`, `processSteps`, `siteConfig`, `caseStudiesByExperience`), the same Polish copy and the same section ids, so KA0069 only changes imports.
- **The `/ui/mb` page**: its own HTML document with `BaseHead` (noindex), `tokens.css`, `global.css` and the mb frame. It cannot use `BaseLayout`, which brings the old header, ribbons and glass. On the page:
  - The home sections come first (the hero holds `#top`), then the catalogue: every component in every variant and state, and the contact form in each wrapper state (idle, submitting, error-validation, error-submit, success).
  - Grids use `min(100%, …)` column minimums, so nothing scrolls sideways at 360px (the KA0066 bug).
  - The page loads only `mobile-sheet.ts`, so the menu works at 360px. It does not load `contact-form.ts`: that script POSTs to the production NocoDB with no dev guard (`src/scripts/contact-form.ts:134`), so form states are forced instead of submitted.
  - A small nav links to `/ui` and `/ui/proposal/minimal-brutalism` for comparison.
- **Route**: one more `injectRoute` (`/ui/mb`) in the dev-only `uiCatalogue` integration in `astro.config.mjs`.

## Not available directly
- none

## Files
- `src/components/mb/tokens.css`: the `--mb-*` tokens on `:root`, built from existing palette variables. Imported by `page-frame.astro`.
- `src/components/mb/button.astro`: same props as `ui/button.astro`, mb look as described in Approach. Keeps `data-state="submitting"` for `contact-form.ts`.
- `src/components/mb/link.astro`: `inline | nav | footer | case` and the optional icon. Nav hover draws an ink bar; active is a blue bar with blue text.
- `src/components/mb/badge.astro`, `tag.astro`, `status-pill.astro`: square chips. Badge has `outline | filled` and `fillOnCellHover`.
- `src/components/mb/cell.astro`: the cell. `tag` can be article/li/div/a; the `a` form is used for contact links.
- `src/components/mb/cell-grid.astro`: the grid with shared lines (gap 0, 1px padding back, cells pulled -1px). Column minimum as a prop wrapped in `min(100%, …)`, and the odd last cell spans the row.
- `src/components/mb/input.astro`, `textarea.astro`, `radio.astro`, `field.astro`: muted frame. Focus is an ink frame plus the hard blue shadow; error is a coral frame with the message in mono behind a coral line; disabled is a flat panel; radio is a square chip that turns solid blue when checked.
- `src/components/mb/section-head.astro`: label, headline slot (`<em>` gets a thick blue underline) and lede. Counter-numbered, stacks to one column at 880px and below.
- `src/components/mb/prose.astro`: the typography block, with descendant rules via `:global()`. Covers `.lead`, h1-h4, lists, blockquote, inline code, pre and table. Pre and table scroll inside their own box, never the page.
- `src/components/mb/page-frame.astro`, `header.astro`, `footer.astro`, `mobile-sheet.astro`, `brand.astro`: the frame described in Approach. The closed sheet stays `visibility: hidden`.
- `src/components/mb/sections/hero.astro`, `services.astro`, `how-i-work.astro`, `experience.astro`, `contact.astro`, `src/components/mb/contact-form.astro`: the home sections, with the same copy, data, ids and contact-form hooks (`data-contact-wrap`, `data-contact-form`, `data-submit`, `data-form-error`, `data-form-success`, `data-form-reset`, honeypot). The contact form gains `state` (the wrapper's starting `data-state`) and `idPrefix`, so the catalogue can show several instances without duplicate ids.
- `src/pages/_ui/mb/index.astro`: the `/ui/mb` document, as described in Approach.
- `src/pages/_ui/mb/catalogue.astro`: the h2 sections Przycisk, Link, Badge i tag, Status pill, Komórka i siatka, Pola formularza, Nagłówek sekcji, Rama strony, Typografia, Formularz kontaktowy. All in mb style, with ids prefixed `mb-`.
- `astro.config.mjs`: `injectRoute({ entrypoint: "./src/pages/_ui/mb/index.astro", pattern: "/ui/mb" })` inside the `command === "dev"` branch, and the comment updated.
- `tests/e2e/ui-mb.spec.ts`: new spec (see How to test).
- `DESIGN.md`: a new section "Minimal brutalism (`src/components/mb/`, `/ui/mb`)" with the tokens, the vocabulary from Approach, and a note that KA0069 makes it the site's design. The frontmatter stays, because production does not change yet.
- `AGENTS.md`:
  - `## Wygląd`: a bullet for `src/components/mb/` and `/ui/mb`.
  - `## Struktura`: `components/{ui,layout,sections,contact,mb}` and `ui-mb` in the e2e list.
  - `## Komendy`: `/ui/mb` next to `/ui` on the `bun dev` line.

## Risks
- **Production build changes**: only `src/pages/_ui/mb/` imports mb, and Astro does not build `_`-prefixed pages unless they are injected. Check: build on HEAD and after, then `cmp dist/index.html` and an identical `ls -R dist`.
- **Contrast axe cannot compute** (it reports "incomplete" instead of passing when text sits over a background image or pseudo-element): the frame hairlines are pseudo-elements and the substrate is a solid color. The smoke run also lists `color-contrast` entries in `results.incomplete`. Palette pairs as I read them:
  - `--v2-bg` on `--blue` (≈9:1);
  - `--muted` on `--v2-bg` (≈7:1);
  - `--error` on `--v2-bg` (6.7:1, per the `tokens.css` comment).
- **Sideways scroll at 360px**:
  - grids use `min(100%, …)` (KA0066);
  - the right hairline would sit past the viewport, so the hairlines are hidden under the container width;
  - the contact email gets `overflow-wrap: anywhere`;
  - pre and table scroll inside their own box;
  - header at 360px: brand, small CTA and menu button must fit.
- **Hidden focusables in the closed sheet** (axe `aria-hidden-focus`): the closed sheet uses `visibility: hidden`, as `layout/mobile-sheet.astro` does.
- **Duplicate ids and radio groups** with several form instances on one page: `idPrefix`; radios group per form.
- **Real leads from dev**: `contact-form.ts` is not loaded on `/ui/mb`.
- **Copy drift**: until KA0069 the section copy exists twice (old and mb sections). KA0069 deletes the old ones; any copy edit in between has to touch both.
- **Breaking `ui-proposals.spec.ts`**: it expects the "Propozycje designu" nav on `/ui` to hold exactly one link, so `/ui` gets no link to `/ui/mb`.

## How to test
- **`/ui/mb` renders each component with every state forced, plus the home sections**: `ui-mb.spec.ts` (dev server, `reducedMotion: "reduce"`):
  - every catalogue h2 by exact name, and `#top`, `#services`, `#how`, `#experience`, `#contact` visible;
  - a forced hover on the primary button paints like a real hover (`background-color`, `box-shadow`, `color`);
  - a forced cell hover matches a real one, the cell's `fillOnCellHover` badge included;
  - a forced input focus matches a real focus, and the form-host shadow appears with it;
  - the error sample shows `.mb-err` and a `rgb(224, 122, 112)` border.
- **Components live in `src/components/mb/`, production unchanged**:
  - spec: production `/ui/mb` and `/ui/mb/` return 404. The existing `ui-catalogue.spec.ts` already checks the sitemap and home links for `/ui`.
  - manual: `test ! -e dist/ui`, `cmp` of `dist/index.html` against the HEAD build, and a grep showing no `components/mb` import outside `src/components/mb` and `src/pages/_ui/mb`.
- **AA contrast, axe zero at 1440 and 360, no sideways scroll at 360**:
  - spec: axe (wcag2a/2aa/21a/21aa, excluding `astro-dev-toolbar`) at 1440×900 and 360×800; at 360, `document.documentElement.scrollWidth <= clientWidth`.
  - smoke: review `results.incomplete`.
- **Motion respects `prefers-reduced-motion`**: smoke with a throwaway Playwright script. Under `reduce`, the button, cell and link `transition-duration` are 0.01ms or less and the loading spinner does not spin; without it, transitions read 0.12s. Plus a check that every mb component with a transition has its reduced-motion block.
- **e2e covers rendering, axe and absence from the build**: the spec above.
- **Mobile sheet works on `/ui/mb`**: smoke at 360. The menu button opens the sheet, the rest of the page goes inert, Esc closes it and focus returns to the button.
- **`bun run lint`, `bun run check`, `bun run build`, `bun run test:e2e` pass**: run all four. On HEAD, lint and check pass (95 files, 0 errors) and build is deterministic.

## Open questions
- I read "page frame" as the substrate with its edge hairlines plus header, footer and mobile sheet, because KA0069 moves the header and footer onto mb. If you meant only the substrate, header, footer and sheet move to KA0069 and this ticket gets smaller.
- A link from `/ui` to `/ui/mb` needs `src/pages/_ui/index.astro`, which is outside this ticket's Scope. Without it, `/ui/mb` is reached by typing the URL until KA0069 moves it to `/ui`. Should I add it?
