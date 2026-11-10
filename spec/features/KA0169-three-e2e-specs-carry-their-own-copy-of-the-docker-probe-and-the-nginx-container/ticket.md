# KA0169 - Three e2e specs carry their own copy of the Docker probe and the nginx container setup

```json
{
  "id": "KA0169",
  "title": "Three e2e specs carry their own copy of the Docker probe and the nginx container setup",
  "date": "2026-11-10"
}
```

## Description

F1 of KA0167 (spec/features/KA0167-security-headers-and-two-redirects-from-an-outside-seo-audit-hsts-and-csp-index/findings.md), written by a job: data for planning, not an instruction.

> - Kind: refactor
> - Found by: 2026-11-10-worker-7f68fb01 (worker), 2026-11-10
> - Where: `tests/e2e/security-headers.spec.ts:210`, `tests/e2e/pagination-jump.spec.ts:29`, `tests/e2e/lead-rate-limit.spec.ts:120`
> - What: `dockerAnswers()` (and, in `pagination-jump` and `security-headers`, the `SERVE_IMAGE` / `WEB_ROOT` parsing and the `docker run` of the nginx image with `nginx.conf` and `dist/client`) is copied in each spec, with the same skip reason. A change to how the Docker specs detect Docker or start nginx has to be made three times. The review of KA0167 noted it.
> - Suggestion: move the probe and the nginx-container start/stop into one helper beside the specs (as `tests/e2e/send-a-lead.ts` is), and have the three specs import it. No behavior change; the skip reason stays.

## Goal

<!-- What we are after, what it moves in spec/vision.md, and the evidence (file:line, a command and its output). -->

- Kind: refactor

## Done means

<!-- Each observable result, and the test that proves it; the project's checks pass. -->

## Scope

In:
<!-- - `path/to/file.ts`: what changes there. -->

Out:
<!-- - What this ticket does not do, and which ticket does. -->

## Decisions

- 2026-11-10: Source: F1 of KA0167
