# kacperadler.pl

Strona Kacpra Adlera, AI Engineera i partnera technologicznego dla małych i średnich firm: wdrożenia AI, automatyzacje i aplikacje szyte na miarę. Oferta to trzy kroki - audyt AI, wdrożenie (agenci AI, automatyzacje, integracje, aplikacje szyte na miarę - web i mobile) i stała współpraca. Strona jest dla właścicieli i managerów firm, a spełnia swoje zadanie, gdy umówią rozmowę przez formularz kontaktowy.

Produkcja: [kacperadler.pl](https://kacperadler.pl) - statyczny build Astro serwowany przez nginx na Dokploy, plus jedna trasa API na Node (`/api/lead`), która zapisuje formularz kontaktowy w SQLite.

- Wizja i to, co ma zostać prawdą: [`spec/vision.md`](./spec/vision.md)
- Konwencje, stack i zasady pracy (dla ludzi i agentów): [`AGENTS.md`](./AGENTS.md)
- Design system: [`DESIGN.md`](./DESIGN.md)
- Praca idzie ticketami: `spec/features/<id>/ticket.md`

## Stack

- **[Astro 7](https://docs.astro.build)** - TypeScript strict, output static, content collections, `<ClientRouter />`; adapter `@astrojs/node` tylko dla `src/pages/api/lead.ts` (`prerender = false`)
- **Case studies w MDX** (`@astrojs/mdx`): `src/content/case-studies/<id>.mdx` → `/realizacje/<slug>/`, link z wpisu w akordeonie "Pełne doświadczenie" i z karty w sekcji `#cases`; lista `/realizacje/` buduje się tylko, gdy istnieje choć jeden case study (link `Wszystkie realizacje` w `#cases`), a pozycja "Realizacje" w menu zawsze prowadzi do `/#cases`
- **Vanilla CSS** + scoped `<style>` w `.astro`, tokeny w `src/styles/tokens.css`; dark-only, jeden akcent (navy), bez Tailwinda
- **[Ultracite](https://www.ultracite.ai/)** (Biome) - lint i format dla TS/JS/JSON/CSS i `.astro`
- **[Husky](https://typicode.github.io/husky/)** + **lint-staged** - pre-commit
- **[Playwright](https://playwright.dev)** + `@axe-core/playwright` - testy E2E i a11y
- `astro-icon` + lucide, self-hosted **[Geist](https://vercel.com/font)** (variable woff2, SIL OFL 1.1)
- Formularz kontaktowy: `POST /api/lead` → SQLite (`node:sqlite`) na wolumenie Dokploy, powiadomienie e-mailem przez Resend; analityka: Umami self-hosted (tylko produkcja, bez cookies)
- Hosting: **[Dokploy](https://dokploy.com)** na własnym serwerze - `Dockerfile` (bun build → nginx + Node) + `nginx.conf` + `docker-start.sh`

## Wymagania

- **[bun](https://bun.sh)** ≥ 1.3 (wersja z `packageManager` w `package.json`), dostępny w `PATH` - pre-commit hook woła `bunx`
- **Node 22.13+** - Astro CLI uruchamia się na Node, a trasa `/api/lead` potrzebuje wbudowanego `node:sqlite`
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
| `bun run build`       | Build produkcyjny: strony do `dist/client/`, serwer Node do `dist/server/` |
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

`bun run test:e2e` buduje stronę dwa razy (`webServer` w `playwright.config.ts`): `E2E_FIXTURES=none` do `dist-no-case-studies/` (stan bez case studies, z pustego `tests/fixtures/no-case-studies`) i `E2E_FIXTURES=1` do `dist/` z przykładowym `tests/fixtures/case-studies/przyklad.mdx`, dopóki `src/content/case-studies` nie ma żadnego `.mdx`. Build produkcyjny nie czyta fixture'ów. Preview zapisuje leady do świeżego pliku SQLite w katalogu tymczasowym (`E2E_LEADS_DB`, `LEADS_DB_PATH` preview) i ma puste `RESEND_API_KEY`, więc test nigdy nie wysyła prawdziwego maila.

Specy katalogu `/ui` (`ui-catalogue`, `dev-no-reload`) idą na `astro dev` tego drzewa, uruchomionym z `E2E_DEV_NO_WATCH=1` (`astro.config.mjs`): ten serwer nie obserwuje żadnego pliku, więc commit (lint-staged poprawia pliki, `astro check`) albo edycja w trakcie runu nie przeładowuje strony pod działającym testem.

Dependabot (`.github/dependabot.yml`) co tydzień otwiera PR-y dla bun i GitHub Actions; minor i patch zgrupowane w jednym PR.

## Leady i powiadomienia

Formularz kontaktowy (`src/scripts/contact-form.ts`) wysyła JSON `{ email, company, types, message, website }` (`types`: jeden lub kilka typów projektu; `company`: nazwa firmy, nieobowiązkowa, do 200 znaków) na `POST /api/lead` (`src/pages/api/lead.ts`, jedyna trasa renderowana na żądanie). Trasa sprawdza pola tymi samymi regułami co przeglądarka (`src/lib/lead.ts`), zapisuje lead w SQLite (`src/lib/leads-db.ts`, tabela `leads(id, created_at, email, type, message, company)`, tworzona przy pierwszym zapisie; `type` to wybrane typy po przecinku, np. `audit,implementation`; `company` to `''`, gdy firmy nie podano - tabela sprzed tego pola dostaje kolumnę przy pierwszym zapisie, a jej wiersze `''`) i wysyła powiadomienie przez API Resend (`src/lib/send-email.ts`, sam `fetch`, limit 5 s).

- `type` to `audit | implementation | partner | other` (`projectTypes`); wiersze zapisane wcześniej zostają z `ai | webapp | landing | mobile | tool`, ale nowy lead z takim typem dostaje 400.
- Wypełniony honeypot (`website`) → 200, nic nie zapisane.
- Złe pola → 400; lead nie da się zapisać → 500 (formularz pokazuje błąd).
- Więcej niż 5 postów na minutę z jednego IP (wszystkie 5 mogą przyjść naraz, szósty od razu dostaje 429) → 429 od nginx (`limit_req` w `nginx.conf`), zanim żądanie dotrze do Node; formularz pokazuje błąd wysyłki. IP klienta nginx bierze z ostatniego adresu w `X-Forwarded-For`, który dopisuje Traefik, ale tylko gdy żądanie przyszło z `10.0.0.0/8` (sieć `dokploy-network`); z innego adresu nagłówek jest ignorowany, więc skrypt nie podszyje się pod nowy adres przy każdym poście.
- Mail nie poszedł albo nie jest skonfigurowany → tylko wpis w logach; lead zostaje zapisany, odwiedzający widzi sukces.
- Mail zawiera tylko numer leada, typ projektu i godzinę - bez emaila, firmy i treści odwiedzającego (polityka prywatności mówi, że nie ma zewnętrznych procesorów danych). Lead czytasz z bazy.
- Logi niosą tylko numer leada: `[lead] saved #<id>`.

Zmienne środowiskowe (czytane z `process.env` przy każdym żądaniu, nie wkompilowane w build; nigdy nie commituj ich wartości):

| Zmienna            | Co to                                                                                          |
| :----------------- | :--------------------------------------------------------------------------------------------- |
| `LEADS_DB_PATH`    | Ścieżka pliku SQLite. Obraz ustawia `/data/leads.sqlite`; lokalnie podajesz sam                 |
| `RESEND_API_KEY`   | Klucz API Resend (`re_...`) z uprawnieniem "Sending access"                                    |
| `LEAD_NOTIFY_FROM` | Nadawca, adres w domenie zweryfikowanej w Resend, np. `Strona kacperadler.pl <leady@kacperadler.pl>` |
| `LEAD_NOTIFY_TO`   | Twoja skrzynka, na którą przychodzi powiadomienie                                              |

Bez którejkolwiek z trzech zmiennych Resend lead i tak się zapisze, a w logach pojawi się ostrzeżenie `[lead] #<id>: no e-mail, ...`.

Lokalnie formularz działa w `bun dev` z plikiem w repo (`*.sqlite` jest w `.gitignore`):

```bash
LEADS_DB_PATH=./leads.sqlite bun dev
```

## Deploy

Dokploy na własnym serwerze buduje obraz z `Dockerfile` w repo:

- stage build: `oven/bun:1.4.3-alpine`, `bun install --frozen-lockfile`, `bun run build` (z `fontconfig` i `ttf-dejavu`, żeby OG image miał polskie znaki)
- stage deps: `bun install --frozen-lockfile --production --ignore-scripts` - `node_modules`, których potrzebuje serwer Node
- stage serve: `nginx:1.30-alpine` + `nodejs`; `docker-start.sh` odpala oba procesy. nginx serwuje `dist/client/` z `nginx.conf` - gzip, security headers, cache (immutable dla `/_astro/` i fontów, `no-store` dla `/api/`), `404.html` dla nieznanych adresów - i przekazuje `/api/` do Node (`dist/server/entry.mjs` na `127.0.0.1:4321`). Gdy któryś proces padnie, kontener kończy się, a Dokploy go restartuje.
- port kontenera **80**, routing przez Traefik w Dokploy z certyfikatem Let's Encrypt
- wolumen na `/data`: tam leży `/data/leads.sqlite`

Lokalny test obrazu (obowiązkowy przy zmianie `Dockerfile`, `nginx.conf`, `docker-start.sh` lub `src/pages/og-default.png.ts`):

```bash
docker build -t kacperadler-pl-test .
docker run --rm -p 8089:80 -v ka-leads-test:/data kacperadler-pl-test
```

Strona jest wtedy pod `http://localhost:8089`, a lead wysłany z formularza ląduje w wolumenie `ka-leads-test`.

### Dokploy krok po kroku: baza leadów i powiadomienia

Nazwy menu za dokumentacją Dokploy (Applications → Advanced); jeśli w Twojej wersji brzmią inaczej, szukaj odpowiednika.

1. **Resend** (raz):
   - na [resend.com/domains](https://resend.com/domains) dodaj domenę `kacperadler.pl` (region EU, `eu-west-1`) i dodaj u swojego dostawcy DNS rekordy, które Resend pokaże (DKIM, SPF/MX dla poddomeny wysyłkowej); poczekaj, aż status będzie "Verified";
   - na [resend.com/api-keys](https://resend.com/api-keys) utwórz klucz z uprawnieniem **Sending access** (najlepiej tylko dla tej domeny) i skopiuj go - Resend pokazuje go tylko raz.
2. **Wolumen - przed pierwszym deployem tej wersji**, inaczej leady zginą przy następnym redeployu. W aplikacji w Dokploy: zakładka **Advanced** → sekcja **Volumes/Mounts** → **Add Volume** → typ **Volume Mount**:
   - **Volume Name**: `kacperadler-leads`
   - **Mount Path**: `/data`
   - zapisz. Plik bazy to `/data/leads.sqlite`; obraz sam ustawia `LEADS_DB_PATH=/data/leads.sqlite`, nie dodawaj tej zmiennej.
3. **Zmienne**: zakładka **Environment** → w polu zmiennych dopisz trzy linie i kliknij **Save**:

   ```
   RESEND_API_KEY=re_...
   LEAD_NOTIFY_FROM=Strona kacperadler.pl <leady@kacperadler.pl>
   LEAD_NOTIFY_TO=twoj-adres@example.com
   ```

4. **Deploy**: przycisk **Deploy** (albo **Redeploy**) w zakładce **General**; poczekaj, aż deployment w **Deployments** będzie zielony.
5. **Sprawdź, czy lead doszedł**:
   - wyślij formularz na [kacperadler.pl/#contact](https://kacperadler.pl/#contact) - po wysłaniu widać kartę sukcesu;
   - na `LEAD_NOTIFY_TO` przychodzi mail "Nowy lead #<numer> - <typy projektu>";
   - zakładka **Logs**: linia `[lead] saved #<numer>` (ostrzeżenie `no e-mail` znaczy, że brakuje zmiennej z kroku 3; `the e-mail was not sent` - Resend odrzucił wysyłkę, powód jest w tej samej linii);
   - terminal kontenera (w Dokploy **Docker Terminal** / **Terminal** aplikacji, albo na serwerze `docker exec -it <kontener> sh`) - pięć ostatnich leadów:

     ```bash
     node -e "const {DatabaseSync}=require('node:sqlite');console.table(new DatabaseSync('/data/leads.sqlite',{readOnly:true}).prepare('select * from leads order by id desc limit 5').all())"
     ```
   - limit zapytań (terminal serwera Dokploy): `docker network inspect dokploy-network --format '{{range .IPAM.Config}}{{.Subnet}}{{end}}'` musi dać podsieć w `10.0.0.0/8` (domyślna pula Docker Swarm, np. `10.0.1.0/24`). Inna podsieć znaczy, że nginx nie ufa `X-Forwarded-For` od Traefika i liczy limit dla adresu Traefika, czyli wspólnie dla wszystkich odwiedzających - wtedy zmień `set_real_ip_from` w `nginx.conf` na tę podsieć.

Wolumen przeżywa redeploy i restart kontenera; usuwa go dopiero skasowanie wolumenu w Dokploy albo na serwerze.
