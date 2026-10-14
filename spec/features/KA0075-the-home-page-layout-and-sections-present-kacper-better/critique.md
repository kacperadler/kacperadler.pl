# KA0075 - Critique of the home page (look and copy)

- Job: 2026-10-14-ka0075-design-critique-o-305c9f41
- Judged: branch `h/2026-10-14-ka0075-preview-fixes-opu-7d8611e5` at `981663d`, built from that commit and screenshotted at 1440px (1600px-high slices) and 390px (844px-high slices, 2x). The server on `127.0.0.1:4325` runs `astro preview` in the `home-redesign` worktree on a build from 21:36, before `024bfa9` and `981663d`. It still shows the one-column FAQ and the narrow contact form, so it is not the branch tip.
- Against: `brief.md`, `tresc.md`, `DESIGN.md`.

Overall, the page holds together. The section order is the brief's, every heading is plain Polish, and the ruled cells, mono labels and single navy accent are used the same way from top to bottom. No section needs to move. What the page lacks is in three places: the way to contact (the buttons promise a call, the page ends on a form, and the middle of the page has no button), the weight of the first screen, and the order inside the offer and the contact sheet.

Where a change rewrites `tresc.md`, the item says so and says why. Everything else keeps the human's wording.

## Changes, most important first

1. **Contact, `sections/contact.astro` lede: say how the call happens.** Every button on the page (header `Umów rozmowę`, hero `Umów bezpłatną rozmowę (30 min)`, problems `Umów bezpłatną rozmowę`) promises a call. Each one lands on a message form whose lede only says "Napisz w 2–3 zdaniach", and the calendar comes later (KA0093). A visitor who clicked "book a call" gets no answer to "and when do we talk?". Change to `tresc.md`: `Napisz w 2–3 zdaniach, co robicie ręcznie. Odpowiem w 24h z pierwszym pomysłem i terminem 30-minutowej rozmowy.` This needs the human's ok, because it is a promise he makes. Drop the clause when KA0093 adds the calendar link.

2. **Add a button between the offer and contact.** After the three offer buttons, four sections (cases, process, about, FAQ) have no action. At 1440px that is 3,600px of scrolling (`#cases` at 3417, `#contact` at 6185), against the brief's "każda sekcja prowadzi do jednej akcji". Two changes, neither needs new copy:
   - Under the process steps (`sections/how-i-work.astro`): the same default button as in the problems section, `Umów bezpłatną rozmowę` → `#contact`.
   - FAQ: add the plan's approved lede `Nie ma tu Twojego? Zapytaj w formularzu, odpowiem w 24h.`, with `formularzu` linking to `#contact` (see 6).

3. **Hero status card, `sections/hero.astro`: fill it out and make it a real table.** At 1440px the card is 443×233px beside a 621×389px text column, vertically centred, so it floats with empty space above and below. It holds one row (`Odpowiadam | zwykle w 24h`). `Polska` is set in the same mono line as the role and wraps into a third line, `AI ENGINEER · PARTNER / TECHNOLOGICZNY / POLSKA`, so it reads as part of the title. Changes:
   - Move `Polska` out of `.mb-status-meta` into a row.
   - Add the availability fact already on the page (FAQ: "Przyjmuję 1–2 projekty jednocześnie").
   - Rows: `Lokalizacja | Polska`, `Odpowiadam | zwykle w 24h`, `Projekty | 1–2 jednocześnie`. The labels are new words; `tresc.md`'s facts stay.
   - Stretch the card to the text column's height (`align-items: stretch`, or align it to the top of the h1), so the first screen reads as two equal cells.

4. **Offer, `sections/services.astro`: one primary button and aligned rows.**
   - Three default blue buttons side by side (stacked one per cell on mobile, between 3745 and 4777px) compete with each other and with every other default button on the page. The headline says "Zaczynasz od pierwszego", so `Zamów audyt` stays default and `Wyceń projekt` and `Porozmawiajmy` become `outline`.
   - The `dl` rows do not line up across the three cells. The first cell's "Dla kogo" wraps onto two lines, so its `Co dostajesz` sits at 2911px against 2887px in the other two, and `Czas` at 3054 against 3030. Put the cell's rows on a shared grid (`grid-template-rows: subgrid` across the `CellGrid` row, or fixed row tracks) so the labels form straight lines through the table, as a ruled sheet should.

5. **Offer, pricing note: give it a place in the table.** "Każdy projekt wyceniam indywidualnie…" hangs under the table as loose `ink-2` text, and the line under it, "Koszt audytu odliczam od wdrożenia.", is set brighter and bolder than the paragraph it qualifies, so the hierarchy is upside down.
   - Move the paragraph into the section head's lede slot, which is empty now (see 6). The price answer then sits next to "Trzy kroki", where the eye looks for it.
   - Move "Koszt audytu odliczam od wdrożenia." into the `Audyt AI` cell, as the last line of its `Czas` row or its own row. It is a fact about that step.

   The wording does not change.

6. **Section heads without a lede: Problems, About, FAQ (and Offer, item 5).** `section-head.astro` is built as headline left, lede right, bottom-aligned. Where `tresc.md` gives no lede, the right half of the head is empty at 1440px: the four gaps are visible in slices 1, 2 and 4. The plan has approved ledes for these; `tresc.md` replaced the plan's copy but gave none here, so this adds back text the human already approved:
   - Problemy: `Jeśli rozpoznajesz swoją firmę choć w jednym punkcie, jesteś we właściwym miejscu.`
   - O mnie: `AI Engineer i partner technologiczny. Dowożę całość sam: od analizy procesu po wdrożenie i opiekę.`
   - FAQ: as in item 2.

   If the human prefers no ledes, the alternative is to let a head with no lede span both columns, so it does not look like something is missing.

7. **Contact sheet, `sections/contact.astro`: form first, direct links after it.** The sheet opens with the `EMAIL kontakt@…` link cell, and 80px under it the form's own `EMAIL` field label, so the two "EMAIL" labels read as one field. Changes:
   - Follow `tresc.md`'s own order (Formularz, then "Bezpośrednio: e-mail · LinkedIn"): put the form on top and the two `contact-link` cells as the sheet's last row, and the main action comes first.
   - Shorten the textarea at 1440px (1070×220px now) to about 5 rows; 2-3 sentences are what the lede asks for.
   - Pull the submit button up under it. Right now it sits alone 60px below the field, at the right edge of an empty row.

8. **Cases, `sections/cases.astro`: a number in each effect, one name per card.**
   - Copy, changing `tresc.md`: Helpfind `Efekt: Codzienne narzędzie pracy całej firmy.` → `Ponad 200 osób pracuje w nim codziennie.` The brief's format is "Efekt (liczba)". Energia Direct has its number ("Ok. 200 użytkowników dziennie") and Helpfind's effect repeats its own problem line. The number is the fact the problem line already states ("ponad 200 pracowników i partnerów"). It is not new.
   - Each card shows the logo and, right under it, the same name as the h3 ("helpfind" / "Helpfind"). The trust bar has just shown the logos. Drop the logo from the card and put the kind badge on the h3's row. At 390px the Helpfind badge wraps under the logo while Energia Direct's sits beside it; with the logo gone both cards read the same.

9. **Trust bar, `sections/trust.astro`: logos of equal weight, and a shorter strip on mobile.**
   - The logos share a 32px height, but Apptension's is a mark without a name (25×32px) and PwC's is 42×32px. Apptension reads as an unnamed icon and PwC, the biggest name, as the smallest.
   - Use Apptension's wordmark, or set the name in text beside the mark, and size each logo by optical weight (a per-logo height or max-width in `experience-logos.ts`) rather than one fixed height.
   - At 390px the strip is 417px tall, half a screen of grey logos in five big cells. Use the `sm` cell height, or three columns.

10. **Examples, the full-width fifth cell: cap the line length.** "Aplikacje szyte na miarę" spans the row, and its text runs at 1062px, about 100 characters a line, twice the measure of the other cards. Give the cell's `p` a `max-width` of about `65ch` (the prose measure in DESIGN.md), so the wide cell reads as easily as the others.

11. **Offer headline: the copy contradicts the table.** "Trzy kroki. Zaczynasz od pierwszego." The second card is for someone who "Wiesz, co chcesz zautomatyzować" and skips the audit. Change to `tresc.md`: `Trzy kroki. Zacznij od tego, który pasuje.` It keeps the rhythm and the "steps" idea and stops telling half the readers they are wrong. If the human wants the audit pushed as the entry point, item 4's single default button already does that without the claim.

12. **FAQ copy: "Ile masz dostępności?" → `Ile projektów prowadzisz jednocześnie?`** The current question is a calque of "how much availability do you have" and is not natural Polish. The new one is the question the answer ("Przyjmuję 1–2 projekty jednocześnie…") actually answers. Change to `tresc.md`.

13. **Process, `src/data/process.ts`: icons and one repeated phrase.**
   - Step 3 "Wdrożenie etapami" uses a code icon (`<>`), the one developer sign on a page for business owners; step 5 "Opieka" uses a rocket, which means launch, not care. Swap them for `lucide:layers` (stages) and `lucide:shield-check` (or `life-buoy`).
   - Step 3 shows the badge `CO TYDZIEŃ` and then its text opens with "Co tydzień widzisz coś, co działa". Change to `tresc.md`: `Widzisz działające kawałki systemu, a nie prezentacje. Problemy łapiemy wcześnie.` The badge already says how often.

14. **Footer, `footer.astro`: do not print the name twice.** The brand mark prints "Kacper Adler" and the line directly under it opens with "Kacper Adler · AI Engineer…". Change to `tresc.md`: drop the leading `Kacper Adler · `, so it reads `AI Engineer · Partner technologiczny. Wdrożenia AI, automatyzacje i aplikacje szyte na miarę.`

## What is right and stays

- The section order, the nav labels and the hero h1 and sub. The first screen at 390px shows the h1, the sub and both buttons.
- The problems grid in heavy type, the examples' two-column table, the process rail, the FAQ in two columns, and the frameless experience list in the about accordion (the human's three fixes all read well).
- Spacing between sections is consistent: 96px on desktop and 64px on mobile, with the trust bar's 32px lead-in on purpose. No other section needs more room than items 3, 7 and 10 give it.
