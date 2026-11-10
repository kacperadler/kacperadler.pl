# KA0167 - Findings

What was discovered while doing this ticket but is not part of it: bugs, risks, gaps, and suggested changes. Workers add entries on their branch; the merge adds the passed review's notes of kind security, bug or risk. One entry per finding, numbered, never deleted: only its Status changes.

A finding ends in one of four statuses: `fixed in <commit>` (the branch fixed it), `ticket <id>` (a planning ticket carries it), `deferred (client summary)` (it goes to the client in a summary, not on the board), or `dropped (<reason>)`. `open` lives only until the merge, which settles every `Status: open` entry as the project's findings mode says: a planning ticket each (the default), one planning ticket for all of them, or `deferred (client summary)`.

## F1. Three e2e specs carry their own copy of the Docker probe and the nginx container setup

- Kind: refactor
- Found by: 2026-11-10-worker-7f68fb01 (worker), 2026-11-10
- Where: `tests/e2e/security-headers.spec.ts:210`, `tests/e2e/pagination-jump.spec.ts:29`, `tests/e2e/lead-rate-limit.spec.ts:120`
- What: `dockerAnswers()` (and, in `pagination-jump` and `security-headers`, the `SERVE_IMAGE` / `WEB_ROOT` parsing and the `docker run` of the nginx image with `nginx.conf` and `dist/client`) is copied in each spec, with the same skip reason. A change to how the Docker specs detect Docker or start nginx has to be made three times. The review of KA0167 noted it.
- Suggestion: move the probe and the nginx-container start/stop into one helper beside the specs (as `tests/e2e/send-a-lead.ts` is), and have the three specs import it. No behavior change; the skip reason stays.
- Status: open
