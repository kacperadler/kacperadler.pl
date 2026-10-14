# KA0075 - Plan

- Job: 2026-10-14-plan-ticket-spec-feature-cb7c968b
- Planned at: 2a1f2542126dbfd81eb459ec7fe7b7644c43dbb8

## Approach

The home page gets the brief's twelve parts, in the brief's order: header, hero, trust bar, problems, automation examples, the three-step offer, case studies, process, about, FAQ, contact, footer. The page stops selling a frontend developer. It sells an AI Engineer and technology partner. Every part either leads to `#contact` or sits next to a button that does.

**What changes**
- **Header menu.** It becomes `Oferta · Realizacje · Proces · O mnie · FAQ`, followed by the button `Umów rozmowę`. `Realizacje` now always points at the new home section `#cases`, not at the `/realizacje/` list. So the menu no longer depends on whether case studies exist. The list stays reachable from the section's `Wszystkie realizacje` link, which shows only when the list is built.
- **Section ids.** These ids stay: `#top` (hero), `#services` (now the offer), `#how` (process), `#contact`. These are new: `#trust`, `#problems`, `#examples`, `#cases`, `#about`, `#faq`. `#experience` is removed.
- **Offer content.** The services collection becomes the three steps:
  - The six JSON files are replaced by `audit.json`, `implementation.json`, `partner.json`.
  - The schema changes to `title, order, audience, description, duration, cta`. Tags are dropped from the offer.
  - "Wizytówki" disappears.
  - Mobile apps, web apps and landing pages are named inside "Wdrożenie".
- **Copy shared with `llms-full.txt`.** It goes in `src/data/`, following the `process.ts` pattern: one new `src/data/home.ts` holds the examples, the case highlights, the about text and the FAQ. Copy used only on the page stays inline in its section: hero, trust bar, problems, contact.
- **"Z kim pracowałem".** The logo wall is removed. The full experience list (same entries, same roles, same `Zobacz realizację` links) moves into a closed accordion, "Pełna lista doświadczeń", inside "O mnie". The logo map moves to `src/data/experience-logos.ts`, because the trust bar needs it too.
- **Form types.** They become `Audyt AI` (`audit`), `Wdrożenie` (`implementation`), `Stała współpraca` (`partner`), `Inne` (`other`). `checkLead` accepts only these, so the old `ai`, `webapp`, `landing`, `mobile`, `tool` get a 400.
  - Stored rows are never touched: no migration. `other` keeps its meaning.
- **Meta.**
  - Home title: `Wdrożenia AI i automatyzacje dla firm | Kacper Adler`, from a new `siteConfig.title`. Other pages keep `X - Kacper Adler`.
  - `role`: `AI Engineer · Partner technologiczny`.
  - Description: the brief's section 6 text.
  - `tagline` (used by the OG image and `llms*.txt`): `Wdrożenia AI i automatyzacje dla firm.`
  - `knowsAbout` gains AI agents and automation. Experience roles stay, per KA0051.
  - `og-default.png.ts` itself does not change: it reads `role` and `tagline`.
- **Footer.** The tagline changes. The EFS+ band (`layout/eu-funding.astro` in `page-frame.astro`) is not touched.

**Left alone**
- The design system and tokens, `card` / `cell-grid` / `section-head` / `accordion` / `button` (all reused as they are).
- `leads-db.ts` and the leads table.
- The legal pages.
- `/realizacje/` pages (except one button label on the case study page).
- nginx, Docker, the OG layout, the experience JSON (roles stay).

**Workflow.** Copy changes go in `copy(<section>): ...` commits, one section per commit, separate from code commits (styleguide).

**Missing facts.** Anything that needs a fact the human has not given is left out, with no placeholder:
- the free-dates row ("Wolne terminy")
- the calendar button (KA0093)
- testimonials (KA0094)
- his own AI case (KA0095)
- case-study effect numbers (KA0033, KA0034)

Until KA0093, the "Umów..." buttons lead to the contact form.

### Copy (Polish, for approval before any code)

**Nawigacja:** `Oferta` · `Realizacje` · `Proces` · `O mnie` · `FAQ` · button `Umów rozmowę`. The mobile menu has the same entries; its badge `Otwarty na nowe współprace` stays.

**Hero (#top)**
- h1: `Mniej ręcznej roboty. Więcej <em>czasu</em> na biznes.`
- Podtytuł: `Wdrożenia AI i automatyzacji dla firm. Znajduję procesy, które zjadają czas Twojego zespołu, i zamieniam je w działające systemy. Bez zatrudniania działu IT.`
- Buttons: `Umów bezpłatną rozmowę (30 min)` → `#contact`; outline `Zobacz, co mogę zautomatyzować` → `#examples`.
- Status card:
  - photo, `Kacper Adler`
  - `AI Engineer · Partner technologiczny`
  - `Polska`
  - badge `Otwarty na nowe współprace`
  - rows: `Oferta` | `Audyt · Wdrożenie · Stała opieka`; `Dla` | `firm w Polsce i UE`; `Odpowiadam` | `zwykle w 24h`
- Removed: `Stack`, `Teraz: Frontend dev w ReX`, `Buduję interfejsy...`.

**Pasek zaufania (#trust)**
- No heading.
- Caption: `Pracowałem z firmami od korporacji po startupy.`
- Logos in order: PwC, Apptension, Helpfind, Energia Direct, ReX. Each logo's alt is the `company` from `src/content/experience`. Payloo is not on the bar.

**01 / Problemy (#problems)**
- h2: `Brzmi <em>znajomo</em>?`
- Lede: `Jeśli rozpoznajesz swoją firmę choć w jednym punkcie, jesteś we właściwym miejscu.`
- Cells:
  - `Twój zespół godzinami przepisuje dane między systemami.`
  - `Odpowiadacie w kółko na te same maile i zapytania.`
  - `Raporty składacie ręcznie z kilku Exceli.`
  - `Wiesz, że AI mogłoby pomóc, ale nie wiesz, od czego zacząć.`
- Closing: `To da się zautomatyzować. Zwykle szybciej i taniej, niż myślisz.` + button `Umów bezpłatną rozmowę` → `#contact`.

**02 / Przykłady (#examples)**
- h2: `Co mogę <em>zautomatyzować</em>.`
- Lede: `Kilka przykładów. Każde rozwiązanie łączę z narzędziami, których już używacie.`
- Cards (title, text, tags):
  - `Obsługa zapytań`: `Agent AI odpowiada na maile i czat, a trudne sprawy przekazuje człowiekowi.` [LLM, MCP]
  - `Przetwarzanie dokumentów`: `Faktury, umowy, CV i zamówienia trafiają do Twojego systemu jako dane, bez przepisywania.` [LLM, API]
  - `Integracje`: `CRM, Gmail, arkusze i ERP wymieniają dane same, bez kopiuj-wklej.` [API, MCP]
  - `Raporty i dashboardy`: `Dane z wielu źródeł w jednym miejscu, aktualne na bieżąco.` [API, React]
  - `Narzędzia wewnętrzne`: `Panele, CRM-y i aplikacje szyte pod Twój proces, w przeglądarce i na telefonie.` [React, React Native, TypeScript]
- Button (outline): `Opowiedz mi o swoim procesie` → `#contact`.

**03 / Oferta (#services)**
- h2: `Od audytu do <em>stałej opieki</em>.`
- Lede: `Zacznij od kroku, który pasuje do Ciebie dziś.`

| | 01 Audyt AI | 02 Wdrożenie | 03 Partner technologiczny |
|---|---|---|---|
| Dla kogo | `Chcesz wiedzieć, co ma sens.` | `Wiesz, co chcesz zautomatyzować.` | `Chcesz mieć swój dział IT i AI, bez zatrudniania go.` |
| Co dostajesz | `Analizę procesów, listę automatyzacji z wyliczonym zyskiem i plan wdrożenia.` | `Działający system: agenta AI, automatyzację, integrację albo aplikację - webową, mobilną lub landing page.` | `Rozwój, opiekę i monitoring Twoich systemów oraz nowe automatyzacje co miesiąc.` |
| Czas | `ok. 1–2 tygodnie` | `od 2 tygodni` | `abonament miesięczny` |
| Button → `#contact` | `Zamów audyt` | `Wyceń projekt` | `Porozmawiajmy` |

- Under the table: `Każdy projekt wyceniam indywidualnie. Wycenę dostajesz w 2–3 dni po rozmowie. Rozmowa i wycena są bezpłatne i do niczego nie zobowiązują.`
- Below it (the human, 2026-10-14): `Koszt audytu odliczam od wdrożenia.`

**04 / Realizacje (#cases)**
- h2: `Systemy, z których firmy <em>korzystają</em> codziennie.`
- Lede: `Projekty, przy których pracowałem. Nie dema, tylko narzędzia, na których ludzie pracują każdego dnia.`
- Helpfind (badge `CRM wewnętrzny`):
  - Problem: `Ponad 200 pracowników i partnerów potrzebowało jednego narzędzia do codziennej pracy, połączonego z pocztą i systemem Weylo/Focus.`
  - Rozwiązanie: `Wewnętrzny CRM zintegrowany z Gmailem i Weylo/Focus, z szybkimi długimi listami i własną biblioteką komponentów.`
  - Skala: `200+ osób pracuje w nim codziennie.`
- Energia Direct (badge `Aplikacja mobilna`):
  - Problem: `Działający marketplace z leadami dla branży OZE i budowlanej potrzebował aplikacji na telefon dla handlowców i wykonawców.`
  - Rozwiązanie: `Aplikacja mobilna na iOS i Android, połączona z działającym marketplace'em.`
  - Skala: `Średnio 200 użytkowników dziennie.`
- When a case study exists for the entry: `Zobacz realizację` (the company name is in its accessible name). When any case study exists: `Wszystkie realizacje` → `/realizacje/`.
- The "Efekt" row with a number comes with KA0033 and KA0034. The own case, shown first, comes with KA0095.

**05 / Proces (#how)**
- h2: `Od rozmowy do <em>działającego</em> systemu.`
- Lede: `Pięć kroków. Na każdym wiesz, co się dzieje i co dalej.`
- Steps:
  1. `Rozmowa` [`30 min`]: `Opowiadasz o procesie, który zjada czas zespołu. Ja szukam, co da się zautomatyzować.`
  2. `Plan i wycena` [`2–3 dni`]: `Dostajesz krótki dokument: co robimy, ile to trwa, ile kosztuje i ile zyskasz.`
  3. `Wdrożenie etapami` [`co tydzień`]: `Pracuję małymi etapami. Co tydzień widzisz coś, co działa.`
  4. `Feedback` [`na bieżąco`]: `Nie musisz znać się na technologii. Mówisz, co ma działać inaczej, a ja zamieniam to na konkretne zmiany.`
  5. `Opieka` [`po wdrożeniu`]: `Monitoring i rozwój. Twój system nie zostaje sam.`

**06 / O mnie (#about)**
- h2: `Kim <em>jestem</em>.`
- Lede: `AI Engineer i partner technologiczny. Dowożę całość sam: od analizy procesu po wdrożenie i opiekę.`
- Text, three paragraphs, the brief's own words:
  - `Od 2021 roku buduję oprogramowanie: od PwC, przez software house Apptension, po wewnętrzne systemy używane codziennie przez setki osób.`
  - `Dziś łączę to doświadczenie z AI: sam dowożę to, na co kiedyś trzeba było całego zespołu.`
  - `Pracuję z firmami jako ich partner technologiczny: rozumiem biznes, tłumaczę technologię na ludzki język i biorę odpowiedzialność za efekt.`
- Photo (`me.jpg`). Link cells: `LinkedIn` `/in/kacperadler`, `GitHub` `/kacperadler`.
- Accordion, closed by default: `Pełna lista doświadczeń`. Inside it, every entry of `src/content/experience` as today: logo, `teraz` / `Zlecenie` / years, company, role, description, `Zobacz realizację`.

**07 / FAQ (#faq)**
- h2: `Częste <em>pytania</em>.`
- Lede: `Nie ma tu Twojego? Zapytaj w formularzu, odpowiem w 24h.` The word "formularzu" links to `#contact`.
- Questions and answers:
  - `Czy AI w ogóle ma sens w mojej firmie?` - `Od tego jest audyt. Sprawdzam Twoje procesy i liczę, co się opłaca. Jeśli AI nie ma sensu, powiem Ci to wprost.`
  - `Ile to kosztuje?` - `Zależy od zakresu. Wycenę dostajesz w 2–3 dni po bezpłatnej rozmowie, bez ukrytych kosztów.`
  - `Co z bezpieczeństwem danych?` - `Korzystam z AI przez API albo plany firmowe (np. Claude, ChatGPT), które nie trenują modeli na Twoich danych. Pliki i bazy zostają u Ciebie, a do AI trafia tylko to, czego wymaga zadanie.` (the human, 2026-10-14)
  - `Co, jeśli przestaniesz ze mną współpracować?` - `Kod i dokumentacja należą do Ciebie. Możesz je przekazać innej osobie lub firmie i rozwijać dalej.`
  - `Nie znam się na technologii. Czy to problem?` - `Nie. To moja robota. Rozmawiamy o Twoich procesach, a technologię biorę na siebie.`
  - `Jak szybko zobaczę efekt?` - `Pierwsze działające elementy zwykle w 1–2 tygodnie.`

**08 / Kontakt (#contact)**
- h2: `Pokaż mi proces, który zjada <em>Twój czas</em>.`
- Lede: `Napisz w 2–3 zdaniach, co robicie ręcznie. Odpowiem w 24h z pierwszym pomysłem, jak to zautomatyzować.`
- Email and LinkedIn cells as today.
- Form fields: email, `Typ projektu`: `Audyt AI` / `Wdrożenie` / `Stała współpraca` / `Inne`, message.
- Message placeholder: `Napisz w 2–3 zdaniach, co robicie ręcznie i ile czasu to zajmuje.`

**Stopka**
- Tagline: `AI Engineer · Partner technologiczny. Wdrożenia AI i automatyzacje dla firm.`
- Unchanged: the `Informacje` column (Polityka prywatności, Regulamin) and the `Kontakt` column (Email, LinkedIn, GitHub).
- The EFS+ band stays.

**Meta / SEO**
- Title: `Wdrożenia AI i automatyzacje dla firm | Kacper Adler`.
- Description: `Automatyzuję ręczną pracę w firmach z pomocą AI: agenci, integracje, narzędzia wewnętrzne. Audyt, wdrożenie i stała opieka, bez zatrudniania działu IT.`
- OG image: label `AI ENGINEER · PARTNER TECHNOLOGICZNY`, tagline `Wdrożenia AI i automatyzacje dla firm.`
- `knowsAbout`: `Wdrożenia AI w firmach`, `Automatyzacja procesów biznesowych`, `Agenci AI`, `Automatyzacja biznesu`, `Integracje systemów`, `Narzędzia wewnętrzne`, `Aplikacje webowe i mobilne`, `TypeScript`, `React`, `React Native`.
- JSON-LD offer catalog: the three steps, named `Oferta`.

**llms.txt**
- Header: `# Kacper Adler - AI Engineer · Partner technologiczny`, then `> <tagline> <description>`.
- Sections: `## Oferta` (three steps: title, time, what you get), `## Co mogę zautomatyzować` (five examples), `## Doświadczenie` (the experience list as today), `## Realizacje` (only when case studies exist, as today), `## Kontakt`, `## Pełna treść`.

**llms-full.txt**
- Header and tagline as in llms.txt, the description, and the line `Dla firm w Polsce i Unii Europejskiej, które chcą mniej ręcznej roboty bez zatrudniania działu IT.`
- Sections:
  - `## Oferta`: each step with Dla kogo, Co dostajesz, Czas, plus the pricing note.
  - `## Co mogę zautomatyzować`
  - `## Wybrane projekty`: the two highlights with Problem, Rozwiązanie, Skala. Not called "Realizacje", so the no-case-studies check stays true.
  - `## Proces współpracy`
  - `## O mnie`
  - `## Doświadczenie`
  - `## Realizacje`: only when case studies exist.
  - `## FAQ`
  - `## Kontakt`
  - `## Co napisać w pierwszej wiadomości`: 1. `Co robicie ręcznie`, 2. `Ile czasu to zajmuje`, 3. `Czego szukasz - audyt, wdrożenie czy stała współpraca`.
- Removed: "Pracuję async, w sprintach, z zespołami produktowymi" and "Frontend dla firm z różnych branż".

## Not available directly
none

## Files
**Data and content**
- `src/data/site-config.ts`: change `role`, `description`, `tagline`; add `title`.
- `src/data/navigation.ts`: `primaryNav` becomes a static list of five section links (`/#services`, `/#cases`, `/#how`, `/#about`, `/#faq`). Drop `getCollection`, `caseStudiesNav` and the async function. `contactCta` label becomes `Umów rozmowę`.
- `src/data/process.ts`: the five shortened steps above.
- `src/data/home.ts` (new): typed `automations`, `caseHighlights` (`experience` id, `kind`, `problem`, `solution`, `scale`), `about` paragraphs, `faq`. Read by the sections and `llms-full.txt.ts`.
- `src/data/experience-logos.ts` (new): `logoBySlug`, moved from `sections/experience.astro`.
- `src/content/services/`: delete `ai-agents.json`, `business-cards.json`, `internal-tools.json`, `landing-pages.json`, `mobile-apps.json`, `web-apps.json`. Add `audit.json`, `implementation.json`, `partner.json`.
- `src/content.config.ts`: `services` schema becomes `{ audience, cta, description, duration, order, title }`. This file is outside Scope's list, but the new services content needs it.

**Leads, SEO and head**
- `src/lib/lead.ts`: `projectTypes` holds the four new types.
- `src/lib/seo.ts`: new `knowsAbout`. Offer catalog: `description` is "Co dostajesz", no `serviceType`, `name: "Oferta"`.
- `src/components/layout/base-head.astro`: the home page's default title becomes `siteConfig.title`.

**Page and sections**
- `src/pages/index.astro`: Hero, Trust, Problems, Examples, Services (the offer), Cases, HowIWork, About, Faq, Contact.
- `src/components/mb/sections/hero.astro`: new copy, buttons and status rows.
- `src/components/mb/sections/trust.astro` (new): caption + logo cells (`CellGrid`, `Card size="sm"`), logos grey until hovered, as on today's wall.
- `src/components/mb/sections/problems.astro` (new): `CellGrid columns={2} tag="ul"`, closing line + button.
- `src/components/mb/sections/examples.astro` (new): `CellGrid columns={2}` of `Card` with number, title, text and `.mb-example-tags` badges (the current `services.astro` markup), + outline button.
- `src/components/mb/sections/services.astro`: becomes the offer:
  - `CellGrid columns={3}` with number, title, a `dl` of Dla kogo / Co dostajesz / Czas, and a button per step;
  - the pricing note below;
  - keeps `id="services"` and `.mb-service-num`.
- `src/components/mb/sections/cases.astro` (new): `CellGrid columns={2}` of `caseHighlights`. Each card shows the logo, a kind badge, the company h3 and a `dl` of Problem / Rozwiązanie / Skala, plus `Zobacz realizację` via `caseStudiesByExperience()`. `Wszystkie realizacje` shows when any case study exists. An unknown `experience` id throws, as `case-studies.ts` does.
- `src/components/mb/sections/how-i-work.astro`: new head copy.
- `src/components/mb/sections/about.astro` (new): photo, paragraphs, LinkedIn/GitHub `ContactLink` cells, and `Accordion` > `AccordionItem title="Pełna lista doświadczeń"` with the experience grid moved from `experience.astro`.
- `src/components/mb/sections/experience.astro`: deleted.
- `src/components/mb/sections/faq.astro` (new): `Accordion bordered type="multiple"` with one item per question.
- `src/components/mb/sections/contact.astro`: new head copy.

**Shared components and pages**
- `src/components/mb/contact-form.astro`: the message placeholder.
- `src/components/mb/header.astro`: `primaryNav` read directly. The page-link `inPage`/`aria-current="page"` branch is dropped (no page links remain) and the comment updated.
- `src/components/mb/mobile-sheet.astro`: `primaryNav` read directly.
- `src/components/mb/footer.astro`: the tagline.
- `src/scripts/nav-active.ts`: header comment only (no page links in the menu now).
- `src/pages/realizacje/[slug].astro`: the outline button becomes `Wszystkie realizacje` → `/realizacje/`. Today it is `Wszystkie współprace` → `/#experience`, which no longer exists.
- `src/pages/llms.txt.ts`, `src/pages/llms-full.txt.ts`: the structure above.

**Dev-only proposal pages**
- `src/pages/_ui/proposal/[id].astro`: the same section list as `index.astro`.
- `src/styles/proposals/editorial/proposal.css`: remove the dead `.mb-experience` rules.

**Tests**
- `tests/e2e/home.spec.ts` (new): see How to test.
- `tests/e2e/services-order.spec.ts`: deleted. Its check (offer order matches llms) moves into `home.spec.ts`.
- `tests/e2e/services-grid.spec.ts` → `tests/e2e/examples-grid.spec.ts`: same checks on `#examples`.
- `tests/e2e/contact-form.spec.ts`:
  - `pickType` values become `implementation` / `audit`;
  - the success test sends `audit`;
  - the 400 loop adds `ai`, `webapp`, `landing`, `mobile`, `tool`;
  - new test: each of the four types is saved (200, row type kept);
  - the first-type test checks `Audyt AI` (`audit`) and no overflow, and drops the incidental "wraps onto more than one line".
- `tests/e2e/lead-api.spec.ts`: `LEAD.type` becomes `audit`; expected subject `Nowy lead #1 - Audyt AI`.
- `tests/e2e/case-studies.spec.ts`:
  - menu labels become `Oferta, Realizacje, Proces, O mnie, FAQ` in both builds;
  - entries are read from `#about` after opening `Pełna lista doświadczeń`;
  - `Realizacje` in the menu → `/#cases`, and `Wszystkie realizacje` there → `/realizacje/`;
  - the back link becomes `O mnie` → `/#about`;
  - the no-case-studies build has `Realizacje` → `/#cases`, no `Wszystkie realizacje`, no case links.
- `tests/e2e/ui-catalogue.spec.ts`: the tags selector becomes `#examples .mb-example-tags`.
- `tests/e2e/ui-proposals.spec.ts`: `#experience .mb-card` becomes `#cases .mb-card`.

**Docs**
- `AGENTS.md`: the intro line, the Stack paragraph on case studies and the menu, Wygląd "Sekcje", Struktura (`data/` files, test list).
- `DESIGN.md`: Sections/Cells examples (examples 2 columns, offer 3, cases), the hover line (logo on the trust bar and in the experience list), the Case study / Case study list menu notes, a new **Home** bullet with the section order.
- `README.md`: the line 3 offer, the line 15 menu note, and one line in the lead section: `type` is `audit | implementation | partner | other`; older rows keep `ai | webapp | landing | mobile | tool`.

## Risks
- **Header width.** Five links plus the longer CTA could crowd the desktop header near 881px. The links hide at 880px and below, and the 400px wrap rule stays. `a11y.spec` and `design.spec` (no horizontal overflow at 360px) cover narrow screens. The worker checks 900px by eye in `bun run preview`.
- **Existing hash links.** Links to `/#experience` (old shares, the case study page) would land on the top of the page. The case study page is updated. External old links just open the page, which is harmless.
- **No page link in the menu for the case study list.** On `/realizacje/` no menu item is active any more. This is intended (the list is reached from `#cases`), and DESIGN.md and the specs are updated to match.
- **Old leads.** Old stored types no longer get a label in the email. Only new leads are emailed, and the `?? lead.type` fallback in `api/lead.ts` already covers unknown values. Existing rows are untouched; `leads-db.spec` "keeps rows of an existing table" already proves the store does not care about the value.
- **OG role label.** `AI ENGINEER · PARTNER TECHNOLOGICZNY` at 16px DejaVu Mono with 0.14em spacing runs to about x=1104. That is within the text cell (ends 1114) and the sheet (1154). [INFERENCE] from glyph width 0.602em. `og-image.spec`'s stray-pixel check catches an overflow. The tagline has no comma, so `wrapTagline` keeps one 38-character line within `MAX_LINE_CHARS` 40.
- **Content without JavaScript.** FAQ answers and the experience list sit in closed `<details>`, which open without JS. Their text is in the HTML.
- **Lighthouse.** The longer page adds images: the logos are already on the page today, and `me.jpg` appears a second time, lazy-loaded below the fold. No new scripts.
- **Proposal pages (dev only).** They mirror the new home page. Proposal CSS aimed at old classes is either kept valid (`.mb-service-num`, `.mb-hero-status`, `.mb-step`) or removed (`.mb-experience`).

## How to test
- **Sections and order:** `home.spec.ts` reads `main section[id]` = `top, trust, problems, examples, services, cases, how, about, faq, contact`. It also checks:
  - the header comes before `main`, and the footer and `.eu-funding` after it;
  - the header and mobile-sheet labels are `Oferta, Realizacje, Proces, O mnie, FAQ`, and the CTA is `Umów rozmowę`;
  - the section labels read `Problemy … Kontakt` in order;
  - the copy is Polish and the headings carry no jargon: the review reads the copy against the approved text above.
- **No placeholders:** `home.spec.ts` checks that the page text has no `[`…`]`, no `Wolne terminy`, no `TODO`; the offer shows `Koszt audytu odliczam od wdrożenia.`.
- **Removals:** `home.spec.ts` checks that the page, `llms.txt` and `llms-full.txt` contain none of these strings:
  - `Wizytówki`
  - `Buduję interfejsy`
  - `Inżynier oprogramowania`
  - `Frontend dev w ReX`
  - `React Native · TypeScript · Astro`

  It also checks that the `Wdrożenie` cell names mobile, web and landing pages, and that the offer titles match the llms order (from `services-order.spec`).
- **Form types and `/api/lead`:**
  - `contact-form.spec.ts` shows four radios with the new labels and values; each new type is accepted (200, row saved with that type); `ai`, `webapp`, `landing`, `mobile`, `tool` get 400 and nothing is saved;
  - `lead-api.spec.ts` checks the email subject with the new label;
  - `leads-db.spec.ts` (unchanged) proves an old `webapp` row survives a new save.
- **Meta:** `home.spec.ts` checks:
  - the title is `Wdrożenia AI i automatyzacje dla firm | Kacper Adler`;
  - `meta[name=description]` and `og:description` equal the brief's text;
  - the Person JSON-LD has `jobTitle` `AI Engineer · Partner technologiczny` and its `knowsAbout` contains `Agenci AI` and `Wdrożenia AI w firmach`;
  - `llms.txt` starts with the new header and tagline.

  `og-image.spec.ts` (unchanged) passes on the regenerated image. The worker also opens `/og-default.png` from the build and looks at the label and tagline.
- **EFS+:** `home.spec.ts` checks `aside.eu-funding` is visible after the footer.
- **Case studies:** the updated `case-studies.spec.ts` covers both builds (fixture and none).
- **Whole suite:** `bun run lint`, `bun run check`, `bun run test` (also builds `dist-no-case-studies`) all pass. `a11y.spec` covers the new sections at 1440px and 360px. `design.spec` covers square corners and no overflow. The worker also runs `bun run preview` with JS turned off to confirm the content and links work.

## Open questions
- **Copy approval.** Approve or edit the copy above. The two places that turn facts into a "problem → solution" story most need your eye: the Helpfind and Energia Direct `Problem` and `Rozwiązanie` lines (from `src/content/experience`).
- **FAQ "Co z bezpieczeństwem danych?"** The brief gives only topics. Are these true for you: AI models from providers that sign a DPA, and deployment on the client's own servers? If not, what should the answer say?
- **Form company field.** The brief's form has "firma (opcjonalnie)", but the ticket's Done means and Scope do not. Adding it would touch the leads table and the privacy policy. Leave it out here, or add it in its own ticket?
- **"Wolne terminy: [miesiąc]".** It is left out, and no ticket in Out covers it. Should it get a ticket?
- **Claude Code / Codex training.** `spec/vision.md` lists it as part of the offer; the brief drops it. The plan follows the brief. Should the vision be updated to match?
