# kacperadler.pl

Portfolio Kacpra Adlera - Frontend Engineer (~5 lat, React/TS). Aktualnie produkcyjnie pod `kacperadler.pl`, redesign trwa pod `/v2`.

**Plan migracji i decyzje architektoniczne: `project-plan.md` - przeczytaj go przed zmianami.**
**Design system v2 (target): `DESIGN.md` - frontmatter z tokenami + proza z rationale, bazowa lektura przy dotykaniu wyglądu.**

## Stack

- **Astro 6** (TypeScript strict, output static)
- **Vanilla CSS** + scoped `<style>` w `.astro`. Theming: `light | dark | system` przez `light-dark()` + `color-scheme`, jeden akcent (navy). **Bez Tailwinda** - design system zbudowany na customowych tokenach (zob. `tokens.css` + `DESIGN.md`).
- **Ultracite (Biome)** - lint + format dla TS/JS/JSON/CSS
- **Prettier + prettier-plugin-astro** - formatowanie `*.astro` (Biome ich nie parsuje)
- **Content Collections** (Zod) dla services / projects / experience
- **Markdown pages** dla treści statycznej (polityka prywatności, regulamin) - `src/pages/*.md` z `layout: legal-layout.astro`

### Integracje runtime

- **Formularz kontaktowy** → NocoDB self-hosted (public Shared Form view, `multipart/form-data` z pojedynczym polem `data` zawierającym JSON; UUID hardcoded w `siteConfig.nocodbFormUrl`, NIE token). Honeypot field + walidacja klient-side, server-side validation po stronie NocoDB. Nigdy nie zmieniaj na JSON body - endpoint zwraca generic error.
- **Analytics** → Umami self-hosted (`siteConfig.analytics.umamiUrl`). Script tag tylko PROD (`import.meta.env.PROD`), `data-astro-rerun` dla View Transitions, `data-do-not-track="true"`. Custom events: `form-submit { type }`, `form-error { type }`, `form-honeypot`.

## Konwencje

- **Pliki: kebab-case** (`contact-form.astro`, `nav-active.ts`). Importy w PascalCase.
- **Symbole w plikach**: camelCase dla zmiennych/funkcji, PascalCase dla typów.
- **Path aliasy**: `@/components`, `@/layouts`, `@/lib`, `@/scripts`, `@/styles`, `@/data`, `@/content`, `@/assets`.
- **`data-theme` na `<html>`** (nie `<body>`) tylko gdy user wymusił `light` lub `dark`. Brak atrybutu = `system` → `light-dark()` + `color-scheme: light dark` śledzi `prefers-color-scheme` automatycznie.
- **Theme script inline w `<head>`** (synchronicznie, przed paint) - eliminuje błysk gdy user ma forced theme.
- **Active section**: IntersectionObserver, **nie** scroll listener.
- **Form submission**: state machine na wrapperze (`data-contact-wrap[data-state]`) - `idle | submitting | error-validation | error-submit | success`. Submit handler w **capture phase** (`addEventListener('submit', ..., true)`) inaczej ClientRouter rezetuje state przed `setTimeout`.
- **`prefers-reduced-motion`** szanowany w każdej animowanej tranzycji.
- **Tracking custom events**: `window.umami?.track(name, data)` - używaj optional chaining, w dev `umami` nie istnieje.

## Don't

- Nie dodawaj Tailwinda - kolizja z CSS variables.
- Nie używaj scroll listenera dla active section - IntersectionObserver.
- Nie commituj `.claude/settings.local.json` (gitignored, personalny allowlist).
- Nie wychodź poza aktualną fazę z `project-plan.md` bez konsultacji.
- Nie pomijaj inline theme script w `<head>` - bez tego jest FOUC.
- Nie wysyłaj do NocoDB form view innego payloadu niż `FormData` z polem `data` zawierającym JSON-string.
- Nie zmieniaj brand-marka favicon ani phone-mock kolorów bez aktualizacji `DESIGN.md`.
- Nie rób content panel'i always-glass - atmosphere chrome (header / footer / mobile-sheet / hero-status) jest always glass; content cards (services / how / experience / contact-link / contact-form) opt-in'ują w glass tylko na hover (i focus dla forma) przez shared spotlight selectors.
- Nie używaj `translateY` na hover v2 CTA - button trzyma pozycję, hover sygnalizujemy ringiem + darken'em.
- Nie dodawaj nowych always-on animacji do foreground'u v2 - atmosphere zostaje w `bg-stage`.

## Komendy

Package manager: **bun** (Node 22+). Decyzja zatwierdzona w Fazie 0.

```bash
bun install            # install deps
bun dev                # dev server (Umami script NIE jest renderowany)
bun run build          # production build → dist/
bun run preview        # preview prod build (port domyślny 4321; testy używają 4329)
bun run check          # astro check (type-check .astro)
bun run lint           # ultracite check (Biome)
bun run format         # ultracite fix + prettier --write *.astro
bun run test:e2e       # playwright (chromium, headless)
bun run test:e2e:ui    # playwright UI mode
```

Pre-commit hook: `lint-staged` (ultracite fix dla TS/JS/JSON/CSS, prettier dla `.astro`) + `astro check`.

## Hosting

**Dokploy** (self-hosted, własny serwer):
- Build type: **Dockerfile** w repo (multi-stage `oven/bun:1.3.13-alpine` → `nginx:1.27-alpine`)
- `nginx.conf` w repo: gzip, security headers (X-Frame-Options/X-Content-Type-Options/Referrer-Policy/Permissions-Policy), cache rules (immutable dla `/_astro/` + fontów, 30d dla obrazków, must-revalidate dla HTML). Headers przez `map`, NIE per-`location` - `add_header` nie dziedziczy.
- Container port: **80**, Traefik-routed przez Dokploy z Let's Encrypt cert
- W build stage `apk add fontconfig ttf-dejavu` - librsvg w `og-default.png.ts` potrzebuje fontu z polskimi diakrytykami, inaczej tofu boxes
- Lokalny test: `docker build -t kacperadler-pl-test . && docker run -p 8089:80 kacperadler-pl-test`

## v2 redesign track

`/v2` (noindex, sitemap-excluded) to staging dla redesignu. Source of truth wizualny: `DESIGN.md`.

- Layout: `src/layouts/v2-layout.astro` - body z dot-grid bg na `--v2-bg`, panele w `--v2-panel`, radius `--v2-radius-*` ujawnia tło między blokami.
- **v2 jest dark-only**. `body.v2-body { color-scheme: dark }` wymusza w każdym `light-dark()` wybór ciemnej wartości, ignorując `data-theme` na `<html>` i `prefers-color-scheme`. ThemeFab wywalony tylko z v2-layout. v1 trzyma pełną triadę. Po migracji v2 → / wywalimy całą theming machinery (theme.ts, theme-fab, inline theme script, light-dark() pary).
- **Atmosphere layer** (fixed `.bg-stage` w v2-layout, `pointer-events: none`): 6 navy ribbons drift'ujących ±40px na 8–15.5s loop nad dot-grid'em. Ribbon to 0×120vh element którego paint pochodzi wyłącznie z `box-shadow`. `will-change: transform` + `translateZ(0)` w keyframach - bez tego kompozytor throttle'uje 0×0 elementy. Delay'e rozłożone `-i/n * duration` żeby nie czytało się jako fala. `prefers-reduced-motion` zatrzymuje drift.
- **Liquid-glass paint** (`--v2-panel` 55-70% + `backdrop-filter: blur(20px) saturate(160%)` + inset 1px top hairline) używamy w dwóch trybach:
  - **Always-on atmosphere chrome**: header (`body.v2-body .nav-wrap` override), footer (`body.v2-body .site-footer`), mobile sheet (`body.v2-body .sheet`, 70%), `.hero-status` panel.
  - **On hover / focus dla content cards**: services / how steps / experience tiles / contact-link / contact-form host - solid `--v2-panel` idle, glass-up na `:hover` (i `:has(...focus)` dla forma) przez shared spotlight selectors. Plus `.btn-ghost:hover` (canonical Button).
- **Spotlight effect** - wszystkie content cards mają wspólny cursor-follow pattern. `src/scripts/spotlight.ts` bind'uje się do `[data-spotlight]`, śledzi pointer (rAF-throttled) i ustawia `--mx` / `--my` jako %. Dwa pseudo'sy na karcie: `::before` to white wash radial-gradient + flat navy tint (`#2a4d7f` 8%); `::after` to navy gradient masked via `mask-composite: exclude` do 1px obwodu. Oba fade'ują `opacity: 0 → 1` na hover. Shared selectors w `v2.astro` obejmują `.hero-status, .service-panel, .step-panel, .exp-panel, .v2-contact-link, .contact-form-host`. `prefers-reduced-motion: reduce` skip'uje binding.
- **Contact form focus state** - `.contact-form-host:has(input[type='email']:focus, textarea:focus)` aktywuje glass + spotlight tak samo jak hover, plus dodatkowo navy halo glow (1px ring + 48px shadow). Radio "Typ projektu" celowo wykluczone z `:has()` żeby kliknięcie radio nie zgaszało stanu. Success state (`[data-state='success']`) trigger'uje to samo. `min-height: 540px` na hostcie lockuje wysokość żeby strona nie skakała przy submit.
- **Canonical Button** - `src/components/ui/button.astro` jest jedynym source'em CTA. Variants `primary | ghost`, sizes `md | sm` (sm = header). Primary hover: `--blue-wash` 4px ring + 12% darken + arrow icon fly-through cycle (translateX z opacity 0 dla "teleport" iluzji, bez rewind on hover-out). Ghost hover: glass. Wszystkie transition'y `0.25s ease`. Używany w: header (z `data-nav-cta` żeby `nav-active.ts` mógł włączyć `.active`), hero CTAs, mobile sheet CTA.
- Tokeny v2: dodatkowe `--v2-*` w `tokens.css` (additive - nie ruszamy v1 dopóki v2 nie wygra).
- Sekcje (zrobione): hero (status card + atmosphere ribbons), services (2x2 grid + ghost number), how-i-work (vertical timeline + lucide icons per step + glass dot rail), experience ("Współpracowałem z" logo wall + optional `badge` schema field dla zleceń), contact (vertical stack + glass focus + min-height lock), footer (2-zone glass), mobile sheet (glass overlay + animated open/close), OG image (v2 dark palette).
- Migracja → `/`: gdy v2 jest gotowe, `v2-layout` zlewa się z `base-layout`, `/v2` redirectuje na `/`, stare style usuwane.

## Struktura

Pełna struktura w `project-plan.md` sekcja 4. Skrót:

```
src/
├── components/{ui,layout,sections,theme,contact}/   # kebab-case
├── content/{services,projects,experience}/
├── data/                  # site-config, navigation
├── layouts/               # base-layout, v2-layout, legal-layout
├── pages/                 # index.astro + .md (legal) + v2.astro (redesign)
├── scripts/               # vanilla TS, ładowane przez <script>
├── styles/                # tokens.css (v1 + v2-namespace), global.css
├── lib/                   # seo, dates
└── assets/                # me.jpg (OG), logotyp_fundusze_eu.png

DESIGN.md        # design system v2 (target)
CLAUDE.md        # ten plik
project-plan.md  # historia + plan faz
```
