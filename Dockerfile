# syntax=docker/dockerfile:1.7
# Multi-stage build: bun installs deps and runs astro build, then a
# lean nginx image serves the static dist/. Pinned bun version matches
# package.json's packageManager field so CI/local/prod all build the
# same way.

FROM oven/bun:1.3.13-alpine AS build
WORKDIR /app

# Sharp + librsvg need fontconfig and at least one sans font installed
# in the build environment - otherwise the SVG <text> in
# og-default.png.ts renders as tofu boxes. DejaVu Sans covers Polish
# diacritics that the tagline needs (ąćęłńóśźż).
RUN apk add --no-cache fontconfig ttf-dejavu

# Copy manifest + lockfile first so dependency install caches separately
# from source changes.
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Source + content collections + assets.
COPY . .

# Astro static build → /app/dist
RUN bun run build

# ---

FROM nginx:1.27-alpine AS serve

# Custom server block: gzip, security headers, fingerprint-aware cache
# rules, /404.html as the error page.
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Built site.
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

# nginx -g forwards SIGTERM correctly so Docker can stop the container
# gracefully without the 10s kill timeout.
CMD ["nginx", "-g", "daemon off;"]
