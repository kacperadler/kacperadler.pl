# kacperadler.pl

Strona Kacpra Adlera - AI Engineer · Partner technologiczny: wdrożenia AI i automatyzacje dla firm (~5 lat w oprogramowaniu, React/TS). Produkcyjnie pod `kacperadler.pl`, statyczny build Astro serwowany przez nginx na Dokploy, plus jedna trasa API na Node (`/api/lead`).

- **Wizja i to, co ma zostać prawdą: `spec/vision.md`.**
- **Kryteria review, styleguide, audyt: `.agents/harness/criteria/`.**
- **Jednostka pracy to ticket (`spec/features/<id>/ticket.md`)** - jego Scope i Decisions wyznaczają granice zmiany.
- **Design system: `DESIGN.md`** - frontmatter z tokenami + proza z rationale, bazowa lektura przy dotykaniu wyglądu.

Gdy dokumentacja i kod się rozjeżdżają, rację ma kod.

## Stack

- **Astro 7** (TypeScript strict, output static, `<ClientRouter />` z `astro:transitions`; `compressHTML: true` - HTML-aware whitespace z Astro 6, nie domyślne `'jsx'`). Adapter `@astrojs/node` (`standalone`, `session: false`) tylko dla `src/pages/api/lead.ts` (`prerender = false`) - jedyny wyjątek od statycznego buildu; build daje strony w `dist/client/` i serwer w `dist/server/`.
- **Vanilla CSS** + scoped `<style>` w `.astro`. **Dark-only**: `color-scheme: dark` na `:root` w `src/styles/tokens.css`, jedna ciemna wartość na kolor (bez par `light-dark()`). Jeden akcent (navy). **Bez Tailwinda** - design system na customowych tokenach (zob. `tokens.css` + `DESIGN.md`).
- **Ultracite (Biome)** - lint + format dla TS/JS/JSON/CSS i `.astro` (`html.experimentalFullSupportEnabled` w `biome.jsonc`: Biome formatuje cały plik, razem z markupem)
- **Content Collections** (Zod z `astro/zod`, `src/content.config.ts`) dla services / experience (JSON) oraz caseStudies / blog (MDX)
- **Case studies** (`@astrojs/mdx`) - `src/content/case-studies/<id>.mdx`, strona `/realizacje/<slug>/` (`src/pages/realizacje/[slug].astro`), lista `/realizacje/` (`src/pages/realizacje/[...index].astro`) - budowana tylko, gdy istnieje choć jeden case study, i wtedy linkowana przyciskiem `Wszystkie realizacje` z sekcji `#cases` strony głównej. Menu (`primaryNav` w `src/data/navigation.ts`) to stała lista sekcji strony głównej, więc nie zależy od case studies (`Realizacje` → `/#cases`). Opcjonalne pole `experience` linkuje wpis w akordeonie "Pełne doświadczenie" (sekcja `#about`) i kartę w `#cases` (jeden case study na wpis, nieistniejący wpis wywala build). Build e2e (`E2E_FIXTURES=1`, ustawiane w `playwright.config.ts`) czyta `tests/fixtures/case-studies`, dopóki `src/content/case-studies` nie ma żadnego `.mdx`; ten sam run buduje też `dist-no-case-studies/` z `E2E_FIXTURES=none` (pusty `tests/fixtures/no-case-studies`) dla stanu bez case studies.
- **Markdown pages** dla treści statycznej (polityka prywatności, regulamin) - `src/pages/*.md` z `layout: "@/layouts/legal-layout.astro"`
- **Ikony**: `astro-icon` + `@iconify-json/lucide` (`<Icon name="lucide:..." />`), nie inline SVG.
- **Fonty**: self-hosted Geist + Geist Mono (variable woff2 w `public/fonts`, `font-display: swap`, preload w `base-head.astro`) - bez zewnętrznych CDN.
- **SEO**: `@astrojs/sitemap` + `public/robots.txt`; JSON-LD (`Person`, `WebSite`, `ProfessionalService`) z `src/lib/seo.ts` w `base-head.astro`; OG image (1200×630) generowany w buildzie przez sharp z SVG (`src/pages/og-default.png.ts`).

### Integracje runtime

- **Formularz kontaktowy** → `POST /api/lead` (`src/pages/api/lead.ts`), JSON `{ email, types, message, website }` - `types` to lista jednego lub kilku typów projektu (checkboxy `choice.astro`), w kolumnie `type` tabeli zapisana po przecinku w kolejności `projectTypes` (`audit,implementation`). Reguły pól w `src/lib/lead.ts` (`checkLead`, `projectTypes`, `orderedTypes`) - te same w przeglądarce i na serwerze. Honeypot `website` → 200 bez zapisu, złe pola → 400, zapis do SQLite (`src/lib/leads-db.ts`, `node:sqlite`, plik z `LEADS_DB_PATH`, w obrazie `/data/leads.sqlite` na wolumenie Dokploy) albo 500. Po zapisie mail przez API Resend (`src/lib/send-email.ts`: jedna funkcja, wszystko w argumentach, nie czyta env i nie wie o leadach) z `RESEND_API_KEY`, `LEAD_NOTIFY_FROM`, `LEAD_NOTIFY_TO`; mail i logi niosą tylko numer leada i typ, bez danych odwiedzającego. Nieudany albo nieskonfigurowany mail to tylko log - lead zostaje, odwiedzający widzi sukces. Trasa czyta `process.env` przy każdym żądaniu, nigdy `import.meta.env` (Astro wkompilowałby wartość w build). Szczegóły i kroki w Dokploy: `README.md`.
- **Analytics** → Umami self-hosted (`siteConfig.analytics.umamiUrl`). Tylko PROD (`import.meta.env.PROD`): inline script w `base-head.astro` wstrzykuje `<script defer>` Umami po `requestIdleCallback` (fallback: `load` + 1.5s), z `data-do-not-track="true"`; `astro:page-load` woła `window.umami?.track()` dla nawigacji ClientRoutera. Custom events: `form-submit { type }`, `form-error { type }` (`type` to wybrane typy po przecinku), `form-honeypot`.

## Konwencje

- **Pliki: kebab-case** (`contact-form.astro`, `nav-active.ts`). Importy w PascalCase.
- **Symbole w plikach**: camelCase dla zmiennych/funkcji, PascalCase dla typów.
- **Path aliasy**: `@/components`, `@/layouts`, `@/lib`, `@/scripts`, `@/styles`, `@/data`, `@/content`, `@/assets`.
- **Active section**: IntersectionObserver, **nie** scroll listener.
- **A11y baseline**: skip link (`.skip-link` → `#top`), globalny `:focus-visible` outline, `aria-current="location"` na aktywnym linku nav, `aria-busy` na submit i `aria-live="polite"` na success formularza, nagłówki liniowo h1 → h2 → h3. Mobile sheet to modal: reszta `<body>` dostaje `inert`, Tab zawija się w sheecie, Esc / X / link zamykają i oddają fokus triggerowi, scroll body zablokowany.
- **Email**: zwykły `mailto:` z `siteConfig.email`, bez obfuskacji.
- **Form submission**: state machine na wrapperze (`data-contact-wrap[data-state]`) - `idle | submitting | error-validation | error-submit | success`. Submit handler w **capture phase** (`addEventListener('submit', ..., true)`) inaczej ClientRouter rezetuje state przed `setTimeout`.
- **`prefers-reduced-motion`** szanowany w każdej animowanej tranzycji.
- **Tracking custom events**: `window.umami?.track(name, data)` - używaj optional chaining, w dev `umami` nie istnieje.
- **Copy po polsku**, w tonie istniejących sekcji. Zamiast em-dasha piszemy myślnik ` - `.

## Don't

- Nie dodawaj Tailwinda - kolizja z CSS variables.
- Nie przywracaj theming machinery (`data-theme`, przełącznik motywu, inline theme script, jasne wartości) - strona jest dark-only.
- Nie używaj scroll listenera dla active section - IntersectionObserver.
- Nie dodawaj em-dashy (U+2014) nigdzie: copy, docs, komentarze, generowany tekst.
- Nie commituj konfiguracji edytorów ani agentów (`.claude/`, `.vscode/`, `.zed/`, `.idea/` są w `.gitignore`).
- Nie wychodź poza Scope ticketu bez konsultacji.
- Nie zmieniaj tokenów, brand-marka favicon ani palety bez aktualizacji `DESIGN.md`.
- Nie zaokrąglaj rogów (jedyny wyjątek: okrągłe radio (`radio.astro`)), nie dodawaj szkła (`backdrop-filter`), gradientów, dot-gridu ani tła w ruchu - minimal brutalism: kwadratowe komórki w 1px liniach na pełnym podłożu.
- Nie używaj `translateY` (ani innego przesunięcia) na hover - stan pokazujemy wypełnieniem, linią i twardym cieniem. Wyjątek: lico przycisku z białą warstwą unosi się o 1px w stronę kursora (warstwa 2px pod spodem stoi w miejscu), a na press kładzie się na warstwę.
- Nie dodawaj always-on animacji; każda zmiana stanu to `--mb-snap` (0.12s linear), poza dwoma przejazdami w `--mb-slide` (0.3s ease-out): etykieta i spinner przycisku przy loading oraz górna linia karty. Jedyny ruch za przewijaniem to wypełnianie szyny procesu (`step-marker.astro`).
- Nie dodawaj cookies, zewnętrznych skryptów ani trackerów.

## Komendy

Package manager: **bun** (Node 22.13+ - `node:sqlite`; `bun` musi być w `PATH`, bo pre-commit hook woła `bunx`).

```bash
bun install            # install deps
bun dev                # dev server (Umami script NIE jest renderowany); katalog komponentów pod /ui, propozycje designu pod /ui/proposal (tylko dev)
bun run build          # production build → dist/client/ (strony) + dist/server/ (Node dla /api/lead)
bun run preview        # preview prod build (port domyślny 4321; testy biorą 4329 albo następny wolny i rezerwują go plikiem w `$TMPDIR/kacperadler-e2e-ports`, więc runy z dwóch worktree naraz się nie zderzą)
bun run check          # astro check (type-check .astro)
bun run lint           # ultracite check (Biome): lint + format check, też .astro (jak w CI)
bun run format         # ultracite fix (Biome): lint fix + format
bun run test:e2e       # playwright (chromium, headless); sam buduje dist/ przed preview
bun run test:e2e:ui    # playwright UI mode
```

Pre-commit hook: `lint-staged` (ultracite fix dla TS/JS/JSON/CSS/`.astro`) + `astro check`. CI (`.github/workflows/ci.yml`): lint + format check → check → build, potem job e2e.

## Hosting

**Dokploy** (self-hosted, własny serwer). Cloudflare Pages nie jest rozważany.

- Build type: **Dockerfile** w repo (multi-stage `oven/bun:1.4.3-alpine` build → `deps` z produkcyjnymi `node_modules` → `nginx:1.30-alpine` + `nodejs`)
- Jeden kontener, dwa procesy: `docker-start.sh` odpala Node (`dist/server/entry.mjs` na `127.0.0.1:4321`) i nginx, przekazuje SIGTERM obu i kończy kontener, gdy któryś padnie. Wolumen Dokploy na `/data` (`LEADS_DB_PATH=/data/leads.sqlite` ustawia obraz) - bez niego leady giną przy redeployu.
- `nginx.conf` w repo: `root /app/dist/client`, `location /api/` → `proxy_pass` do Node, gzip, security headers (X-Frame-Options/X-Content-Type-Options/Referrer-Policy/Permissions-Policy), cache rules (immutable dla `/_astro/` + fontów, 30d dla obrazków, `no-store` dla `/api/`, must-revalidate dla HTML). Headers przez `map`, NIE per-`location` - `add_header` nie dziedziczy. Bez SPA fallbacku: `try_files $uri $uri/ $uri.html`, a nieznany URI dostaje `error_page 404 /404.html`. Pole „Strona” paginacji (`jump` w `pagination.astro`) wysyła `<lista>/?strona=<n>`, a prerenderowana strona nie widzi query: `map $pagination_jump` przekierowuje (302) na `<lista>/<n>/`, stronę 1 na `<lista>/` - ścieżki `paginate()`, więc `jump` to pierwsza strona listy. Tylko dla list wpisanych w mapę (`/blog/`, `/realizacje/`, fixture e2e `/lista/`) i ich numerowanych stron; nowa lista z paginacją trafia do mapy, a każda inna ścieżka (np. `/?strona=3`, `/api/`) zostaje bez przekierowania. `absolute_redirect off`: `Location` to sama ścieżka, bo absolutny adres za Traefikiem byłby `http://`.
- Limit `/api/` w `nginx.conf`: `limit_req` 5/min na IP klienta plus burst 4 bez opóźnienia (pięć postów naraz przechodzi, szósty → 429, formularz pokazuje `error-submit`). IP klienta to ostatni adres z `X-Forwarded-For`, ale tylko gdy żądanie przyszło z `10.0.0.0/8` (`set_real_ip_from`: `dokploy-network`, przez którą wchodzi Traefik); z innego adresu nagłówek jest ignorowany. Spec `lead-rate-limit.spec.ts` stawia obraz nginx z tym configiem w Dockerze.
- Container port: **80**, Traefik-routed przez Dokploy z Let's Encrypt cert
- **Deploy = push do `main`.** Dokploy sam buduje i wdraża na produkcję każdy push do `origin/main`, więc push to wydanie. Bez słowa człowieka nie pushuj `main`; gałęzie jobów (`h/...`) nie wdrażają się.
- W build stage `apk add fontconfig ttf-dejavu` - librsvg w `og-default.png.ts` potrzebuje fontu mono z polskimi diakrytykami (Geist bierze z `src/assets/fonts`), inaczej tofu boxes
- Lokalny test (obowiązkowy przy zmianie `Dockerfile`, `nginx.conf`, `docker-start.sh` lub `og-default.png.ts`): `docker build -t kacperadler-pl-test . && docker run --rm -p 8089:80 -v ka-leads-test:/data kacperadler-pl-test`

## Wygląd

Source of truth wizualny: `DESIGN.md`. Stan w kodzie:

- **Minimal brutalism** - jedyny design strony. Komponenty w `src/components/mb/` (warianty i rozmiary za shadcn/ui, Astro + scoped CSS, bez React/Tailwinda), sekcje strony głównej w `mb/sections/`, rama strony w `page-frame.astro` (włosy na krawędziach kontenera, skip link, `header.astro`, `footer.astro`, `layout/eu-funding.astro`, `mobile-sheet.astro` jako rodzeństwo ramy - `mobile-sheet.ts` daje ramie `inert`). Tokeny `--mb-*` (`--mb-rule`, `--mb-hair`, `--mb-shift`, `--mb-snap`, `--mb-slide`, `--mb-display`) siedzą w `src/styles/tokens.css` obok palety. Używaj tych komponentów przed pisaniem nowego.
- Layout: `src/layouts/base-layout.astro` - `BaseHead`, `<ClientRouter />`, `PageFrame` wokół strony i skrypty `contact-form.ts`, `mobile-sheet.ts`, `nav-active.ts`. `legal-layout.astro` owija `BaseLayout` dla stron prawnych (`SectionHead` z h1 + `Prose`). Prefiks `--v2-*` w tokenach to pozostałość po wcześniejszym redesignie.
- **Komórki** - `card.astro` to komórka: `--v2-bg` w 1px linii `--mb-rule`; hover rozświetla ją od środka (`--v2-panel-elevated` pod 3px niebieską linią u góry) i niczego nie przesuwa. Linia idzie za myszą (skrypt w `card.astro`, `data-bar-in` / `data-bar-out`): wjeżdża od boku bliższego wejściu kursora i wyjeżdża w stronę bliższą wyjściu; bez myszy (dotyk, klawiatura, bez JS) wjeżdża z lewej i wyjeżdża w prawo. `cell-grid.astro` skleja komórki w jedną tabelę (sąsiednie dzielą linię). `section-head.astro` otwiera każdą sekcję: linia, numerowana etykieta mono („01 / Usługi”, licznik `mb-section` z ramy), nagłówek z lewej, lead z prawej.
- **Twardy cień** (`--mb-shift`, bez rozmycia) tylko na tym, na czym odwiedzający działa: pod przyciskami `default`, `secondary`, `outline`, `destructive` to nieruchoma biała warstwa (hover unosi lico, press kładzie je na warstwę; `ghost` i `link` bez warstwy), pole w focusie wysuwa niebieski cień, arkusz formularza kontaktowego dostaje niebieski cień dopiero po wysłaniu - focus pola świeci tylko pole, nie arkusz. Podczas wysyłki `contact-form.ts` wyłącza wszystkie pola, wybór typu i przycisk. Header CTA (`data-nav-cta`) dostaje `.active` z `nav-active.ts` na #contact.
- **Katalog komponentów** - `src/pages/_ui/catalogue.astro` (komponent), strona `src/pages/_ui/index.astro`, routowana na `/ui` tylko w `astro dev` (integracja w `astro.config.mjs`; build jej nie zna). Pokazuje każdy komponent z `mb/` we wszystkich wariantach i stanach, w tym formularz w każdym `data-state`. Stany wymuszone przez `[data-state="hover" | "focus-visible" | "focus"]`, `.active`, `disabled` - selektory siedzą w komponentach obok prawdziwych `:hover` / `:focus`, więc nowy komponent albo stan dopisujesz w obu miejscach. Własny dokument (`BaseHead` + `page-frame.astro`, nie `BaseLayout`), ładuje tylko `mobile-sheet.ts` - nigdy `contact-form.ts`, który wysyła formularz na `/api/lead` (zapis leada i mail).
- **Propozycje designu** - `/ui/proposal` (lista) i `/ui/proposal/<id>` (kopia strony głównej + cały katalog z nałożoną propozycją, pasek przełączania u góry), tylko w `astro dev`, strony w `src/pages/_ui/proposal/`. Propozycja to sam folder `src/styles/proposals/<id>/`: `proposal.css` (reguły pod `[data-proposal="<id>"]`, tokeny na `html[data-proposal="<id>"]`, fonty woff2 z licencją obok, przez względny `url()`) + `meta.json` (`name`, jednolinijkowy `description`, `references: [{ label, url }]`), czytane przez `src/lib/proposals.ts`. `[id].astro` to własny dokument jak `/ui` (bez `contact-form.ts`) z `data-proposal` na `<html>`; CSS propozycji jest inline w `<body>`, po stylach komponentów, więc wygrywa remis specyficzności. Kolory zostają z `tokens.css`. `baseline` to obecny design (minimal brutalism) bez nadpisań - wzór do skopiowania.
- Sekcje (`src/components/mb/sections/`, kolejność z briefu KA0075 w `src/pages/index.astro`): hero (nagłówek, podtytuł i dwa przyciski obok karty "W liczbach": sam podpis mono bez badge, trzy równe wiersze - duża liczba nad opisem - i przycisk do `#cases`; bez zdjęcia. Obie kolumny na jednej siatce: równe wysokości, nagłówek na linii podpisu karty, przyciski na linii przycisku karty; poniżej 880px jedna kolumna i przyciski na całą szerokość), trust (pasek logo bez nagłówka i numeru; logo w wysokości z `logoFitBySlug` w `src/data/experience-logos.ts`, sam znak bez nazwy dostaje nazwę firmy tekstem obok), problems (sześć komórek z `problems` w `src/data/home.ts`: krótki nagłówek h3, jedno zdanie i pod linią efekt po strzałce, bez tagów technologii; 3 w rzędzie na desktopie, 2 między 560 a 880px, 1 na telefonie; komórki rzędu na wspólnym subgridzie, więc mają równą wysokość, a linie efektów biegną w jednej linii; pod nimi zdanie i przycisk; dawna sekcja examples została w nią wcielona), services (oferta: trzy kroki z kolekcji `services` w tabeli 3 kolumn, pod nimi komórka na całą szerokość "Aplikacje szyte na miarę" (`customApps`), wiersze komórek na wspólnym subgridzie, opcjonalne pole `note` pod czasem kroku, `default` tylko na pierwszym przycisku, reszta `outline`; wycena w lede nagłówka), cases (problem / rozwiązanie / efekt z `caseHighlights`, cztery projekty od najnowszego; firma raz - h3 to jej logo (dwa przy projekcie dla dwóch firm, pole `experiences`), alt to nazwa, badge obok; komórki rzędu na wspólnym subgridzie: równa wysokość, etykiety w jednej linii; link `case` do realizacji, `Wszystkie realizacje`), how-i-work (kroki przy 1px szynie z kwadratowymi znacznikami `step-marker.astro`; na desktopie szyna na środku, kroki na przemian z lewej i z prawej, schodkowo (każda karta zaczyna się mniej więcej w połowie poprzedniej, siatka z krokami na dwóch wierszach), każda połączona ze swoim znacznikiem krótką poziomą linią (1px ink, 2px niebieska razem ze znacznikiem); czas trwania w nagłówku karty obok tytułu; poniżej 880px jedna kolumna, szyna z lewej, bez łączników. Szyna wypełnia się na niebiesko przy przewijaniu (CSS `animation-timeline`, bez skryptu), znacznik robi się niebieski, gdy wypełnienie dojdzie do jego środka; przy `prefers-reduced-motion` albo bez wsparcia przeglądarki wszystko od razu wypełnione; pod krokami przycisk do formularza), about (zdjęcie, tekst, LinkedIn / GitHub i zamknięty akordeon "Pełne doświadczenie" z wpisami `experience`, opcjonalne pole `badge` dla zleceń; tabela wpisów bez własnej ramy, linie tylko między komórkami, hover bez panelu - sama niebieska linia i kolor logo), faq (dwa akordeony `bordered` obok siebie w jednej tabeli na całą szerokość, pierwsza połowa pytań po lewej; poniżej 880px jedna kolumna), contact (formularz + linki email / LinkedIn jako `contact-link.astro` pod nim, ostatni wiersz tego samego arkusza na całą szerokość; formularz i karta sukcesu leżą w jednej komórce grida, więc arkusz nie zmienia wysokości po wysłaniu; od 720px szerokości arkusza - container query - email i typ projektu obok siebie nad wiadomością). Copy wspólne ze stroną i `llms-full.txt` siedzi w `src/data/home.ts`, logotypy w `src/data/experience-logos.ts`. OG image (`src/pages/og-default.png.ts`) to arkusz minimal brutalism na pełnym `base`: zdjęcie w kwadratowej ramie 1px `ink`, obok komórka-tabela z kwadratowym znakiem, ciężkim nagłówkiem w Geist ExtraBold (fontconfig nie czyta woff2, więc generator rejestruje `src/assets/fonts/Geist-Variable.ttf`; etykiety mono to DejaVu Sans Mono), taglinem i adresem (`tests/e2e/og-image.spec.ts`). Favicon (`public/favicon.svg` + `favicon.ico` 16/32/48) to ten sam kwadratowy znak co `brand.astro` (`tests/e2e/favicon.spec.ts`).

## Struktura

```
src/
├── components/{layout,mb}/   # kebab-case; layout/ = base-head, eu-funding; mb/ = komponenty minimal brutalism + mb/sections/
├── content/{services,experience}/  # JSON
├── content/{case-studies,blog}/    # MDX; blog pusty
├── content.config.ts      # Zod schemas collections
├── data/                  # site-config, navigation, process, home (copy wspólne z llms-full), experience-logos
├── layouts/               # base-layout, legal-layout
├── pages/                 # index, 404, *.md (legal), realizacje/{[slug],[...index]}, api/lead.ts (jedyna trasa na żądanie), og-default.png.ts, llms.txt.ts, llms-full.txt.ts
├── scripts/               # vanilla TS: contact-form, mobile-sheet, nav-active
├── styles/                # tokens.css, global.css, proposals/<id>/ (tylko /ui/proposal)
├── lib/                   # seo, case-studies, proposals, lead (reguły formularza), leads-db (SQLite), send-email (Resend)
└── assets/                # me.jpg (OG), fonts/ (Geist TTF + OFL dla OG), experience/ logotypy, logotyp_fundusze_eu.png

tests/e2e/       # Playwright specs (a11y, case-studies, check-input, contact-form, design, e2e-ports, favicon, lead-api, lead-rate-limit (nginx w Dockerze), leads-db, mobile-sheet, nav-active, og-image, pagination-jump, send-email, home, skip-link; ui-catalogue, ui-proposals i dev-no-reload na dev serverze, który w runie e2e nie obserwuje plików (`E2E_DEV_NO_WATCH=1`), więc commit albo `astro check` w trakcie runu nie przeładowuje stron; check-input pilnuje, że `astro check` nie czyta folderów z runu e2e; e2e-ports - że dwa runy naraz dostają różne porty; pagination-jump serwuje build e2e (`dist/client`) przez `nginx.conf` w obrazie nginx z `Dockerfile`, więc wymaga Dockera)
tests/fixtures/  # dla buildów e2e: case studies (przykładowy i pusty) i `pagination/list.astro` - 12 stron pod `/lista/` (tylko `E2E_FIXTURES=1`)
spec/            # vision.md + tickets (spec/features/<id>/)
.agents/harness/ # kryteria review / audit / retro + styleguide
Dockerfile, nginx.conf, docker-start.sh  # produkcja na Dokploy
DESIGN.md        # design system
AGENTS.md        # ten plik
```
