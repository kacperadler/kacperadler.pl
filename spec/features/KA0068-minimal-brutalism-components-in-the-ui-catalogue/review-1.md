# KA0068 - Review 1

- Job: 2026-10-10-review-mb-components-198d839c
- Branch: h/2026-10-10-mb-components-394266f9
- Commit reviewed: 2e0cf00a69ce1053420bed684d75cc64257d2925
- Verdict: PASS

## Final message

## Findings

None that block.

## Notes (non-blocking)

- Until KA0069, home-section copy lives twice (`sections/` and `mb/sections/`); worker flagged this explicitly, matches plan's documented risk.
- F1 finding (production mobile-sheet reduced-motion focus bug) correctly logged as `Status: open` in `findings.md`, not silently fixed in production code (`layout/mobile-sheet.astro` untouched, confirmed by diff).

## Checks run

- `bun install --frozen-lockfile`: clean, 358 packages.
- `bun run lint`: 123 files, no fixes needed.
- `bun run check`: 0 errors/warnings/hints.
- `bun run build`: succeeds; `test ! -e dist/ui` true; `diff -rq` against a fresh build of base commit `063d24d` on the full `dist/` tree: zero differences (byte-identical, not just `index.html`).
- Grep for `@/components/mb` / `components/mb/` imports: only inside `src/components/mb/` and `src/pages/_ui/mb/`.
- `bun run test:e2e`: 64 passed (includes `ui-mb.spec.ts`'s 14 tests and the updated `ui-proposals.spec.ts` named-link assertion).
- Em-dash scan (`\x{2014}`) over the full diff: none.
- `DESIGN.md`/`AGENTS.md` diffs reviewed: frontmatter untouched, new "Minimal brutalism" section covers tokens/variant table/KA0069 renames as the plan specifies; `AGENTS.md` gets the three bullets (`## Komendy`, `## Wygląd`, `## Struktura`) the plan lists.
- `src/styles/tokens.css` diff: empty (untouched, as required); `mb/tokens.css` builds only from existing palette vars.
- Out-of-scope paths (`Dockerfile`, `nginx.conf`, `og-default.png.ts`, `src/components/ui/`, `src/components/layout/`, `src/components/sections/`, `src/components/contact/`, `src/styles/`, `src/scripts/`, `src/pages/index.astro`) diff empty, so Docker build check not applicable and scope held.
- Component file list in `src/components/mb/` and `sections/` cross-checked 1:1 against the plan's "Files" list: all present (button, spinner, badge, alert, avatar, avatar-group, separator, label, checkbox, radio, input, textarea, field, field-set, accordion/accordion-item, breadcrumb, pagination, link, tag, status-pill, card, cell-grid, section-head, prose, page-frame/header/footer/mobile-sheet/brand, contact-form, 5 home sections).
- Reduced-motion coverage: every `mb` file containing `transition:` also contains a `prefers-reduced-motion` block (verified by shell loop over all `.astro` files in `mb/` and `mb/sections/`); spinner's `animation` has its own block too.
- Safety check: `/ui/mb` loads only `mobile-sheet.ts` (grep confirms sole `<script>` import); `contact-form.ts` appears only as documentation text in the catalogue, never imported; page sets `noindex`; `ContactForm` has no `fetch`/`action`/NocoDB reference.
- Mutation test: removed the reduced-motion `transition-property: none` block the worker added to `mb/mobile-sheet.astro`, reran `ui-mb.spec.ts -g "modal and Escape"` → failed exactly as described (`toBeFocused()` on `[data-menu-close]` times out, "inactive"). Restored the file; `git status` clean afterward confirmed.
- Catalogue section/sample ids (`mb-button`, `mb-form`, `mb-accordion-single/multiple`, `mb-breadcrumb`, `mb-pagination`, `mb-card`, `data-form-sample`) cross-checked against the selectors `ui-mb.spec.ts` uses: all match; form-sample captions are single words, so `idPrefix` can't collide.
- `button.astro`'s `Props` union statically requires `aria-label` for every icon size, matching the plan's a11y requirement.
- `accordion.astro`'s shared-`name` injection HTML-escapes `&`/`"` before writing into the rendered markup.

PASS
