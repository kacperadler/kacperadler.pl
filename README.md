# kacperadler.pl

Strona Kacpra Adlera, AI Engineera i partnera technologicznego dla małych i średnich firm. Kacper robi audyty AI, wdraża agentów AI, automatyzacje i integracje, pisze aplikacje szyte na miarę (web i mobile) i zostaje przy firmie na stałe. Strona jest dla właścicieli i managerów firm i spełnia swoje zadanie, gdy ktoś z nich umówi rozmowę przez formularz kontaktowy.

Działa pod [kacperadler.pl](https://kacperadler.pl). To statyczna strona w Astro serwowana przez nginx. Na serwerze działa tylko formularz: zapisuje zgłoszenie w SQLite i wysyła powiadomienie mailem.

Stack w szczegółach, konwencje i zasady pracy opisuje [`AGENTS.md`](./AGENTS.md), wygląd [`DESIGN.md`](./DESIGN.md), a to, czym strona ma być, [`spec/vision.md`](./spec/vision.md). Praca idzie ticketami w `spec/features/`.

## Stack

- [Astro 7](https://docs.astro.build) z TypeScriptem, treść w content collections i MDX
- Vanilla CSS na własnych tokenach, ciemny motyw, bez Tailwinda
- Fonty [Geist](https://vercel.com/font) hostowane u siebie (SIL OFL 1.1) i ikony lucide
- [Ultracite](https://www.ultracite.ai/) (Biome) do lintu i formatowania
- [Husky](https://typicode.github.io/husky/) i lint-staged przed commitem
- [Playwright](https://playwright.dev) z axe do testów e2e i dostępności
- SQLite i Resend dla formularza kontaktowego
- Umami na własnym serwerze do analityki, bez cookies
- [Dokploy](https://dokploy.com) na własnym serwerze, obraz z `Dockerfile`

## Wymagania

- [bun](https://bun.sh) 1.3 lub nowszy (wersja projektu stoi w `packageManager` w `package.json`), dostępny w `PATH`, bo hook przed commitem woła `bunx`
- Node 22.13 lub nowszy: Astro działa na Node, a formularz używa wbudowanego `node:sqlite`
- przeglądarka Playwrighta do testów: `bunx playwright install chromium`
- Docker, jeśli budujesz obraz lokalnie

## Komendy

| Komenda               | Co robi                                                               |
| :-------------------- | :-------------------------------------------------------------------- |
| `bun install`         | Instaluje zależności i hook przed commitem                            |
| `bun dev`             | Dev server na `localhost:4321`, bez analityki                         |
| `bun run build`       | Build produkcyjny: strony w `dist/client/`, serwer w `dist/server/`   |
| `bun run preview`     | Podgląd buildu produkcyjnego                                          |
| `bun run lint`        | Sprawdza lint i format, tak jak CI                                    |
| `bun run format`      | Poprawia lint i format                                                |
| `bun run check`       | Sprawdza typy, razem z plikami `.astro`                               |
| `bun run test:e2e`    | Buduje stronę i puszcza testy Playwrighta w Chromium                  |
| `bun run test:e2e:ui` | To samo w trybie UI Playwrighta                                       |

## Checki

Przed każdym commitem hook poprawia lint i format zmienionych plików, a potem uruchamia `astro check` na całym projekcie. CI na GitHub Actions przy pushu i pull requeście do `main` uruchamia lint, check i build, a po nich testy e2e. Raport Playwrighta zostaje jako artefakt `playwright-report`.

## Formularz kontaktowy

Formularz wysyła zgłoszenie na `/api/lead`. Serwer zapisuje je w SQLite i wysyła powiadomienie przez Resend. Ustawienia czyta ze zmiennych środowiskowych, których wartości nie commitujemy:

| Zmienna            | Co to                                                          |
| :----------------- | :------------------------------------------------------------- |
| `LEADS_DB_PATH`    | Plik bazy SQLite; obraz Dockera ustawia `/data/leads.sqlite`   |
| `RESEND_API_KEY`   | Klucz API Resend                                               |
| `LEAD_NOTIFY_FROM` | Nadawca powiadomienia, adres w domenie zweryfikowanej w Resend |
| `LEAD_NOTIFY_TO`   | Skrzynka, na którą przychodzi powiadomienie                    |

Bez zmiennych Resend lead i tak się zapisze, tylko mail nie pójdzie. Żeby wypróbować formularz lokalnie, wskaż plik bazy (pliki `*.sqlite` są w `.gitignore`):

```bash
LEADS_DB_PATH=./leads.sqlite bun dev
```

## Docker i deploy

Obraz produkcyjny zbudujesz i uruchomisz lokalnie tak:

```bash
docker build -t kacperadler-pl-test .
docker run --rm -p 8089:80 -v ka-leads-test:/data kacperadler-pl-test
```

Strona jest wtedy pod `http://localhost:8089`, a leady trafiają do wolumenu `ka-leads-test`. Zrób to przy każdej zmianie `Dockerfile`, `nginx.conf`, `docker-start.sh` albo generatora obrazka OG (`src/pages/og-default.png.ts`).

Każdy push do `main` to wydanie: Dokploy sam buduje obraz z `Dockerfile` i wdraża go na produkcję. W jednym kontenerze nginx serwuje strony, a Node obsługuje formularz. Baza leadów leży na wolumenie `/data`, który przeżywa redeploy. Pierwsze ustawienie aplikacji w Dokploy i sprawdzenie, czy lead doszedł, opisuje [`docs/deploy.md`](./docs/deploy.md).
