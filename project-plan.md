# kacperadler.pl - plan projektu

Migracja `example.html` (single-file prototyp) do produkcyjnego projektu Astro, gotowego pod rozwój o blog.

> **Ten dokument to historia.** Fazy 0-8 są zamknięte i nowych nie dopisujemy. Od KA0001 jednostką pracy jest ticket (`spec/features/<id>/ticket.md`), kierunek wyznacza `spec/vision.md`, a aktualny stan kodu opisuje `AGENTS.md`. Co się zmieniło od czasu planu:
>
> - Redesign v2 wylądował pod `/` (commit `6e1b55e`): `/v2`, `v2-layout` i cała theming machinery (`data-theme`, theme toggle, inline theme script) są usunięte. Strona jest dark-only.
> - Produkcja stoi na **Dokploy** (własny serwer): `Dockerfile` (bun build → nginx) + `nginx.conf`. Cloudflare Pages nie jest rozważany.
> - Formularz wysyła do NocoDB (public shared form view); kierunek: leady w SQLite przez API route z adapterem Node. Faza 9 (Astro Actions + Resend) porzucona.
> - Analytics: Umami self-hosted.

---

## 1. Cele

- **1:1 funkcjonalność** względem `example.html` minus akcenty / tweaks panel (decyzja właściciela: tylko motyw light | dark | system, jeden akcent - navy)
- **Lepsze fundamenty** niż prototyp: brak FOUC, lepsze a11y, IntersectionObserver zamiast scroll listenera, structured data, OG, sitemap
- **Gotowe pod blog** - content collections + layouty + RSS + ClientRouter zaprojektowane od początku
- **Lighthouse 100/100/100/100** na home (cel mierzalny przed deployem)
- **Hosting: Dokploy** - statyczny `dist/` serwowany przez nginx z obrazu Docker

---

## 2. Stack - final list

### Core
- **Astro 7.x** (TypeScript strict) - zainstalowane: 7.3.8
- **`@astrojs/check`** + `typescript` - type checking dla `.astro`
- **`@astrojs/mdx`** - pod blog i case-studies projektów (Faza 3)
- **`@astrojs/sitemap`** - auto-sitemap (Faza 6)
- **`@astrojs/rss`** - RSS pod blog (Faza 10)
- **`astro:assets` + `<Image />`** - auto-optymalizacja obrazków
- **`<ClientRouter />`** (View Transitions) - płynne przejścia
- **`astro-icon`** + `lucide` icon set - zamiast inline SVG

### Tooling
- **`ultracite`** (7.x) - Biome preset (lint + format dla TS/JS/JSON/CSS); `.astro` formatting wyłączony w `biome.jsonc` (przejmuje prettier)
- **`prettier` + `prettier-plugin-astro`** - formatowanie plików `.astro` (Biome formatuje pod nim niespójnie z Astro)
- **`husky` + `lint-staged`** - pre-commit hooks (`lint-staged` + `astro check`)
- **`bun`** - package manager (Node 22+)

### Runtime helpers
- **`zod`** - schemy dla content collections + walidacja form
- **`nanostores`** - minimalny state share (theme między wyspami, jeśli zajdzie potrzeba)

### Testing
- **`vitest`** - unit (validators, helpers)
- **`@playwright/test`** - E2E: theme persist, nav active, form validation, mobile sheet

### Hosting
- **Dokploy** (self-hosted) - `Dockerfile` multi-stage (`oven/bun` build → `nginx:alpine`) + `nginx.conf`, port 80 za Traefikiem z Let's Encrypt

### Później
- **`@astrojs/node`** - adapter tylko pod API route lead-store (SQLite, `prerender = false`); reszta strony zostaje statyczna (`spec/vision.md`)

---

## 3. Decyzje architektoniczne

| Decyzja | Wybór | Uzasadnienie |
|---|---|---|
| CSS approach | **Vanilla CSS + scoped `<style>` w `.astro`** | Design oparty na CSS variables + `light-dark()`; Tailwind/SCSS nie dodałyby wartości |
| Theming | ~~**`light \| dark \| system` przez `light-dark()` + `color-scheme`**~~ → **dark-only** (`6e1b55e`) | `color-scheme: dark` na `:root` blokuje `light-dark()` na wartości ciemnej; jeden akcent (navy) |
| Naming convention plików | **kebab-case** | Decyzja właściciela; importy w PascalCase działają normalnie |
| FOUC prevention | ~~**Inline script w `<head>`, `data-theme` na `<html>` tylko gdy forced**~~ - usunięte razem z theming (`6e1b55e`) | Bez przełącznika motywu nie ma czego synchronizować przed paint |
| Active section | **IntersectionObserver z rootMargin** | Tańszy i bardziej deterministyczny niż scroll listener |
| Form (start) | **Mock + `console.info` payload + state machine na buttonie** | Bez wysyłki; zastąpione przez NocoDB |
| Form (teraz) | **NocoDB public shared form view** (`FormData` z polem `data` = JSON), honeypot | Self-hosted, bez backendu w repo |
| Form (kierunek) | **SQLite na serwerze Dokploy przez API route z adapterem Node** | Jedyny wyjątek od statycznego buildu (`spec/vision.md`) |
| Hosting | **Dokploy: `Dockerfile` (bun build → nginx) + `nginx.conf`** | Własny serwer, kontrola nad headerami i cache, statyczny `dist/` |
| Fonts | **Self-hosted Geist (variable woff2 w `public/fonts`)** | -1 preconnect, -50ms FCP, GDPR-friendly |
| Icons | **`astro-icon` + lucide** | Sprite, tree-shake, mniejszy HTML |

---

## 4. Struktura katalogów (plan z Fazy 0)

Aktualna struktura: `AGENTS.md`, sekcja Struktura.

```
kacperadler.pl/
├── public/
│   ├── fonts/                       # self-hosted Geist
│   ├── favicon.svg
│   ├── og-default.png
│   └── robots.txt
├── src/
│   ├── assets/
│   │   └── projects/                # cover images projektów
│   ├── components/
│   │   ├── ui/
│   │   │   ├── button.astro         # variants: primary | ghost | submit
│   │   │   ├── chip.astro
│   │   │   ├── tag.astro
│   │   │   ├── section-head.astro
│   │   │   └── icon.astro
│   │   ├── layout/
│   │   │   ├── base-head.astro      # meta, OG, fonts, JSON-LD
│   │   │   ├── theme-script.astro   # inline anty-FOUC
│   │   │   ├── header.astro
│   │   │   ├── nav.astro
│   │   │   ├── mobile-sheet.astro
│   │   │   └── footer.astro
│   │   ├── sections/                # tylko home
│   │   │   ├── hero.astro
│   │   │   ├── services.astro
│   │   │   ├── projects.astro
│   │   │   ├── how-i-work.astro
│   │   │   ├── experience.astro
│   │   │   └── contact.astro
│   │   ├── theme/
│   │   │   └── theme-fab.astro       # 3-state: light | dark | system
│   │   └── contact/
│   │       ├── contact-form.astro
│   │       └── contact-links.astro
│   ├── content/
│   │   ├── config.ts                # Zod schemas
│   │   ├── services/                # JSON
│   │   ├── projects/                # MDX (rich case-study w przyszłości)
│   │   ├── experience/              # JSON
│   │   └── blog/                    # MDX - PRZYSZŁOŚĆ
│   ├── data/
│   │   ├── site-config.ts
│   │   └── navigation.ts
│   ├── layouts/
│   │   ├── base-layout.astro
│   │   └── blog-post.astro          # PRZYSZŁOŚĆ
│   ├── pages/
│   │   ├── index.astro
│   │   ├── 404.astro
│   │   ├── rss.xml.ts               # PRZYSZŁOŚĆ
│   │   └── blog/                    # PRZYSZŁOŚĆ
│   │       ├── index.astro
│   │       └── [slug].astro
│   ├── scripts/                     # vanilla TS, ładowane przez <script>
│   │   ├── theme.ts
│   │   ├── nav-active.ts
│   │   ├── nav-scroll.ts
│   │   ├── mobile-sheet.ts
│   │   ├── flow-cycle.ts
│   │   ├── timeline-collapse.ts
│   │   ├── reveal.ts
│   │   └── contact-form.ts
│   ├── stores/
│   │   └── theme.ts                 # nanostores
│   ├── styles/
│   │   ├── global.css
│   │   ├── tokens.css               # CSS variables + light-dark() + @font-face
│   │   └── utilities.css
│   ├── lib/
│   │   ├── seo.ts
│   │   └── validators.ts
│   ├── actions/                     # Astro Actions - PRZYSZŁOŚĆ
│   │   └── index.ts
│   └── env.d.ts
├── tests/
│   ├── unit/
│   └── e2e/
├── astro.config.mjs
├── biome.json                       # generowany przez ultracite init
├── .prettierrc                      # tylko dla *.astro
├── tsconfig.json                    # strict + path aliases
├── package.json
├── .gitignore
├── .nvmrc                           # Node 20
└── README.md
```

---

## 5. Mapa funkcjonalności (z `example.html` → Astro)

| # | Funkcja | Lokalizacja |
|---|---|---|
| 1 | Motyw `light \| dark \| system` (3-state), persist do localStorage, system = `prefers-color-scheme` | `theme-script.astro` (inline w head) + `scripts/theme.ts` + `theme-fab.astro` |
| 2 | Sticky nav z `.scrolled` po >12px | `scripts/nav-scroll.ts` |
| 3 | Active section w menu (IO zamiast scroll) | `scripts/nav-active.ts` |
| 4 | CTA "Kontakt" przejmuje active w sekcji #contact | `scripts/nav-active.ts` (data-cta-active) |
| 5 | Mobile sheet (burger overlay) | `scripts/mobile-sheet.ts` + `mobile-sheet.astro` |
| 6 | Hero - chips technologiczne, hero-card | `sections/hero.astro` |
| 7 | Services grid (3 kafelki) | `sections/services.astro` + `content/services` |
| 8 | Projects grid (n kafelków) | `sections/projects.astro` + `content/projects` |
| 9 | How-I-work - auto-cycle flow nodes co 2.6s + hover sync | `scripts/flow-cycle.ts` (z Page Visibility API) |
| 10 | Experience timeline | `sections/experience.astro` + `content/experience` |
| 11 | Collapsible expand/collapse z animacją max-height | `scripts/timeline-collapse.ts` (+ reduced-motion) |
| 12 | Reveal-on-scroll | `scripts/reveal.ts` |
| 13 | Contact form - validation, button states, success | `contact-form.astro` + `scripts/contact-form.ts` |
| 14 | Footer z social linkami | `layout/footer.astro` |

### Form - state machine na buttonie (nowość vs prototyp)

```ts
type FormState = 'idle' | 'submitting' | 'success' | 'error';
```
- `aria-busy="true"` przy submitting
- `aria-live="polite"` na success message
- Mock: `console.info('[contact]', payload)` + setTimeout, gotowe do zamiany na `actions.contact()`
- CSS: `.btn-submit[data-state="success"]` - wizualny feedback

### Theme - anty-FOUC + 3-state (usunięte w `6e1b55e`, strona jest dark-only)

Model: `light | dark | system`. CSS używa `light-dark()` + `color-scheme: light dark` na `:root`. Kiedy user wymusi `light` lub `dark`, JS ustawia `data-theme` na `<html>`, co zmienia `color-scheme` i tym samym `light-dark()`. Tryb `system` = brak atrybutu = `prefers-color-scheme` rządzi automatycznie.

Inline w `<head>` przed pierwszym paint:
```js
(() => {
  try {
    const stored = localStorage.getItem('ka:theme');
    if (stored === 'light' || stored === 'dark') {
      document.documentElement.dataset.theme = stored;
    }
    // null lub "system" → brak atrybutu → @media (prefers-color-scheme) via light-dark()
  } catch {}
})();
```

**Uwaga:** `data-theme` przenosimy z `<body>` na `<html>` - krótszy CSS, lepsza zgodność z View Transitions. Akcent (navy/slate/royal) z prototypu wyrzucony - tylko jedna paleta (navy).

---

## 6. Fazy (historia)

Fazy 0-8 są zamknięte; dalsza praca idzie ticketami w `spec/features/`, nie fazami.

### Faza 0 - scaffolding
- [x] `bun create astro@latest` (Empty + TypeScript strict) - pre-existing
- [x] `git init`, `.gitignore`, `.nvmrc` (Node 22)
- [x] `bunx ultracite@latest init` (Biome) → `.astro` excluded, prettier formatuje
- [x] `prettier` + `prettier-plugin-astro` + `.prettierrc` + `.prettierignore`
- [x] Husky + lint-staged: pre-commit `lint-staged` + `astro check`
- [x] tsconfig path aliases: `@/components`, `@/layouts`, `@/lib`, `@/scripts`, `@/styles`, `@/data`, `@/content`, `@/stores`, `@/assets`
- [x] Skrypty w `package.json`: `dev`, `build`, `preview`, `astro`, `check`, `lint`, `format`, `test`
- [x] ~~`wrangler.toml`~~ - usunięty w KA0002 (hosting na Dokploy)
- [x] `astro.config.mjs` - `site` URL + vite alias mirror

### Faza 1 - fundamenty
- [x] `styles/tokens.css` - CSS variables (light/dark via `light-dark()`, navy single accent) + `@font-face`
- [x] `styles/global.css` - reset + body + `prefers-reduced-motion`
- [x] `public/fonts/` - Geist + Geist Mono (Variable woff2 z vercel/geist-font), `font-display: swap`
- [x] `components/layout/theme-script.astro` (inline anty-FOUC) - render w `<head>`
- [x] `layouts/base-layout.astro` z `<ClientRouter />`
- [x] `components/layout/base-head.astro` - meta, OG, Twitter, JSON-LD `Person` + `WebSite`, font preload (sitemap link odłożony do Fazy 6)
- [x] `data/site-config.ts`, `data/navigation.ts`, `lib/seo.ts`

### Faza 2 - layout shell
- [x] `layout/header.astro` (sticky wrap) + `layout/nav.astro` (desktop nav)
- [x] `layout/mobile-sheet.astro` (overlay; markup inert do F5)
- [x] `layout/footer.astro` + social links (icons via `astro-icon` + `@iconify-json/lucide`)
- [x] `theme/theme-fab.astro` - 3-state toggle (`light | dark | system`); markup + a11y, JS w F5

### Faza 3 - content collections
- [x] `src/content.config.ts` - Zod schemas (services, projects, experience, blog) z `import { z } from "astro/zod"` (Astro 5/6+ canonical)
- [x] Migracja danych z `example.html` do JSON: 3 services, 4 placeholder projects, 7 experience items
- [x] (placeholder) `content/blog/` + schema; brak wpisów do Fazy 8

### Faza 4 - sekcje home
- [x] UI primitives: `ui/{button,chip,tag,section-head}.astro`
- [x] `sections/hero.astro` (eyebrow z pulse, hero-grid, hero-card kv)
- [x] `sections/services.astro` (mapowanie z collection, sortowanie po `order`)
- [x] `sections/projects.astro` (mapowanie + cover gradient + glyph; filtruje `draft: true`)
- [x] `sections/how-i-work.astro` - zigzag timeline (file-tab header + 5 kart naprzemiennie L/R wokół centralnej osi, badge'e czasu na connectorach, statusbar footer); mobile = wszystko po prawej linii à la Experience
- [x] `sections/experience.astro` (timeline + collapsible markup; toggle JS w F5)
- [x] `sections/contact.astro` (info + form + contact-link), `contact/contact-form.astro`, `contact/contact-link.astro`
- [x] `pages/index.astro` - kompozycja sekcji
- [ ] `pages/projects/[slug].astro` - case-study route (decyzja sekcja 8); odłożone do real content

### Faza 5 - interakcje
- [x] ~~`scripts/theme.ts`~~ - wbudowany w `theme-fab.astro` (inline `<script>`, event delegation na `document`, sync na `astro:page-load`); wjechał już w F2 bo bez tego UX wyglądał jak bug
- [x] `scripts/nav-scroll.ts` - rAF-throttled scrollY > 12 → `.scrolled` na `[data-nav-wrap]`
- [x] `scripts/nav-active.ts` - IO + CTA contact special case (#contact ⇒ aktywne CTA, nie link)
- [x] `scripts/mobile-sheet.ts` - open/close + Escape + body-scroll lock + auto-close po kliknięciu linka
- [x] ~~`scripts/flow-cycle.ts`~~ - DROPPED. Sekcja how-i-work przeprojektowana na zigzag timeline (jeden komponent zamiast aside + list); auto-cycle stracił sens, hover state to czysty CSS
- [x] `scripts/timeline-collapse.ts` - class-based + CSS max-height transition (4000px gen. cap zamiast scrollHeight calc)
- [x] `scripts/reveal.ts` - IO once-only `.in` toggle, reduced-motion = instant final state
- [x] `scripts/contact-form.ts` - `idle | submitting | success | error` state machine, email/type/message validation, `console.info` mock z 600ms delay

### Faza 6 - SEO + a11y + polish ✅ DONE
- [x] `@astrojs/sitemap` + `public/robots.txt` (z linkiem do sitemap-index.xml)
- [x] OG image (1200×630) - `src/pages/og-default.png.ts` build-time endpoint przez sharp + SVG; zdjęcie po lewej (smart-crop), brand typografia po prawej
- [x] JSON-LD `Person` + `WebSite` - wjechało już w F1 (`src/lib/seo.ts`)
- [x] `aria-live="polite"` na form-success (F4), `aria-busy` na submit (F5), `aria-current="location"` na active nav link (F6)
- [x] `404.astro` - z BaseLayout(`noindex`), brand mark, dwa CTA (home + contact)
- [x] Skip-to-content link + globalne `:focus-visible` outline na każdym interactive (a11y baseline)
- [x] Heading hierarchy linear (h1 → h2 → h3) - fix `h4 → h3` w how-i-work step-cards po Lighthouse a11y findingu
- [x] **Lighthouse mobile 100/100/100/100** - Performance / A11y / Best Practices / SEO. Cel z sekcji 9 osiągnięty.
- [→ F7] **axe-core audit przez Playwright** - odłożone do F7 razem z E2E setupem (jeden wspólny `bun add -D @playwright/test @axe-core/playwright`)
- [→ post-deploy] Re-run Lighthouse z prawdziwej domeny po deployu na Dokploy - sanity check na real network / gzip / cache headers (zwykle wynik *lepszy* niż localhost)

### Faza 7 - copy improvement ✅ DONE

8 commitów per-sekcja (`copy(faza-7/0X): ...`), każdy z atomowym diffem do łatwego rewerta:

- [x] **`siteConfig`** - tagline + description przepisane (134 chars, sweet-spot dla Google snippet); `image` + `knowsAbout` w `personSchema` (Knowledge Graph signal); `social.x` usunięte. **`8488b0c`**
- [x] **Hero** - H1 + hero-sub zsynchronizowane z siteConfig (zero drift); hero-card "Współpraca" wycięty na rzecz portretu z `src/assets/me.jpg` przez Astro `<Image>`. **`d7d3eac`**
- [x] **Services** - title sharpened (`Trzy obszary, w których działam`), lede dodany; reframe descriptions na "Aplikacje X" zamiast "frontend dla X" (positioning shift). **`1d4969d`**
- [x] **Projects** - sekcja wyłączona pending real case-studies (3 miejsca: index.astro / nav / hero CTA). **`12eea3e`**
- [x] **How-I-work** - title (`Tak pracuję.`) + lede dodany; wszystkie 5 step descriptions humanized, krok 05 pivot z "wsparcia" na "monitoring/nadzór". **`66d0186`**
- [x] **Experience (infra)** - `lib/dates.ts` + schema migration (`startDate`/`endDate` zamiast hardkodowanego `period`); top 4 filter + drop collapsible (3 firmy hidden); section title "~ N lat" liczony automatycznie z najwcześniejszego startDate. **`fe9a600`**
- [x] **Experience (copy)** - wszystkie 7 wpisów humanized (ujawnione kontekst Moneya = side project + Web3 Devs Poland = niezależny projekt). **`87d0bd8`**
- [x] **Contact** - title (`Opowiedz mi, co budujesz.`) + lede dodany; lead text 1. osoba; "Mobile" radio → "Aplikacja mobilna"; spam disclaimer wyrzucony. **`94af7ee`**
- [x] **404** - title prop cleaner (`Strona nie znaleziona`); paragraph humanized; **+ global em-dash → hyphen sweep** (32 plików, anti-AI-detection signal). **`edce860`**

Cross-section consistency audit (literówki, ton, PL/EN mix) - ogarnięte at the same time podczas iteracji per-sekcji.

### Faza 8 - testy + deploy
*(Wcześniej Faza 7 - po copy improvement, żeby E2E asserts trafiały od razu w finalną treść.)*

- [→ F9] ~~Vitest unit: `validators.ts`~~ - odłożone, `lib/validators.ts` powstaje dopiero w F9 razem z Zod schematem real form action. Teraz nic do testowania jednostkowo.
- [x] **Playwright E2E** (`tests/e2e/*.spec.ts`):
  - nav active scroll (scrollIntoView per section → odpowiedni link `.active`) + click na link
  - contact CTA przejmuje active w sekcji `#contact`
  - mobile sheet open/close (hamburger, X, Escape z powrotem fokusu, auto-close po linku)
  - contact form: puste pola, invalid email, success, reset, błąd upstream, honeypot (NocoDB stubowany przez `page.route`)
  - skip-to-content link → focus reveals, Enter skacze do `#top`
  - ~~theme persist~~ - spec usunięty razem z theming (`6e1b55e`); ~~timeline expand/collapse~~ - collapsible wyleciał w Fazie 7
- [x] **axe-core a11y test** (`tests/e2e/a11y.spec.ts`, `@axe-core/playwright`) - `/` i 404, WCAG 2.1 AA
- [x] **CI workflow** (`.github/workflows/ci.yml`): job `build` (lint → check → prettier → build) + job `e2e` (Playwright chromium z cache)
- [x] **Deploy na Dokploy**: `Dockerfile` + `nginx.conf` w repo, container port 80, domena `kacperadler.pl` przez Traefik z Let's Encrypt
- [ ] **Post-deploy Lighthouse re-run** z prawdziwej domeny (sanity check)

### Faza 9 - real form submit (porzucona)
Plan z Astro Actions + Resend nie wszedł. Formularz wysyła do NocoDB (public shared form view, honeypot, eventy Umami `form-submit` / `form-error` / `form-honeypot`). Kierunek z `spec/vision.md`: leady w SQLite na serwerze Dokploy przez API route z adapterem Node, jako ticket.

### Faza 10 (przyszłość, jako tickety) - blog
- [ ] `bun astro add mdx` → `@astrojs/mdx` integration
- [ ] `pages/blog/index.astro` - lista z `getCollection('blog')`, sortowanie po `pubDate`
- [ ] `pages/blog/[slug].astro` - render MDX, TOC, prev/next
- [ ] `layouts/blog-post.astro` - meta na artykuł, breadcrumb, related posts
- [ ] `pages/rss.xml.ts` - `@astrojs/rss` feed
- [ ] Reading time, tagi, search (pagefind?)
- [ ] Per-post OG image (Satori / `@vercel/og`) generowany z tytułu

---

## 7. Deployment - Dokploy

1. Dokploy (własny serwer) buduje obraz z `Dockerfile` w repo:
   - stage `build`: `oven/bun:1.3.13-alpine`, `apk add fontconfig ttf-dejavu` (polskie diakrytyki w OG image), `bun install --frozen-lockfile`, `bun run build`
   - stage `serve`: `nginx:1.27-alpine` z `nginx.conf` i `dist/`
2. `nginx.conf`: gzip, security headers przez jeden zestaw `add_header` (Cache-Control z `map`, bo `add_header` nie dziedziczy między poziomami), immutable cache dla `/_astro/` i fontów, `/404.html` jako error page
3. Container port **80**, routing przez Traefik w Dokploy, certyfikat Let's Encrypt dla `kacperadler.pl`

Lokalny test obrazu:
```bash
docker build -t kacperadler-pl-test .
docker run --rm -p 8089:80 kacperadler-pl-test
```

---

## 8. Decyzje otwarte w czasie planu (rozstrzygnięte)

- **OG image generator** - statyczny PNG generowany w buildzie (`src/pages/og-default.png.ts`, sharp + SVG); per-post OG wróci z blogiem
- **Email obfuscation** - pominięte; email w zwykłym `mailto:`
- **Analytics** - Umami self-hosted (`analytics.kacperadler.pl`), bez cookies, tylko PROD
- **Real form provider** - NocoDB self-hosted; kierunek: SQLite przez API route (`spec/vision.md`)
- **Czy hostować case-studies projektów na osobnych podstronach?** - sekcja Projects schowana do czasu realnych case studies; wrócą jako Markdown/MDX w content collections (`spec/vision.md`)

---

## 9. Definicja "done" dla home

Przed deployem produkcyjnym:
- [ ] Lighthouse mobile: Performance ≥95, A11y 100, Best Practices 100, SEO 100
- [ ] CLS < 0.05, LCP < 2s, INP < 200ms (na 4G)
- [ ] ~~Brak FOUC theme przy pierwszym wejściu w light/dark~~ - nieaktualne, strona jest dark-only
- [ ] Działa bez JS (graceful degradation): treść widoczna, linki działają, form pokazuje natywną walidację
- [ ] `prefers-reduced-motion` szanowane wszędzie
- [ ] Keyboard nav: Tab przez wszystkie interaktywne, focus visible, Esc zamyka mobile sheet
- [ ] Screen reader: nav, form mają sensowne labele
- [ ] Test na realnym mobilnym device (iOS Safari, Android Chrome)

---

## 10. Co dalej

**Fazy 0-8 - DONE.** Lighthouse mobile 100×4 ✅, E2E + axe w CI, produkcja na Dokploy.

Dalsza praca idzie ticketami w `spec/features/<id>/ticket.md`; kierunki (oferta, lead store w SQLite, case studies, blog) są w `spec/vision.md`.
