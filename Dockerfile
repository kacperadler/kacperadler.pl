# syntax=docker/dockerfile:1.7
# Multi-stage build: bun installs deps and runs astro build, a second
# bun stage installs the production node_modules the server needs, then
# one nginx image serves the static pages from dist/client/ and passes
# /api/ to the Node server in dist/server/ (the lead store). Pinned bun
# version matches package.json's packageManager field so CI/local/prod
# all build the same way.

FROM oven/bun:1.4.3-alpine AS build
WORKDIR /app

# Sharp + librsvg need fontconfig in the build environment. The sans text
# in og-default.png.ts is Geist from src/assets/fonts; the mono labels use
# DejaVu Sans Mono, which covers the Polish diacritics (ąćęłńóśźż) -
# without an installed font they render as tofu boxes.
RUN apk add --no-cache fontconfig ttf-dejavu

# Copy manifest + lockfile first so dependency install caches separately
# from source changes.
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Source + content collections + assets.
COPY . .

# Astro build → /app/dist/client (pages) + /app/dist/server (Node server)
RUN bun run build

# ---

# The server bundle imports astro and the Node adapter at run time.
# --ignore-scripts: the prepare script (husky) is a devDependency.
FROM oven/bun:1.4.3-alpine AS deps
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production --ignore-scripts

# ---

FROM nginx:1.30-alpine AS serve

# Node runs the lead store; node:sqlite is built in (Node 22.13+).
RUN apk add --no-cache nodejs

# Custom server block: gzip, security headers, fingerprint-aware cache
# rules, /404.html as the error page, /api/ passed to Node.
COPY nginx.conf /etc/nginx/conf.d/default.conf

WORKDIR /app
COPY --from=deps /app/node_modules /app/node_modules
COPY --from=build /app/dist /app/dist
COPY docker-start.sh /docker-start.sh

# The Node server listens only inside the container; nginx is the way in.
# /data is the Dokploy volume that keeps the SQLite file across deploys.
# RESEND_API_KEY, LEAD_NOTIFY_FROM and LEAD_NOTIFY_TO come from Dokploy's
# Environment tab (README.md), never from the image.
ENV HOST=127.0.0.1 PORT=4321 LEADS_DB_PATH=/data/leads.sqlite
RUN mkdir -p /data

EXPOSE 80

# docker-start.sh runs nginx and Node, passes SIGTERM on to both and
# exits when either one does, so Dokploy restarts the container.
CMD ["sh", "/docker-start.sh"]
