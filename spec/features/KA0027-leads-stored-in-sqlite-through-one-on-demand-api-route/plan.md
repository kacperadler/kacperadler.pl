# KA0027 - Plan

- Job: 2026-10-14-plan-ticket-spec-feature-194d8347
- Planned at: daf37114453a130b30ef98e152eaff584cfa1588

## Approach
One Node server is added to the static site. It handles only `POST /api/lead`. Every page stays prerendered HTML served by nginx.

- **Build:** `@astrojs/node` (11.1.7, peer `astro ^7.2.1`, from `npm view`) is added in `standalone` mode with `session: false`. `output` stays static. The build now writes two folders, `dist/client/` and `dist/server/`. All the HTML goes into `dist/client/`, so "`dist/` has their HTML" now means `dist/client/`.
- **Shared rules:** new `src/lib/lead.ts` holds the validation rules for both the browser and the server: `EMAIL_RX`, `MAX_MESSAGE_LENGTH = 5000`, a `checkLead()` that returns ok/not-ok per field, and the `projectTypes` list. The list moves here from `contact-form.astro`, so the server also turns away a project type that is not on the list.
- **New route `src/pages/api/lead.ts`** (`prerender = false`). It takes a JSON body `{ email, type, message, website }`.
  - If the honeypot field `website` is filled, it answers 200 and saves nothing.
  - Invalid data gets 400.
  - Valid data is saved with an `INSERT` into SQLite, into the file named by `LEADS_DB_PATH`. The table is `leads(id, created_at, email, type, message)` and is created on first use.
  - A database error gets 500.
  - After the save, it sends the e-mail through Resend's HTTP API with plain `fetch`, giving up after 5 s. A failed send, or missing settings, is only logged; the visitor still gets 200 and the lead stays saved.
  - Settings are read from `process.env` while running, not from `import.meta.env`, which Astro bakes in at build time.
- **E-mail content:** by default it carries no visitor data: lead number, project type, time, and the command to read the lead. The privacy policy says no outside processors are used (see Open questions).
- **`src/scripts/contact-form.ts`:**
  - `submitToNocodb` becomes `submitLead`, which sends JSON to `/api/lead`.
  - `validate()` uses `checkLead()`.
  - The states, the capture-phase submit handler and the Umami events (`form-submit`, `form-error`, `form-honeypot`) stay as they are.
  - `nocodbFormUrl` and every mention of NocoDB in code, comments, tests and docs are removed.
- **Container:** it stays one container on port 80. nginx serves `dist/client`, and `location /api/` is passed on to Node at `127.0.0.1:4321`. A small start script runs both processes; if either one exits, the container exits and Dokploy restarts it. `LEADS_DB_PATH=/data/leads.sqlite`, and `/data` is the Dokploy volume.
- **Left alone:**
  - the look of the form and its markup (except the `projectTypes` import);
  - all pages, Umami, the security headers and the 404 handling;
  - CI (Node 22 is enough);
  - no panel to read leads (out of Scope).
- **Database driver:** the plan uses the recommended option from `Not available directly`, the `node:sqlite` built into Node.

## Not available directly
- **Problem:** the ticket names `bun:sqlite` or `better-sqlite3`, and neither fits well.
  - Astro's command line runs on Node, not Bun: `node_modules/astro/bin/astro.mjs` starts with `#!/usr/bin/env node`, and the CI comment says Astro uses Node. So `astro preview` (the e2e server) and `astro dev` run the API route on Node, where `bun:sqlite` does not exist.
  - `better-sqlite3` is a native add-on. It is built at `bun install` time in the Bun build stage, but has to run under Node in the final image, and those can mismatch.
- **What I checked:**
  - `node:sqlite` works on local Node 24.21 (an insert returned `{ changes: 1, lastInsertRowid: 1 }`, with no warning printed) and in Bun 1.4.2.
  - `nginx:1.30-alpine` is Alpine 3.24, and its `apk` offers `nodejs` 24.18.1. I ran it in Docker.
  - `@types/node` 22.20.5 includes `sqlite.d.ts`.
  - Node 22 has had `node:sqlite` without a flag since 22.13. `[INFERENCE]` from memory of the Node changelog; I did not run Node 22. CI's `node-version: "22"` installs the newest 22.x.
- Option 1: `node:sqlite` (`DatabaseSync`), built into Node - cost: none (no new package, works in dev, preview, e2e and the image); risk: the API is still marked experimental in Node 22 and may print a warning there.
- Option 2: `better-sqlite3` - cost: a native package, plus a build toolchain or musl prebuilt binary in Docker and a `trustedDependencies` entry for Bun; risk: the add-on is built at `bun install` time in the Bun stage but has to load in the image's Node, and the two can mismatch.
- Option 3: `bun:sqlite` - cost: run the server with `bun dist/server/entry.mjs`, mark `bun:sqlite` external in Vite, add `@types/bun`, run e2e preview with `bun --bun`; risk: Astro and the adapter on the Bun runtime is not the documented path, and the form fails under `astro dev` on Node.
- Recommendation: Option 1.

## Files
- `package.json`, `bun.lock`: add `@astrojs/node` to `dependencies`.
- `astro.config.mjs`: `adapter: node({ mode: "standalone" })`, `session: false`.
- `src/lib/lead.ts` (new): `projectTypes`, `EMAIL_RX`, `MAX_MESSAGE_LENGTH`, `checkLead({ email, type, message })`. Plain TS with no Node imports, so the browser script can import it safely.
- `src/components/mb/contact-form.astro`: imports `projectTypes` from `@/lib/lead` instead of declaring it. Nothing else changes.
- `src/pages/api/lead.ts` (new):
  - `export const prerender = false`, and `POST` as described in Approach.
  - It opens the database once with `DatabaseSync(LEADS_DB_PATH)`, using `PRAGMA busy_timeout`, `CREATE TABLE IF NOT EXISTS` and a prepared `INSERT`.
  - A missing `LEADS_DB_PATH` or a database error is logged and returns 500.
  - The notifier calls `fetch("https://api.resend.com/emails", { headers: { Authorization: "Bearer …" }, signal: AbortSignal.timeout(5000) })` with `RESEND_API_KEY`, `LEAD_NOTIFY_FROM`, `LEAD_NOTIFY_TO`. If any of the three is missing it only logs `console.warn`. A response other than ok, or a thrown error, is logged with `console.error`.
  - Logs carry the lead number only, no personal data.
- `src/scripts/contact-form.ts`:
  - `submitLead` sends `fetch("/api/lead", { method: "POST", headers: { "content-type": "application/json" }, body })`, and `res.ok` decides success or error.
  - The `siteConfig` import and the NocoDB comments (header, line 200) are removed.
  - A JSON body also falls outside Astro's `checkOrigin` check, which only looks at form-type content types (Astro configuration reference). Same-origin `fetch` would pass that check anyway.
- `src/data/site-config.ts`: remove `nocodbFormUrl` and its comment.
- `Dockerfile`:
  - The `build` stage stays as it is.
  - New `deps` stage: `bun install --frozen-lockfile --production --ignore-scripts`. `--ignore-scripts` is needed because the `prepare: husky` script would fail without devDependencies.
  - The `serve` stage stays `nginx:1.30-alpine` plus `apk add --no-cache nodejs`, copies `dist` to `/app/dist` and `node_modules` to `/app/node_modules`, and sets `ENV HOST=127.0.0.1 PORT=4321 LEADS_DB_PATH=/data/leads.sqlite`.
  - It ends with `CMD ["sh", "/docker-start.sh"]`. Calling it through `sh` means the file needs no exec bit.
  - The header comment is updated.
- `docker-start.sh` (new):
  - Starts `node /app/dist/server/entry.mjs &` and `nginx -g 'daemon off;' &`.
  - A `trap` passes TERM/INT on to both.
  - `wait -n` returns when either one exits; the script then stops the other and exits with that code. BusyBox `wait -n` works in the image: I ran it.
- `nginx.conf`:
  - `root /app/dist/client`.
  - `location /api/ { proxy_pass http://127.0.0.1:4321; proxy_set_header Host $host; proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for; }`.
  - The `map` gets `~^/api/ "no-store"`.
  - The security headers stay at server level, so `always` also covers proxied responses.
- `playwright.config.ts`:
  - `E2E_LEADS_DB` is set the same way as `E2E_PORT`: if unset, it becomes `join(mkdtempSync(tmpdir()/…), "leads.sqlite")` and is written back into `process.env`, so the workers see the same path.
  - The preview `webServer.env` gets `LEADS_DB_PATH: E2E_LEADS_DB` and an empty `RESEND_API_KEY: ""`, so a key in the shell cannot send real e-mail.
  - The comment is updated.
- `tests/e2e/contact-form.spec.ts`:
  - `NOCODB_FORM_URL` and `MULTIPART_RX` become `LEAD_API = "**/api/lead"`.
  - The success test drops the stub and the multipart check. It posts through the real preview server, checks the JSON request body, the `success` state and the `form-submit` event, then reads the row with its unique e-mail from `E2E_LEADS_DB` using `node:sqlite`.
  - The reset, held-request and honeypot tests keep their stub, only retargeted to `LEAD_API`.
  - The "upstream failure" test (500) stays as the browser-side server error.
  - New request-level tests (`request.post`):
    - bad e-mail, unknown type and a 5001-character message get 400 with no row saved;
    - a filled honeypot gets 200 with no row saved.
- `tests/e2e/lead-api.spec.ts` (new, runs without a browser):
  - It points `LEADS_DB_PATH` at a temporary file and sets fake Resend settings.
  - It replaces `globalThis.fetch` once with a 500 response and once with a thrown error, then imports `POST` from `src/pages/api/lead.ts` and calls it with a `Request`.
  - It checks the response is 200, the row is saved and `console.error` was called. It restores the environment and `fetch` afterwards.
- `tests/e2e/send-a-lead.ts`: `LEAD_STORE = "**/api/lead"`, and the comment changes from "production NocoDB" to "the lead store and the notification".
- `tests/e2e/case-studies.spec.ts:19`: the path becomes `../../dist-no-case-studies/client/`.
- `src/pages/_ui/index.astro:9-11`, `src/pages/_ui/proposal/[id].astro:8-9`: comments: the forms would post to `/api/lead`, not to NocoDB.
- `src/pages/_ui/catalogue.astro:1420`: the note "nic nie trafia do NocoDB" becomes "nic nie trafia do `/api/lead`", in its own `copy(ui):` commit.
- `AGENTS.md`:
  - `## Stack`: static output plus `@astrojs/node` for the single route `/api/lead`.
  - `### Integracje runtime`, contact form: SQLite through `src/pages/api/lead.ts`, the Resend notification, the env vars, `process.env` rather than `import.meta.env`.
  - Remove the NocoDB "Don't" line.
  - `## Hosting`: nginx plus Node in one image, volume `/data`, `docker-start.sh`.
  - `## Komendy`: build output goes to `dist/client` and `dist/server`.
  - `## Wygląd`: the catalogue note about `contact-form.ts`.
  - `## Struktura`: `pages/api/lead.ts`, `lib/lead.ts`, `lead-api` in the spec list.
- `README.md`:
  - Stack line about the form; Node 22.13+ under Requirements; the build output in the commands table and the e2e paragraph; the stages in `## Deploy`.
  - A new section **"Leady i powiadomienia"**:
    - env vars: `RESEND_API_KEY`, `LEAD_NOTIFY_FROM` (an address in a domain verified in Resend), `LEAD_NOTIFY_TO`, plus `LEADS_DB_PATH` (set by the image to `/data/leads.sqlite`);
    - how to use the form locally (`LEADS_DB_PATH=./leads.sqlite bun dev`).
  - A new step-by-step **Dokploy guide**:
    1. Resend: verify the `kacperadler.pl` domain (DNS records) and create an API key with "Sending access".
    2. In the app, Advanced → Volumes/Mounts → Volume Mount: Volume Name `kacperadler-leads`, Mount Path `/data`. The file is `/data/leads.sqlite`. This step comes before the first deploy, or leads are lost on the next redeploy.
    3. Environment tab: the three variables, then Save.
    4. Deploy.
    5. Check:
       - send the form on the site;
       - the e-mail arrives;
       - the logs show `[lead] saved #<id>`;
       - in the container terminal, `node -e "const {DatabaseSync}=require('node:sqlite');console.table(new DatabaseSync('/data/leads.sqlite',{readOnly:true}).prepare('select * from leads order by id desc limit 5').all())"`.
  - The menu names come from the Dokploy docs (`docs.dokploy.com/docs/core/applications/advanced`, "Volumes/Mounts", "Volume Name", "Mount Path"); the coordinator checks them with the human in the real UI.

## Risks
- **Leads lost on redeploy without the volume:** without the mount, the file lives inside the container and disappears on redeploy. The README puts the volume step before deploy, and the Docker run below proves the file outlives the container.
- **The Node server dies:** `wait -n` ends the container, so Dokploy restarts it instead of nginx answering 502 forever. If Node is down, nginx answers 502, which the form shows as `error-submit` rather than a false success.
- **Slow `docker stop`:** a shell as PID 1 ignores SIGTERM. The `trap` passes it on; the worker checks that `docker stop` takes under 10 s.
- **The server bundle needs `node_modules` at run time** `[INFERENCE]`. It imports from `astro` and the adapter. The production `node_modules` is copied in, and `docker run` proves startup. `sharp` is a devDependency; only `/_image` would need it, and nginx never passes it on (it only forwards `/api/`).
- **Is `node:sqlite` left out of the bundle?** `[INFERENCE]`: Vite treats `node:` imports as built-ins. `bun run build` and the e2e run prove it.
- **The `dist/` layout changes:** the Dockerfile, `nginx.conf` and `case-studies.spec.ts` all move to `client/`. The sitemap should land in `dist/client/` without `/api/lead` `[INFERENCE]`; the worker checks `dist/client/sitemap-0.xml`.
- **Settings baked in at build time:** `import.meta.env` would freeze the key into the build. The route reads `process.env` on each request, and `.env*` stays in `.dockerignore`.
- **Resend outage or slowness:** capped at 5 s; the visitor still sees success and the lead is saved.
- **Parallel e2e on one file:** one preview process writes synchronously, and tests read only their own unique e-mails. `busy_timeout` covers someone reading while it writes.
- **Personal data in Resend or the logs:** the e-mail and the logs carry the lead number and project type only, so the privacy policy (`polityka-prywatnosci.md:62`, "Nie korzystam z zewnętrznych procesorów danych") stays true.
- **Vision checks:** no page changes, no cookies or trackers, and without JS the pages behave as today. Lighthouse and axe are not touched.

## How to test
- **Adapter, prerendering, SQLite:**
  - `bun run build`, then compare the `find dist/client -name '*.html'` list with the same list from a build of HEAD (the old `dist/`); they must match.
  - `dist/server/` exists and holds only the route.
  - The e2e success test reads the row back from SQLite.
  - The request-level 400 and honeypot tests prove the server-side checks.
- **The form posts to `/api/lead` with its states and Umami events, and NocoDB is gone:**
  - the retargeted `contact-form.spec.ts` (states, events, disabled while sending, reset, honeypot);
  - `send-a-lead.ts` control test (`ui-catalogue`);
  - a grep for `nocodb` (any case) across `src`, `tests`, `AGENTS.md` and `README.md` finds nothing.
- **Dockerfile and nginx** (results go in the worker's final message):
  1. `docker build -t kacperadler-pl-test .`
  2. `docker volume create ka-leads-test && docker run -d --name ka-test -p 8089:80 -v ka-leads-test:/data kacperadler-pl-test`
  3. `curl -i localhost:8089/` gives 200 with the security headers.
  4. `curl -i -X POST localhost:8089/api/lead -H 'content-type: application/json' -H 'Origin: http://localhost:8089' -d '{"email":"t@example.com","type":"ai","message":"test","website":""}'` gives 200 and `Cache-Control: no-store`. The logs show the "not configured" warning.
  5. `docker rm -f ka-test`, then read the row back in a new container: `docker run --rm -v ka-leads-test:/data kacperadler-pl-test node -e "…select * from leads…"`.
  6. `time docker stop` on a running container takes under 10 s.
- **e2e:** success (real database), validation errors (client-side tests plus server 400s), server error (500 shown as `error-submit`).
- **E-mail send failure:** `tests/e2e/lead-api.spec.ts` (500 and a thrown error: lead saved, 200, logged). The unconfigured case is the e2e success test, with an empty `RESEND_API_KEY`.
- **README Dokploy guide:** the coordinator goes through its steps with the human. The Docker run above follows the same volume path, `/data/leads.sqlite`.
- **Checks:** `bun run lint` (Biome, the format check included), `bun run check`, `bun run build`, `bun run test:e2e`, all green.

## Open questions
- Should the e-mail about a new lead include the visitor's e-mail and message, with Reply-To set to the visitor? That would make Resend an outside processor, which the privacy policy denies (`src/pages/polityka-prywatnosci.md:62`). The policy would then need to name Resend, and the sending region (Resend can send from an EU region). The plan defaults to an e-mail with only the lead number and project type, so the policy stays true, and you read the lead from the database.
