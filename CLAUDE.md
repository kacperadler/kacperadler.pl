# kacperadler.pl

Portfolio Kacpra Adlera — Frontend Engineer (~5 lat, React/TS).

**Plan migracji i decyzje architektoniczne: `project-plan.md` — przeczytaj go przed zmianami.**

## Stack

- **Astro 6** (TypeScript strict)
- **Vanilla CSS** + scoped `<style>` w `.astro`. Theming: `light | dark | system` przez `light-dark()` + `color-scheme`, jeden akcent (navy). **Bez Tailwinda** — design system zbudowany na customowych tokenach.
- **Ultracite (Biome)** — lint + format dla TS/JS/JSON
- **Prettier + prettier-plugin-astro** — formatowanie `*.astro` (Biome ich nie parsuje)
- **Content Collections** (Zod) dla services / projects / experience / blog

## Konwencje

- **Pliki: kebab-case** (`contact-form.astro`, `nav-active.ts`). Importy w PascalCase.
- **Symbole w plikach**: camelCase dla zmiennych/funkcji, PascalCase dla typów.
- **Path aliasy**: `@/components`, `@/layouts`, `@/lib`, `@/scripts`, `@/styles`, `@/data`, `@/content`, `@/stores`, `@/assets`.
- **`data-theme` na `<html>`** (nie `<body>`) tylko gdy user wymusił `light` lub `dark`. Brak atrybutu = `system` → `light-dark()` + `color-scheme: light dark` śledzi `prefers-color-scheme` automatycznie.
- **Theme script inline w `<head>`** (synchronicznie, przed paint) — eliminuje błysk gdy user ma forced theme.
- **Active section**: IntersectionObserver, **nie** scroll listener.
- **Form submission**: state machine (`idle | submitting | success | error`) na `data-state` buttona. Aktualnie mock przez `console.info` — real submit przez `astro:actions` w Fazie 9.
- **`prefers-reduced-motion`** szanowany w każdej animowanej tranzycji.

## Don't

- Nie dodawaj Tailwinda — kolizja z CSS variables.
- Nie używaj scroll listenera dla active section — IntersectionObserver.
- Nie commituj `.claude/settings.local.json` (gitignored, personalny allowlist).
- Nie wychodź poza aktualną fazę z `project-plan.md` bez konsultacji.
- Nie pomijaj inline theme script w `<head>` — bez tego jest FOUC.

## Komendy

Package manager: **bun** (Node 22+). Decyzja zatwierdzona w Fazie 0.

```bash
bun install         # install deps
bun dev             # dev server
bun run build       # production build → dist/
bun run preview     # preview prod build
bun run check       # astro check (type-check .astro)
bun run lint        # ultracite check (Biome)
bun run format      # ultracite fix + prettier --write *.astro
```

Pre-commit hook: `lint-staged` (ultracite fix dla TS/JS/JSON/CSS, prettier dla `.astro`) + `astro check`.

## Hosting

**Dokploy** (self-hosted, własny serwer):
- Build type: **Dockerfile** w repo (multi-stage `oven/bun:1.3.13-alpine` → `nginx:1.27-alpine`)
- `nginx.conf` w repo: gzip, security headers (X-Frame-Options/X-Content-Type-Options/Referrer-Policy/Permissions-Policy), cache rules (immutable dla `/_astro/` + fontów, 30d dla obrazków, must-revalidate dla HTML)
- Container port: **80**, Traefik-routed przez Dokploy z Let's Encrypt cert
- W build stage `apk add fontconfig ttf-dejavu` — librsvg w `og-default.png.ts` potrzebuje fontu z polskimi diakrytykami, inaczej tofu boxes
- Lokalny test: `docker build -t kacperadler-pl-test . && docker run -p 8089:80 kacperadler-pl-test`

## Struktura

Pełna struktura w `project-plan.md` sekcja 4. Skrót:

```
src/
├── components/{ui,layout,sections,theme,contact}/   # kebab-case
├── content/{services,projects,experience,blog}/
├── data/                  # site-config, navigation
├── layouts/
├── pages/
├── scripts/               # vanilla TS, ładowane przez <script>
├── stores/                # nanostores
├── styles/                # tokens.css, global.css, utilities.css
├── lib/                   # seo, validators
└── actions/               # Astro Actions (Faza 9)
```
