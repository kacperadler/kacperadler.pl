# kacperadler.pl

Portfolio Kacpra Adlera, Frontend Engineera (~5 lat, React/TS): kim jest i czym się zajmuje. Oferta to agenci AI i automatyzacje, aplikacje webowe, narzędzia wewnętrzne, landing page'e, strony wizytówki i aplikacje mobilne. Strona jest dla osób, które mogą go zatrudnić, a spełnia swoje zadanie, gdy wyślą formularz kontaktowy.

Produkcja: [kacperadler.pl](https://kacperadler.pl) - statyczny build Astro serwowany przez nginx na Dokploy.

- Wizja i to, co ma zostać prawdą: [`spec/vision.md`](./spec/vision.md)
- Konwencje, stack i zasady pracy (dla ludzi i agentów): [`AGENTS.md`](./AGENTS.md)
- Design system: [`DESIGN.md`](./DESIGN.md)
- Praca idzie ticketami: `spec/features/<id>/ticket.md`

## Stack

- **[Astro 7](https://docs.astro.build)** - TypeScript strict, output static, content collections, `<ClientRouter />`
- **Vanilla CSS** + scoped `<style>` w `.astro`, tokeny w `src/styles/tokens.css`; dark-only, jeden akcent (navy), bez Tailwinda
- **[Ultracite](https://www.ultracite.ai/)** (Biome) - lint i format dla TS/JS/JSON/CSS i `.astro`
- **[Husky](https://typicode.github.io/husky/)** + **lint-staged** - pre-commit
- **[Playwright](https://playwright.dev)** + `@axe-core/playwright` - testy E2E i a11y
- `astro-icon` + lucide, self-hosted **[Geist](https://vercel.com/font)** (variable woff2, SIL OFL 1.1)
- Formularz kontaktowy: NocoDB self-hosted; analityka: Umami self-hosted (tylko produkcja, bez cookies)
- Hosting: **[Dokploy](https://dokploy.com)** na własnym serwerze - `Dockerfile` (bun build → nginx) + `nginx.conf`

## Wymagania

- **[bun](https://bun.sh)** ≥ 1.3 (wersja z `packageManager` w `package.json`), dostępny w `PATH` - pre-commit hook woła `bunx`
- **Node 22.12+** - Astro CLI uruchamia się na Node
- Do testów E2E przeglądarka Playwrighta: `bunx playwright install chromium`
- Do lokalnego testu obrazu: Docker

## Komendy

```bash
bun install
bun dev
```

| Komenda               | Opis                                                                   |
| :-------------------- | :--------------------------------------------------------------------- |
| `bun install`         | Instalacja zależności (też instaluje hook pre-commit przez `prepare`)  |
| `bun dev`             | Dev server na `localhost:4321` (bez skryptu Umami)                     |
| `bun run build`       | Build produkcyjny do `dist/`                                           |
| `bun run preview`     | Podgląd buildu produkcyjnego                                           |
| `bun run lint`        | `ultracite check` - lint + format check Biome, razem z `.astro`        |
| `bun run format`      | `ultracite fix` - poprawki lintu + formatowanie                        |
| `bun run check`       | `astro check` - type-check, też plików `.astro`                        |
| `bun run test:e2e`    | Playwright (chromium, headless); sam buduje `dist/` i odpala preview   |
| `bun run test:e2e:ui` | Playwright w trybie UI                                                 |

## Jak działają checki

**Pre-commit** (`husky` + `lint-staged`) na każdym commicie:

- `ultracite fix` na staged `*.{ts,tsx,js,jsx,json,jsonc,css,astro}`
- `astro check` na całym projekcie

**CI** (GitHub Actions, `.github/workflows/ci.yml`) na `push` i `pull_request` do `main`:

1. **build**: Node 22 + bun, `bun install --frozen-lockfile`, `bun run lint`, `bun run check`, `bun run build`
2. **e2e** (po build): Playwright chromium z cache przeglądarek, `bun run test:e2e`, raport w artefakcie `playwright-report`

Dependabot (`.github/dependabot.yml`) co tydzień otwiera PR-y dla bun i GitHub Actions; minor i patch zgrupowane w jednym PR.

## Deploy

Dokploy na własnym serwerze buduje obraz z `Dockerfile` w repo:

- stage build: `oven/bun:1.4.3-alpine`, `bun install --frozen-lockfile`, `bun run build` (z `fontconfig` i `ttf-dejavu`, żeby OG image miał polskie znaki)
- stage serve: `nginx:1.30-alpine` serwuje `dist/` z `nginx.conf` - gzip, security headers, cache (immutable dla `/_astro/` i fontów), `404.html` dla nieznanych adresów
- port kontenera **80**, routing przez Traefik w Dokploy z certyfikatem Let's Encrypt

Lokalny test obrazu (obowiązkowy przy zmianie `Dockerfile`, `nginx.conf` lub `src/pages/og-default.png.ts`):

```bash
docker build -t kacperadler-pl-test .
docker run --rm -p 8089:80 kacperadler-pl-test
```

Strona jest wtedy pod `http://localhost:8089`.
