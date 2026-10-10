# kacperadler.pl

Portfolio Kacpra Adlera - Frontend Engineer (~5 lat, React/TS). Produkcyjnie pod `kacperadler.pl`, statyczny build Astro serwowany przez nginx na Dokploy.

- **Wizja i to, co ma zostać prawdą: `spec/vision.md`.**
- **Kryteria review, styleguide, audyt: `.agents/harness/criteria/`.**
- **Jednostka pracy to ticket (`spec/features/<id>/ticket.md`)** - jego Scope i Decisions wyznaczają granice zmiany.
- **Design system: `DESIGN.md`** - frontmatter z tokenami + proza z rationale, bazowa lektura przy dotykaniu wyglądu.
- `project-plan.md` to historia projektu (fazy 0-8), nie plan do realizacji.

Gdy dokumentacja i kod się rozjeżdżają, rację ma kod.

## Stack

- **Astro 7** (TypeScript strict, output static, `<ClientRouter />` z `astro:transitions`; `compressHTML: true` - HTML-aware whitespace z Astro 6, nie domyślne `'jsx'`)
- **Vanilla CSS** + scoped `<style>` w `.astro`. **Dark-only**: `color-scheme: dark` na `:root` w `src/styles/tokens.css`, jedna ciemna wartość na kolor (bez par `light-dark()`). Jeden akcent (navy). **Bez Tailwinda** - design system na customowych tokenach (zob. `tokens.css` + `DESIGN.md`).
- **Ultracite (Biome)** - lint + format dla TS/JS/JSON/CSS
- **Prettier + prettier-plugin-astro** - formatowanie `*.astro` (Biome je lintuje, ale nie formatuje). `astroCompressHTML` w `.prettierrc` musi zgadzać się z `compressHTML` w `astro.config.mjs`, inaczej format zmienia render.
- **Content Collections** (Zod, `src/content.config.ts`) dla services / experience (JSON) oraz caseStudies / blog (MDX)
- **Case studies** (`@astrojs/mdx`) - `src/content/case-studies/<id>.mdx`, strona `/realizacje/<slug>/` (`src/pages/realizacje/[slug].astro`), lista `/realizacje/` (`src/pages/realizacje/[...index].astro`) i pozycja "Realizacje" w menu (`primaryNav()` w `src/data/navigation.ts`) - obie budowane tylko, gdy istnieje choć jeden case study, opcjonalne pole `experience` linkuje wpis w "Z kim pracowałem" (jeden case study na wpis, nieistniejący wpis wywala build). Build e2e (`E2E_FIXTURES=1`, ustawiane w `playwright.config.ts`) czyta `tests/fixtures/case-studies`, dopóki `src/content/case-studies` nie ma żadnego `.mdx`; ten sam run buduje też `dist-no-case-studies/` z `E2E_FIXTURES=none` (pusty `tests/fixtures/no-case-studies`) dla stanu bez case studies.
- **Markdown pages** dla treści statycznej (polityka prywatności, regulamin) - `src/pages/*.md` z `layout: "@/layouts/legal-layout.astro"`

### Integracje runtime

- **Formularz kontaktowy** → NocoDB self-hosted (public Shared Form view, `multipart/form-data` z pojedynczym polem `data` zawierającym JSON; UUID hardcoded w `siteConfig.nocodbFormUrl`, NIE token). Honeypot field + walidacja klient-side, server-side validation po stronie NocoDB. Nigdy nie zmieniaj na JSON body - endpoint zwraca generic error. Kierunek z `spec/vision.md`: NocoDB zastąpi SQLite na serwerze Dokploy przez API route Astro (`prerender = false`, adapter Node) - to jedyny wyjątek od statycznego buildu.
- **Analytics** → Umami self-hosted (`siteConfig.analytics.umamiUrl`). Tylko PROD (`import.meta.env.PROD`): inline script w `base-head.astro` wstrzykuje `<script defer>` Umami po `requestIdleCallback` (fallback: `load` + 1.5s), z `data-do-not-track="true"`; `astro:page-load` woła `window.umami?.track()` dla nawigacji ClientRoutera. Custom events: `form-submit { type }`, `form-error { type }`, `form-honeypot`.

## Konwencje

- **Pliki: kebab-case** (`contact-form.astro`, `nav-active.ts`). Importy w PascalCase.
- **Symbole w plikach**: camelCase dla zmiennych/funkcji, PascalCase dla typów.
- **Path aliasy**: `@/components`, `@/layouts`, `@/lib`, `@/scripts`, `@/styles`, `@/data`, `@/content`, `@/assets`.
- **Active section**: IntersectionObserver, **nie** scroll listener.
- **Form submission**: state machine na wrapperze (`data-contact-wrap[data-state]`) - `idle | submitting | error-validation | error-submit | success`. Submit handler w **capture phase** (`addEventListener('submit', ..., true)`) inaczej ClientRouter rezetuje state przed `setTimeout`.
- **`prefers-reduced-motion`** szanowany w każdej animowanej tranzycji.
- **Tracking custom events**: `window.umami?.track(name, data)` - używaj optional chaining, w dev `umami` nie istnieje.
- **Copy po polsku**, w tonie istniejących sekcji. Zamiast em-dasha piszemy myślnik ` - `.

## Don't

- Nie dodawaj Tailwinda - kolizja z CSS variables.
- Nie przywracaj theming machinery (`data-theme`, przełącznik motywu, inline theme script, jasne wartości) - strona jest dark-only.
- Nie używaj scroll listenera dla active section - IntersectionObserver.
- Nie dodawaj em-dashy (U+2014) nigdzie: copy, docs, komentarze, generowany tekst.
- Nie commituj `.claude/settings.local.json` (gitignored, personalny allowlist).
- Nie wychodź poza Scope ticketu bez konsultacji.
- Nie wysyłaj do NocoDB form view innego payloadu niż `FormData` z polem `data` zawierającym JSON-string.
- Nie zmieniaj tokenów, brand-marka favicon ani palety bez aktualizacji `DESIGN.md`.
- Nie rób content panel'i always-glass - atmosphere chrome (header / footer / mobile-sheet / hero-status) jest always glass; content cards (services / how / experience / contact-link / contact-form) opt-in'ują w glass tylko na hover (i focus dla forma) przez shared spotlight selectors.
- Nie używaj `translateY` na hover CTA - button trzyma pozycję, hover sygnalizujemy ringiem + darken'em.
- Nie dodawaj nowych always-on animacji do foreground'u - atmosphere zostaje w `bg-stage`.
- Nie dodawaj cookies, zewnętrznych skryptów ani trackerów.

## Komendy

Package manager: **bun** (Node 22+; `bun` musi być w `PATH`, bo pre-commit hook woła `bunx`).

```bash
bun install                          # install deps
bun dev                              # dev server (Umami script NIE jest renderowany)
bun run build                        # production build → dist/
bun run preview                      # preview prod build (port domyślny 4321; testy używają 4329)
bun run check                        # astro check (type-check .astro)
bun run lint                         # ultracite check (Biome)
bunx prettier --check "**/*.astro"   # format check .astro (jak w CI)
bun run format                       # ultracite fix + prettier --write *.astro
bun run test:e2e                     # playwright (chromium, headless); sam buduje dist/ przed preview
bun run test:e2e:ui                  # playwright UI mode
```

Pre-commit hook: `lint-staged` (ultracite fix dla TS/JS/JSON/CSS, prettier dla `.astro`) + `astro check`. CI (`.github/workflows/ci.yml`): lint → check → prettier check → build, potem job e2e.

## Hosting

**Dokploy** (self-hosted, własny serwer). Cloudflare Pages nie jest rozważany.

- Build type: **Dockerfile** w repo (multi-stage `oven/bun:1.4.3-alpine` → `nginx:1.30-alpine`)
- `nginx.conf` w repo: gzip, security headers (X-Frame-Options/X-Content-Type-Options/Referrer-Policy/Permissions-Policy), cache rules (immutable dla `/_astro/` + fontów, 30d dla obrazków, must-revalidate dla HTML). Headers przez `map`, NIE per-`location` - `add_header` nie dziedziczy.
- Container port: **80**, Traefik-routed przez Dokploy z Let's Encrypt cert
- W build stage `apk add fontconfig ttf-dejavu` - librsvg w `og-default.png.ts` potrzebuje fontu z polskimi diakrytykami, inaczej tofu boxes
- Lokalny test (obowiązkowy przy zmianie `Dockerfile`, `nginx.conf` lub `og-default.png.ts`): `docker build -t kacperadler-pl-test . && docker run --rm -p 8089:80 kacperadler-pl-test`

## Wygląd

Source of truth wizualny: `DESIGN.md`. Stan w kodzie:

- Layout: `src/layouts/base-layout.astro` - fixed `.bg-stage` z dot-grid na `--v2-bg`, panele w `--v2-panel`, radius `--v2-radius-*` ujawnia tło między blokami. `legal-layout.astro` owija `BaseLayout` dla stron prawnych. Prefiks `--v2-*` w tokenach to pozostałość po redesignie, który wylądował pod `/` (commit `6e1b55e`); `/v2` już nie istnieje.
- **Atmosphere layer** (`.bg-stage`, `pointer-events: none`): 6 navy ribbons drift'ujących ±40px na 8-15.5s loop nad dot-grid'em. Ribbon to 0×120vh element którego paint pochodzi wyłącznie z `box-shadow`. `will-change: transform` + `translateZ(0)` w keyframach - bez tego kompozytor throttle'uje 0×0 elementy. Delay'e rozłożone `-i/n * duration` żeby nie czytało się jako fala. `prefers-reduced-motion` zatrzymuje drift.
- **Liquid-glass paint** (`--v2-panel` 55-70% + `backdrop-filter: blur(20px) saturate(160%)` + inset 1px top hairline) używamy w dwóch trybach:
  - **Always-on atmosphere chrome**: header (`.nav-wrap`), footer (`.site-footer`), mobile sheet (`.sheet`, 70%) - globalne override'y na dole `base-layout.astro`; plus panel `.hero-status`.
  - **On hover / focus dla content cards**: services / how steps / experience tiles / contact-link / contact-form host - solid `--v2-panel` idle, glass-up na `:hover` (i `:has(...focus)` dla forma) przez shared spotlight selectors. Plus `.btn-ghost:hover` (canonical Button).
- **Spotlight effect** - wszystkie content cards mają wspólny cursor-follow pattern. `src/scripts/spotlight.ts` bind'uje się do `[data-spotlight]`, śledzi pointer (rAF-throttled) i ustawia `--mx` / `--my` jako %. Dwa pseudo'sy na karcie: `::before` to white wash radial-gradient + flat navy tint (`#2a4d7f` 8%); `::after` to navy gradient masked via `mask-composite: exclude` do 1px obwodu. Oba fade'ują `opacity: 0 → 1` na hover. Shared selectors w `src/styles/global.css` obejmują `.hero-status, .service-panel, .step-panel, .exp-panel, .case-panel, .v2-contact-link, .contact-form-host`. `prefers-reduced-motion: reduce` skip'uje binding.
- **Contact form focus state** - `.contact-form-host:has(input[type='email']:focus, textarea:focus)` aktywuje glass + spotlight tak samo jak hover, plus navy halo (`box-shadow: 0 8px 60px` z `--blue` 28%) i navy `--line` na wewnętrznej ramce. Radio "Typ projektu" celowo wykluczone z `:has()` żeby kliknięcie radio nie zgaszało stanu. Success state (`[data-state='success']`) trigger'uje to samo. `min-height: 490px` na hostcie lockuje wysokość żeby strona nie skakała przy submit.
- **UI primitives** w `src/components/ui/`: `button.astro`, `card.astro` (idle solid → hover glass, domyślnie `data-spotlight`), `input.astro` (`.v2-input`), `textarea.astro` (`.v2-textarea`). Używaj ich przed pisaniem nowego komponentu.
- **Canonical Button** - `button.astro` jest jedynym source'em CTA. Variants `primary | ghost`, sizes `md | sm` (sm = header). Primary hover: `--blue-wash` 4px ring + 12% darken + arrow icon fly-through cycle (translateX z opacity 0 dla "teleport" iluzji, bez rewind on hover-out). Ghost hover: glass. Stan `data-state="submitting"` pokazuje CSS-only spinner. Wszystkie transition'y `0.25s ease`. Używany w: header (z `data-nav-cta` żeby `nav-active.ts` mógł włączyć `.active`), hero CTAs, mobile sheet CTA, contact form, 404.
- Sekcje (`src/components/sections/`): hero (status card), services (2x2 grid + ghost number), how-i-work (vertical timeline + lucide icons per step + glass dot rail), experience ("Współpracowałem z" logo wall + optional `badge` schema field dla zleceń), contact (vertical stack + glass focus + min-height lock). Layout chrome: header, footer (2-zone glass), mobile sheet (glass overlay + animated open/close), EU funding disclosure. OG image (`src/pages/og-default.png.ts`) w ciemnej palecie.

## Struktura

```
src/
├── components/{ui,layout,sections,contact}/   # kebab-case
├── content/{services,experience}/  # JSON
├── content/{case-studies,blog}/    # MDX; blog pusty
├── content.config.ts      # Zod schemas collections
├── data/                  # site-config, navigation, process
├── layouts/               # base-layout, legal-layout
├── pages/                 # index, 404, *.md (legal), realizacje/{[slug],[...index]}, og-default.png.ts, llms.txt.ts, llms-full.txt.ts
├── scripts/               # vanilla TS: contact-form, mobile-sheet, nav-active, nav-scroll, spotlight
├── styles/                # tokens.css, global.css
├── lib/                   # seo, dates, case-studies
└── assets/                # me.jpg (OG), experience/ logotypy, logotyp_fundusze_eu.png

tests/e2e/       # Playwright specs (a11y, case-studies, contact-form, mobile-sheet, nav-active, services-grid, skip-link)
tests/fixtures/  # case studies dla buildów e2e: przykładowy i pusty
spec/            # vision.md + tickets (spec/features/<id>/)
.agents/harness/ # kryteria review / audit / retro + styleguide
Dockerfile, nginx.conf  # produkcja na Dokploy
DESIGN.md        # design system
AGENTS.md        # ten plik
project-plan.md  # historia projektu (fazy)
```
