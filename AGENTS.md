# kacperadler.pl

Portfolio Kacpra Adlera - Inżynier oprogramowania (~5 lat, React/TS). Produkcyjnie pod `kacperadler.pl`, statyczny build Astro serwowany przez nginx na Dokploy.

- **Wizja i to, co ma zostać prawdą: `spec/vision.md`.**
- **Kryteria review, styleguide, audyt: `.agents/harness/criteria/`.**
- **Jednostka pracy to ticket (`spec/features/<id>/ticket.md`)** - jego Scope i Decisions wyznaczają granice zmiany.
- **Design system: `DESIGN.md`** - frontmatter z tokenami + proza z rationale, bazowa lektura przy dotykaniu wyglądu.

Gdy dokumentacja i kod się rozjeżdżają, rację ma kod.

## Stack

- **Astro 7** (TypeScript strict, output static, `<ClientRouter />` z `astro:transitions`; `compressHTML: true` - HTML-aware whitespace z Astro 6, nie domyślne `'jsx'`)
- **Vanilla CSS** + scoped `<style>` w `.astro`. **Dark-only**: `color-scheme: dark` na `:root` w `src/styles/tokens.css`, jedna ciemna wartość na kolor (bez par `light-dark()`). Jeden akcent (navy). **Bez Tailwinda** - design system na customowych tokenach (zob. `tokens.css` + `DESIGN.md`).
- **Ultracite (Biome)** - lint + format dla TS/JS/JSON/CSS i `.astro` (`html.experimentalFullSupportEnabled` w `biome.jsonc`: Biome formatuje cały plik, razem z markupem)
- **Content Collections** (Zod z `astro/zod`, `src/content.config.ts`) dla services / experience (JSON) oraz caseStudies / blog (MDX)
- **Case studies** (`@astrojs/mdx`) - `src/content/case-studies/<id>.mdx`, strona `/realizacje/<slug>/` (`src/pages/realizacje/[slug].astro`), lista `/realizacje/` (`src/pages/realizacje/[...index].astro`) i pozycja "Realizacje" w menu (`primaryNav()` w `src/data/navigation.ts`) - obie budowane tylko, gdy istnieje choć jeden case study, opcjonalne pole `experience` linkuje wpis w "Z kim pracowałem" (jeden case study na wpis, nieistniejący wpis wywala build). Build e2e (`E2E_FIXTURES=1`, ustawiane w `playwright.config.ts`) czyta `tests/fixtures/case-studies`, dopóki `src/content/case-studies` nie ma żadnego `.mdx`; ten sam run buduje też `dist-no-case-studies/` z `E2E_FIXTURES=none` (pusty `tests/fixtures/no-case-studies`) dla stanu bez case studies.
- **Markdown pages** dla treści statycznej (polityka prywatności, regulamin) - `src/pages/*.md` z `layout: "@/layouts/legal-layout.astro"`
- **Ikony**: `astro-icon` + `@iconify-json/lucide` (`<Icon name="lucide:..." />`), nie inline SVG.
- **Fonty**: self-hosted Geist + Geist Mono (variable woff2 w `public/fonts`, `font-display: swap`, preload w `base-head.astro`) - bez zewnętrznych CDN.
- **SEO**: `@astrojs/sitemap` + `public/robots.txt`; JSON-LD (`Person`, `WebSite`, `ProfessionalService`) z `src/lib/seo.ts` w `base-head.astro`; OG image (1200×630) generowany w buildzie przez sharp z SVG (`src/pages/og-default.png.ts`).

### Integracje runtime

- **Formularz kontaktowy** → NocoDB self-hosted (public Shared Form view, `multipart/form-data` z pojedynczym polem `data` zawierającym JSON; UUID hardcoded w `siteConfig.nocodbFormUrl`, NIE token). Honeypot field + walidacja klient-side, server-side validation po stronie NocoDB. Nigdy nie zmieniaj na JSON body - endpoint zwraca generic error. Kierunek z `spec/vision.md`: NocoDB zastąpi SQLite na serwerze Dokploy przez API route Astro (`prerender = false`, adapter Node) - to jedyny wyjątek od statycznego buildu.
- **Analytics** → Umami self-hosted (`siteConfig.analytics.umamiUrl`). Tylko PROD (`import.meta.env.PROD`): inline script w `base-head.astro` wstrzykuje `<script defer>` Umami po `requestIdleCallback` (fallback: `load` + 1.5s), z `data-do-not-track="true"`; `astro:page-load` woła `window.umami?.track()` dla nawigacji ClientRoutera. Custom events: `form-submit { type }`, `form-error { type }`, `form-honeypot`.

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
- Nie wysyłaj do NocoDB form view innego payloadu niż `FormData` z polem `data` zawierającym JSON-string.
- Nie zmieniaj tokenów, brand-marka favicon ani palety bez aktualizacji `DESIGN.md`.
- Nie zaokrąglaj rogów, nie dodawaj szkła (`backdrop-filter`), gradientów, dot-gridu ani tła w ruchu - minimal brutalism: kwadratowe komórki w 1px liniach na pełnym podłożu.
- Nie używaj `translateY` (ani innego przesunięcia) na hover - stan pokazujemy wypełnieniem, linią i twardym cieniem.
- Nie dodawaj always-on animacji; każda zmiana stanu to `--mb-snap` (0.12s linear).
- Nie dodawaj cookies, zewnętrznych skryptów ani trackerów.

## Komendy

Package manager: **bun** (Node 22+; `bun` musi być w `PATH`, bo pre-commit hook woła `bunx`).

```bash
bun install            # install deps
bun dev                # dev server (Umami script NIE jest renderowany); katalog komponentów pod /ui, propozycje designu pod /ui/proposal (tylko dev)
bun run build          # production build → dist/
bun run preview        # preview prod build (port domyślny 4321; testy używają 4329)
bun run check          # astro check (type-check .astro)
bun run lint           # ultracite check (Biome): lint + format check, też .astro (jak w CI)
bun run format         # ultracite fix (Biome): lint fix + format
bun run test:e2e       # playwright (chromium, headless); sam buduje dist/ przed preview
bun run test:e2e:ui    # playwright UI mode
```

Pre-commit hook: `lint-staged` (ultracite fix dla TS/JS/JSON/CSS/`.astro`) + `astro check`. CI (`.github/workflows/ci.yml`): lint + format check → check → build, potem job e2e.

## Hosting

**Dokploy** (self-hosted, własny serwer). Cloudflare Pages nie jest rozważany.

- Build type: **Dockerfile** w repo (multi-stage `oven/bun:1.4.3-alpine` → `nginx:1.30-alpine`)
- `nginx.conf` w repo: gzip, security headers (X-Frame-Options/X-Content-Type-Options/Referrer-Policy/Permissions-Policy), cache rules (immutable dla `/_astro/` + fontów, 30d dla obrazków, must-revalidate dla HTML). Headers przez `map`, NIE per-`location` - `add_header` nie dziedziczy. Bez SPA fallbacku: `try_files $uri $uri/ $uri.html`, a nieznany URI dostaje `error_page 404 /404.html`.
- Container port: **80**, Traefik-routed przez Dokploy z Let's Encrypt cert
- W build stage `apk add fontconfig ttf-dejavu` - librsvg w `og-default.png.ts` potrzebuje fontu z polskimi diakrytykami, inaczej tofu boxes
- Lokalny test (obowiązkowy przy zmianie `Dockerfile`, `nginx.conf` lub `og-default.png.ts`): `docker build -t kacperadler-pl-test . && docker run --rm -p 8089:80 kacperadler-pl-test`

## Wygląd

Source of truth wizualny: `DESIGN.md`. Stan w kodzie:

- **Minimal brutalism** - jedyny design strony. Komponenty w `src/components/mb/` (warianty i rozmiary za shadcn/ui, Astro + scoped CSS, bez React/Tailwinda), sekcje strony głównej w `mb/sections/`, rama strony w `page-frame.astro` (włosy na krawędziach kontenera, skip link, `header.astro`, `footer.astro`, `layout/eu-funding.astro`, `mobile-sheet.astro` jako rodzeństwo ramy - `mobile-sheet.ts` daje ramie `inert`). Tokeny `--mb-*` (`--mb-rule`, `--mb-hair`, `--mb-shift`, `--mb-snap`, `--mb-display`) siedzą w `src/styles/tokens.css` obok palety. Używaj tych komponentów przed pisaniem nowego.
- Layout: `src/layouts/base-layout.astro` - `BaseHead`, `<ClientRouter />`, `PageFrame` wokół strony i skrypty `contact-form.ts`, `mobile-sheet.ts`, `nav-active.ts`. `legal-layout.astro` owija `BaseLayout` dla stron prawnych (`SectionHead` z h1 + `Prose`). Prefiks `--v2-*` w tokenach to pozostałość po wcześniejszym redesignie.
- **Komórki** - `card.astro` to komórka: `--v2-bg` w 1px linii `--mb-rule`; hover rozświetla ją od środka (`--v2-panel-elevated` pod 3px niebieską linią u góry) i niczego nie przesuwa. `cell-grid.astro` skleja komórki w jedną tabelę (sąsiednie dzielą linię). `section-head.astro` otwiera każdą sekcję: linia, numerowana etykieta mono („01 / Usługi”, licznik `mb-section` z ramy), nagłówek z lewej, lead z prawej.
- **Twardy cień** (`--mb-shift`, bez rozmycia) tylko na tym, na czym odwiedzający działa: przycisk `default` i arkusz formularza kontaktowego, gdy pisze w email albo wiadomość (i po wysłaniu); radio „Typ projektu” celowo nie zapala cienia. Header CTA (`data-nav-cta`) dostaje `.active` z `nav-active.ts` na #contact.
- **Katalog komponentów** - `src/pages/_ui/catalogue.astro` (komponent), strona `src/pages/_ui/index.astro`, routowana na `/ui` tylko w `astro dev` (integracja w `astro.config.mjs`; build jej nie zna). Pokazuje każdy komponent z `mb/` we wszystkich wariantach i stanach, w tym formularz w każdym `data-state`. Stany wymuszone przez `[data-state="hover" | "focus-visible" | "focus"]`, `.active`, `disabled` - selektory siedzą w komponentach obok prawdziwych `:hover` / `:focus`, więc nowy komponent albo stan dopisujesz w obu miejscach. Własny dokument (`BaseHead` + `page-frame.astro`, nie `BaseLayout`), ładuje tylko `mobile-sheet.ts` - nigdy `contact-form.ts`, który wysyła do produkcyjnego NocoDB.
- **Propozycje designu** - `/ui/proposal` (lista) i `/ui/proposal/<id>` (kopia strony głównej + cały katalog z nałożoną propozycją, pasek przełączania u góry), tylko w `astro dev`, strony w `src/pages/_ui/proposal/`. Propozycja to sam folder `src/styles/proposals/<id>/`: `proposal.css` (reguły pod `[data-proposal="<id>"]`, tokeny na `html[data-proposal="<id>"]`, fonty woff2 z licencją obok, przez względny `url()`) + `meta.json` (`name`, jednolinijkowy `description`, `references: [{ label, url }]`), czytane przez `src/lib/proposals.ts`. `[id].astro` to własny dokument jak `/ui` (bez `contact-form.ts`) z `data-proposal` na `<html>`; CSS propozycji jest inline w `<body>`, po stylach komponentów, więc wygrywa remis specyficzności. Kolory zostają z `tokens.css`. `baseline` to obecny design (minimal brutalism) bez nadpisań - wzór do skopiowania.
- Sekcje (`src/components/mb/sections/`): hero (nagłówek + status card jako tabela wierszy), services (tabela 2 kolumn z numerem), how-i-work (kolumna kroków przy 1px szynie z kwadratowymi znacznikami, badge `fillOnCellHover`), experience (ściana logo jako tabela komórek, opcjonalne pole `badge` dla zleceń, link `case` do realizacji), contact (linki email / LinkedIn + formularz w jednym arkuszu). OG image (`src/pages/og-default.png.ts`) w ciemnej palecie.

## Struktura

```
src/
├── components/{layout,mb}/   # kebab-case; layout/ = base-head, eu-funding; mb/ = komponenty minimal brutalism + mb/sections/
├── content/{services,experience}/  # JSON
├── content/{case-studies,blog}/    # MDX; blog pusty
├── content.config.ts      # Zod schemas collections
├── data/                  # site-config, navigation, process
├── layouts/               # base-layout, legal-layout
├── pages/                 # index, 404, *.md (legal), realizacje/{[slug],[...index]}, og-default.png.ts, llms.txt.ts, llms-full.txt.ts
├── scripts/               # vanilla TS: contact-form, mobile-sheet, nav-active
├── styles/                # tokens.css, global.css, proposals/<id>/ (tylko /ui/proposal)
├── lib/                   # seo, case-studies, proposals
└── assets/                # me.jpg (OG), experience/ logotypy, logotyp_fundusze_eu.png

tests/e2e/       # Playwright specs (a11y, case-studies, contact-form, design, mobile-sheet, nav-active, services-grid, services-order, skip-link; ui-catalogue i ui-proposals na dev serverze)
tests/fixtures/  # case studies dla buildów e2e: przykładowy i pusty
spec/            # vision.md + tickets (spec/features/<id>/)
.agents/harness/ # kryteria review / audit / retro + styleguide
Dockerfile, nginx.conf  # produkcja na Dokploy
DESIGN.md        # design system
AGENTS.md        # ten plik
```
