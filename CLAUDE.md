# kacperadler.pl

Portfolio Kacpra Adlera — Frontend Engineer (~5 lat, React/TS). Aktualnie produkcyjnie pod `kacperadler.pl`, redesign trwa pod `/v2`.

**Plan migracji i decyzje architektoniczne: `project-plan.md` — przeczytaj go przed zmianami.**
**Design system v2 (target): `DESIGN.md` — frontmatter z tokenami + proza z rationale, bazowa lektura przy dotykaniu wyglądu.**

## Stack

- **Astro 6** (TypeScript strict, output static)
- **Vanilla CSS** + scoped `<style>` w `.astro`. Theming: `light | dark | system` przez `light-dark()` + `color-scheme`, jeden akcent (navy). **Bez Tailwinda** — design system zbudowany na customowych tokenach (zob. `tokens.css` + `DESIGN.md`).
- **Ultracite (Biome)** — lint + format dla TS/JS/JSON/CSS
- **Prettier + prettier-plugin-astro** — formatowanie `*.astro` (Biome ich nie parsuje)
- **Content Collections** (Zod) dla services / projects / experience
- **Markdown pages** dla treści statycznej (polityka prywatności, regulamin) — `src/pages/*.md` z `layout: legal-layout.astro`

### Integracje runtime

- **Formularz kontaktowy** → NocoDB self-hosted (public Shared Form view, `multipart/form-data` z pojedynczym polem `data` zawierającym JSON; UUID hardcoded w `siteConfig.nocodbFormUrl`, NIE token). Honeypot field + walidacja klient-side, server-side validation po stronie NocoDB. Nigdy nie zmieniaj na JSON body — endpoint zwraca generic error.
- **Analytics** → Umami self-hosted (`siteConfig.analytics.umamiUrl`). Script tag tylko PROD (`import.meta.env.PROD`), `data-astro-rerun` dla View Transitions, `data-do-not-track="true"`. Custom events: `form-submit { type }`, `form-error { type }`, `form-honeypot`.

## Konwencje

- **Pliki: kebab-case** (`contact-form.astro`, `nav-active.ts`). Importy w PascalCase.
- **Symbole w plikach**: camelCase dla zmiennych/funkcji, PascalCase dla typów.
- **Path aliasy**: `@/components`, `@/layouts`, `@/lib`, `@/scripts`, `@/styles`, `@/data`, `@/content`, `@/assets`.
- **`data-theme` na `<html>`** (nie `<body>`) tylko gdy user wymusił `light` lub `dark`. Brak atrybutu = `system` → `light-dark()` + `color-scheme: light dark` śledzi `prefers-color-scheme` automatycznie.
- **Theme script inline w `<head>`** (synchronicznie, przed paint) — eliminuje błysk gdy user ma forced theme.
- **Active section**: IntersectionObserver, **nie** scroll listener.
- **Form submission**: state machine na wrapperze (`data-contact-wrap[data-state]`) — `idle | submitting | error-validation | error-submit | success`. Submit handler w **capture phase** (`addEventListener('submit', ..., true)`) inaczej ClientRouter rezetuje state przed `setTimeout`.
- **`prefers-reduced-motion`** szanowany w każdej animowanej tranzycji.
- **Tracking custom events**: `window.umami?.track(name, data)` — używaj optional chaining, w dev `umami` nie istnieje.

## Don't

- Nie dodawaj Tailwinda — kolizja z CSS variables.
- Nie używaj scroll listenera dla active section — IntersectionObserver.
- Nie commituj `.claude/settings.local.json` (gitignored, personalny allowlist).
- Nie wychodź poza aktualną fazę z `project-plan.md` bez konsultacji.
- Nie pomijaj inline theme script w `<head>` — bez tego jest FOUC.
- Nie wysyłaj do NocoDB form view innego payloadu niż `FormData` z polem `data` zawierającym JSON-string.
- Nie zmieniaj brand-marka favicon ani phone-mock kolorów bez aktualizacji `DESIGN.md`.

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
- `nginx.conf` w repo: gzip, security headers (X-Frame-Options/X-Content-Type-Options/Referrer-Policy/Permissions-Policy), cache rules (immutable dla `/_astro/` + fontów, 30d dla obrazków, must-revalidate dla HTML). Headers przez `map`, NIE per-`location` — `add_header` nie dziedziczy.
- Container port: **80**, Traefik-routed przez Dokploy z Let's Encrypt cert
- W build stage `apk add fontconfig ttf-dejavu` — librsvg w `og-default.png.ts` potrzebuje fontu z polskimi diakrytykami, inaczej tofu boxes
- Lokalny test: `docker build -t kacperadler-pl-test . && docker run -p 8089:80 kacperadler-pl-test`

## v2 redesign track

`/v2` (noindex, sitemap-excluded) to staging dla redesignu. Source of truth wizualny: `DESIGN.md`.

- Layout: `src/layouts/v2-layout.astro` — body z dot-grid bg na `--v2-bg`, panele w `--v2-panel`, radius `--v2-radius-*` ujawnia tło między blokami.
- Tokeny v2: dodatkowe `--v2-*` w `tokens.css` (additive — nie ruszamy v1 dopóki v2 nie wygra).
- Sekcje: budujemy iteracyjnie (Faza 1 = hero, kolejne sesje = services / how-i-work / experience / contact).
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
