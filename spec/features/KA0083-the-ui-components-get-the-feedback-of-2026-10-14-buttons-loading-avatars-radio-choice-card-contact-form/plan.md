# KA0083 - Plan

- Job: 2026-10-14-ka0083-plan-ff906c08
- Planned at: 6287231c37b63d253d3a9e91e24a00d58215a807

## Approach
Only the components in `src/components/mb/`, their catalogue entries and their tests change. Badge, separator, label, checkbox look and input look stay as they are (points 5, 7, 8, 9, 12).

1. **Buttons (points 1, 3).** The default, secondary, outline and destructive variants get a white layer under them. They get a new class `mb-btn-raised`, set in the frontmatter of `button.astro`.
   - **Layer.** It is the existing hard shadow (`box-shadow` in `--mb-rule`, offset `--mb-btn-shift`). It always sits at the same place on screen, because the button's move plus the shadow offset always adds up to `--mb-btn-shift`.
   - **Hover.** The face lifts up and to the left by `--mb-btn-lift: 2px`, and the shadow grows to shift + 2px, so 2px more white shows.
   - **Press.** The face moves down onto the layer (moved by shift) and the shadow goes to 0, so no white shows.
   - **Mouse edge.** When the face moves away from under the mouse, hover can flicker on and off, and a click can be lost. To stop that, an `::after` on the button keeps covering the button's resting box in each state. On hover it reaches 2px further right and down; on press it reaches shift px further up and left.
   - **Outline hover.** It becomes the lit cell (`--v2-panel-elevated` fill, ink text). An ink face on an ink layer would read as one shape.
   - **Ghost and link.** They get no layer (see Open questions). Ghost press becomes an `ink-2` block, link press shows `blue-2` text with a 3px underline.
   - **`.active`, disabled, loading.** They stay flat with no layer, as today.
   - **Reduced motion.** There is no `transform` at all. Hover keeps the layer and changes only the fill. Press hides the layer and uses the darker press fill.
   - **Focus.** `outline-offset: shift + 4px` now applies to every raised variant.
2. **Arrow (point 4).** The `translateX(3px)` hover rule on `.mb-btn-icon-end` and its transition are deleted.
3. **Loading (point 2).**
   - **Markup.** The button's content gets one inner wrapper, `.mb-btn-content`. It holds the label (`.mb-btn-label`: the start icon, the slot and the end icon, with the size's `gap`) and the spinner, stacked in the same grid cell, so the button stays as wide as the label.
   - **Clipping.** The wrapper has `overflow-x: clip`. The horizontal padding moves from `.mb-btn` onto the wrapper through a `--mb-btn-pad` value, so the clip edge is the button's inner border.
   - **Slide.** At rest the spinner waits off to the right (`translateX(calc(100% + pad))`, `visibility: hidden`, its spin paused). While loading (`.mb-btn-loading` or `[data-state="submitting"]`) the label moves off to the left (`translateX(calc(-100% - pad))`) and the spinner moves to 0. Transitions between these two states give exactly the requested directions both ways, at the new `--mb-slide` speed.
   - **Screen readers.** The label is only moved and clipped, never hidden, so the button keeps its accessible name.
4. **Demo button (point 15).** A new catalogue sample "kliknij - ładuje się 4 s". A `<script>` in `catalogue.astro` sets the same attributes `contact-form.ts` sets (`data-state="submitting"`, `disabled`, `aria-busy`) and clears them after 4000 ms. It therefore also works on `/ui/proposal/<id>`, which renders the same catalogue.
5. **Avatar group (point 6), proposed look for the screenshots.**
   - The overlap is 25% of the size: 8, 12 and 24px through `--mb-avatar-overlap`.
   - Each avatar and the counter get a 2px `outline` in `--v2-bg`, so the one in front cuts cleanly across the one behind.
   - The "+N" counter matches the initials avatar: the same fill, rule, ring and mono size (11, 15 and 28px).
   - The counter gets `position: relative`. Today it is not positioned, so the last avatar paints over its left edge (visible in the current catalogue).
   - The catalogue shows groups at sm, default and lg.
6. **Radio (point 10).** The default radio becomes round (`border-radius: 50%`); the existing inset ring becomes the dot. Choice chips stay square.
7. **Choice (point 11), proposed for the screenshots.**
   - **Size.** Chips are 36px high (`min-height`, `padding: 0 14px`, inline-flex centred), level with the `sm` button. The gap stays 8px.
   - **States.**
     - Hover: the lit cell, `panel-elevated` with an ink frame.
     - Press (`:active` or `[data-state="pressed"]`): the `panel` fill.
     - Checked: a blue block.
     - Checked and hovered: `blue-2`.
     - Disabled: as today.
     - Checked and disabled: a `muted` block with `panel` text, so the chosen type stays visible while the form sends.
   - **Unchanged.** Invalid and focus stay as they are, and the 1px frame and weight 500 stay in every state.
   - The `state` prop gains `"pressed"`, and the catalogue gains a "pressed" sample.
8. **Card (point 13).** The bar's `transform-origin` is `right` at rest and `left` on hover. It grows from the left on hover in and leaves to the right on hover out. Its duration becomes `--mb-slide`.
9. **Contact form (point 14).** The rule that lit the whole sheet on focus (`.mb-contact-form:has(input[type=email]:focus …)`) is deleted, so only the field shows its focus shadow. The hover fill and the success shadow stay (see Open questions).
10. **Sending (point 16).**
    - **Script.** In `setState`, `contact-form.ts` sets `disabled` on every `input, textarea, button` of the form while the state is `submitting`, and clears it otherwise. This replaces the line that disabled only the submit button. `readPayload` runs before `setState(form, "submitting")`, so disabled fields do not empty the payload.
    - **Catalogue.** `contact-form.astro` passes `disabled={submitting}` to the input, textarea and radios, so the catalogue's "submitting" sample shows the look.
    - **KA0052.** The disabled styles already exist in `input.astro`, `textarea.astro`, `checkbox.astro` and the default radio. Only checked-and-disabled is missing, on the choice chip (item 7). `checkbox.astro` does not change.
11. **New speed token.** `--mb-slide: 0.3s ease-out` goes into `tokens.css`. It is used only by the card bar and the loading slide; every other change stays at `--mb-snap`.
12. **Docs.** The human's points break written rules in `AGENTS.md` and `DESIGN.md`: nothing moves on hover, no rounded corners, every change is `--mb-snap`, and the form sheet shadows on focus. Those lines are updated in the same branch, as the styleguide requires when tokens change.
13. **KA0058 needs no change.** `flex-shrink: 0` is already on `.mb-btn :global(.mb-btn-icon)` (`button.astro:167-171`). KA0058 points at the removed `src/components/ui/`. The new label wrapper keeps that rule.

## Not available directly
none

## Files
- `src/components/mb/button.astro`:
  - Markup: the `.mb-btn-content`, `.mb-btn-label` and spinner wrapper in both the `<a>` and `<button>` branches, and the `mb-btn-raised` class.
  - CSS: the layer, lift, press and hit-area `::after` rules; `--mb-btn-pad` and `--mb-btn-lift`; outline hover as the lit cell; ghost and link press.
  - The slide rules for `.mb-btn-loading` and `[data-state="submitting"]` replace `display: none` on the spinner.
  - The arrow nudge is removed, the reduced-motion block is rewritten, and the comment block is updated.
- `src/components/mb/spinner.astro`: no change expected. The button pauses the spin through `.mb-btn :global(.mb-btn-spinner svg)`; if a scoped selector cannot reach it, a `paused` prop is added.
- `src/components/mb/avatar-group.astro`: `--mb-avatar-overlap` for each size, the ring, the counter matching the avatars, `position: relative` on the counter.
- `src/components/mb/avatar.astro`: the ring in a group, if it is set from the avatar side (otherwise only in the group via `:global`); the comment.
- `src/components/mb/radio.astro`: the round default; the choice size and states; `"pressed"` added to `state`; checked-and-disabled for the choice; the comment.
- `src/components/mb/card.astro`: `transform-origin` right at rest and left on hover; the duration becomes `--mb-slide`; the comment.
- `src/components/mb/contact-form.astro`: delete the `:has(...:focus)` part of the sheet highlight and keep `[data-state="success"]`; `disabled={submitting}` on the input, textarea and radios; the comment.
- `src/scripts/contact-form.ts`: `setState` disables or enables every `input, textarea, button` in the form; the comment at the top.
- `src/components/mb/input.astro`, `textarea.astro`, `checkbox.astro`: no change (their disabled styles exist).
- `src/styles/tokens.css`: `--mb-slide`, and updated comments for `--mb-shift` and `--mb-snap`.
- `src/pages/_ui/catalogue.astro`:
  - The loading demo sample and its `<script>`.
  - Avatar groups at sm, default and lg.
  - The choice "pressed" sample (in `radioStates`, used only by the choice row).
  - Updated Polish notes for buttons ("warstwa pod spodem...") and radio ("okrągły").
- `tests/e2e/ui-catalogue.spec.ts`:
  - The existing hover test also compares `transform`.
  - New tests: the layer stays put (transform x + shadow x = shift at rest, hover and press) for each raised variant, and reduced motion with no transform and a pressed look different from idle.
  - New tests: the loading demo, the round radio, and the card bar direction (the `::before` `transform-origin` x is 0 when hovered and the card width when not).
  - The test "a forced input focus paints like a real one, the form sheet's shadow with it" is rewritten: focus keeps the sheet's `box-shadow: none` and its background unchanged.
  - The motion test's button labels are updated.
- `tests/e2e/contact-form.spec.ts`: a new test holds the NocoDB route on an unresolved promise, checks the email, textarea, all `type` radios and the submit are disabled, then fulfils with 500 and checks they are enabled again and keep their values.
- `DESIGN.md`:
  - The `button` and `radio` rows of the component table, the Card prose, `### Hard shadow`, `## Motion` (hover lift, press, slide).
  - Do's and Don'ts: no rounded corners except the radio dot; nothing moves on hover except the raised button face; `--mb-slide` as the one exception to `--mb-snap`.
  - The `--mb-slide` token row, and `rounded.full` in the frontmatter.
- `AGENTS.md`: the `## Wygląd` lines on hard shadow and the form sheet, and the `## Don't` lines on corners, `translateY` on hover and `--mb-snap`.
- `spec/features/KA0083-.../screenshots/*.png`: viewport-high screenshots of the changed components, taken at 1280×800 with a temporary script.
  - Buttons: idle, hover and pressed rows.
  - Loading: before, during and after.
  - Avatar group, radio, choice, card on hover.
  - Contact form: focus and submitting.

## Risks
- **Mouse at the button edge.** Moving the button on hover would make hover flicker at its bottom and right edges, and a press could lose its click at the top-left edge. The per-state `::after` hit area covers the resting box in every state. The new layer test hovers 1px inside the bottom-right corner and checks the face stays lifted.
- **Layer moving during the transition.** `transform` and `box-shadow` share one duration and timing function, so their sum, and with it the layer, stays put while they run.
- **Clipping the slide.** `overflow` on the button would clip the hit-area `::after`. The clip sits on `.mb-btn-content` instead, so the button's own `box-shadow` and focus outline are never clipped.
- **Layout of the new wrapper.** It could change button sizes and the header's narrow-width layout (the arrow hidden at 400px, KA0058). `flex-shrink: 0` and `white-space: nowrap` stay. The 360px catalogue test and `nav-active` / `mobile-sheet` specs cover the header.
- **Focus lost while sending.** A disabled field drops its focus, and so does the submit button today. After `error-submit` focus is on `<body>`. This is accepted as today's behaviour for the button.
- **Card bar reversed mid-way.** Leaving a card before its bar is fully drawn makes the bar jump, because the origin flips. It only happens on very quick passes.
- **Proposal pages.** The proposals restyle `.mb-card::before`, and their rules win over the base. The new base `transform-origin` could still show on `/ui/proposal/*`; `ui-proposals.spec.ts` runs in the full suite.
- **Production pages.** The hero, 404, case study and header outline buttons and the sheet close button now show the white layer. That is what "every button" asks for. The screenshots cover the header.
- **The round radio and the "no rounded corners" test.** `design.spec.ts` fails a production page with a visible rounded corner. The default radio is not on any production page (the form uses the choice chip, whose radio is invisible), so that test holds.

## How to test
- **Buttons, layer and press (points 1, 3):** a new catalogue test, for each raised variant.
  - Hover gives `matrix(1,0,0,1,-2,-2)` and press gives `(…,4,4)` with a flat shadow.
  - Shadow offset plus transform equals 4px at rest, on hover and on press.
  - The face stays lifted with the pointer 1px inside its bottom-right corner.
  - Under `reducedMotion: "reduce"`, hover and press give `transform: none`, and the pressed background and shadow differ from idle.
  - The existing focus-ring motion test still finds `:focus-visible`.
- **Loading (point 2) and demo (point 15):** click the demo button.
  - Within the first frames both the label and the spinner have animations running.
  - While loading: `aria-busy="true"`, the label's `m41` is below 0 and the spinner's is 0.
  - The button keeps one width before, during and after.
  - Within 6 s it returns by itself: `aria-busy` is gone, the label's `m41` is 0 and the spinner's is above 0.
- **Arrow (point 4):** after hovering an `iconEnd` button, `.mb-btn-icon-end` has `transform: none`.
- **Avatar group (point 6) and choice (point 11):** the human accepts the screenshots in the ticket folder.
- **Radio (point 10):** `.mb-radio-default .mb-radio-input` has `border-radius: 50%`.
- **Card (point 13):** the forced hover and real hover have `::before` `transform-origin` x 0px; the idle card has its width in px. The existing scaleX test stays.
- **Contact form focus (point 14):** the rewritten catalogue test: focusing the email leaves the wrap's `box-shadow: none` and its background equal to the wrap at idle without hover. The email gets its blue shadow.
- **Sending (point 16):** the new `contact-form.spec.ts` test on the production build: the fields are disabled while the request is held, and enabled with their values after the 500.
- **Screenshots:** a temporary Playwright script (1280×800) saves them to `spec/features/KA0083-.../screenshots/`, then the script is deleted.
- **Checks:** `bun run check`, `bun run lint` and `bun run test` must pass. The worktree's Playwright expects chromium build 1248, and only 1243 is installed in `~/.cache/ms-playwright`, so run `bunx playwright install chromium` first.
- **What I ran while planning:** I ran nothing from the suite. I only used the dev server and took screenshots of the current avatar, radio, button and form sections.

## Open questions
- Ghost and link buttons: the plan gives them no white layer (ghost has no frame, link is text) and a clearer press: an `ink-2` block for ghost, `blue-2` text with a thicker underline for link. Or should they also get the layer?
- Contact form: the sheet still fills to `panel` on hover, so clicking into a field with the mouse still lights the whole sheet. Remove that hover fill too? I recommend yes. The plan keeps it until you say so.
