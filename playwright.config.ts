import {
  mkdirSync,
  mkdtempSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { createServer } from "node:net";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { defineConfig, devices } from "@playwright/test";

// Non-default port so the preview can run alongside `bun dev` (which holds 4321).
const DEFAULT_PORT = 4329;

// Resolves to whether nothing listens on `port`, on any address.
const isFree = (port: number): Promise<boolean> => {
  const { promise, resolve, reject } = Promise.withResolvers<boolean>();
  const server = createServer();
  server.once("error", (error: NodeJS.ErrnoException) => {
    if (error.code === "EADDRINUSE") {
      resolve(false);
    } else {
      reject(error);
    }
  });
  server.listen(port, () => server.close(() => resolve(true)));
  return promise;
};

// The probe frees the port again, and the server binds it only after the
// build, so a run in another worktree could probe the same port in between
// and lose its preview to EADDRINUSE. Each run therefore claims its ports in
// a folder the runs of every worktree share, as a file <port>.<runner pid>:
// it writes its file first, then gives the port up when it finds the file of
// another live run. Of two runs claiming one port at once, the one that reads
// later sees the other's file, so at most one keeps it. The file goes when the
// runner exits; one left by a killed runner names a dead pid and is ignored.
const CLAIMS = join(tmpdir(), "kacperadler-e2e-ports");

const isRunning = (pid: number): boolean => {
  try {
    process.kill(pid, 0);
    return true;
  } catch (error) {
    return (error as NodeJS.ErrnoException).code === "EPERM";
  }
};

const claim = (port: number): boolean => {
  mkdirSync(CLAIMS, { recursive: true });
  const own = join(CLAIMS, `${port}.${process.pid}`);
  writeFileSync(own, "");
  const taken = readdirSync(CLAIMS).some((name) => {
    const [claimed, pid] = name.split(".");
    return (
      claimed === String(port) &&
      Number(pid) !== process.pid &&
      isRunning(Number(pid))
    );
  });
  if (taken) {
    rmSync(own, { force: true });
    return false;
  }
  process.once("exit", () => rmSync(own, { force: true }));
  return true;
};

// The first port from `port` up that is free and claimed by no other run,
// tried one at a time. Counting up keeps the ports out of the OS ephemeral
// range, where any outgoing connection could take one before the server
// binds it.
const reservePort = async (port: number, last = port + 99): Promise<number> => {
  if (port > last) {
    throw new Error(`No free port up to ${last} for the e2e servers`);
  }
  if ((await isFree(port)) && claim(port)) {
    return port;
  }
  return reservePort(port + 1, last);
};

// E2E_PORT is used as given. Without it the run takes 4329, or the next port
// up when another server (`bun dev`, a run in another worktree) holds or has
// claimed it, so a stray server can neither fail the run nor stand in for this
// tree's build. Writing the result back makes the workers, which load this file
// again, use the same port as the runner instead of claiming another.
const PORT = process.env.E2E_PORT
  ? Number(process.env.E2E_PORT)
  : await reservePort(DEFAULT_PORT);
process.env.E2E_PORT = String(PORT);
const BASE_URL = `http://localhost:${PORT}`;

// The component catalogue (/ui) exists only on `astro dev`, so its specs run
// against a dev server of this tree on a second port, found and passed to the
// workers the same way: specs read E2E_DEV_PORT.
const DEV_PORT = process.env.E2E_DEV_PORT
  ? Number(process.env.E2E_DEV_PORT)
  : await reservePort(PORT + 1);
process.env.E2E_DEV_PORT = String(DEV_PORT);

// The preview's lead store (/api/lead): a fresh SQLite file per run unless
// E2E_LEADS_DB names one, passed to the workers the same way, so a spec can
// read back the lead it sent. RESEND_API_KEY is emptied so a key in the shell
// never sends a real e-mail from the run.
const LEADS_DB =
  process.env.E2E_LEADS_DB ??
  join(mkdtempSync(join(tmpdir(), "kacperadler-e2e-")), "leads.sqlite");
process.env.E2E_LEADS_DB = LEADS_DB;

export default defineConfig({
  forbidOnly: !!process.env.CI,
  fullyParallel: true,

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  retries: process.env.CI ? 2 : 0,
  testDir: "./tests/e2e",

  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
  },

  // The run builds first, so it tests this tree: `astro preview` serves whatever
  // dist/ holds, and a dist/ older than the specs failed them (h merge runs no
  // build of its own).
  // --ignore-lock keeps `astro preview` (Astro 7) in the foreground: without it the
  // CLI detaches when it detects an AI agent, and refuses to start while another
  // preview of this project holds the lock, so Playwright sees the process exit.
  // Playwright owns the process and kills it after the run. It never reuses a
  // server it did not start: one already on PORT fails the run instead.
  // E2E_FIXTURES=1 lets the build read tests/fixtures/case-studies while
  // there is no real case study (see src/content.config.ts). Before it, a
  // build with E2E_FIXTURES=none goes to dist-no-case-studies/, which
  // case-studies.spec.ts reads as files for the state with no case study.
  //
  // The dev server starts after the build (Playwright starts the servers in
  // order), so the two never write .astro/ at the same time. --ignore-lock
  // keeps `astro dev` in the foreground too and lets it run next to the
  // `bun dev` of the main checkout. E2E_DEV_NO_WATCH=1 makes it watch no
  // file (see astro.config.mjs): a commit or `astro check` in this tree
  // during the run cannot reload a page under a running spec.
  webServer: [
    {
      command: `E2E_FIXTURES=none bun run build -- --outDir dist-no-case-studies && bun run build && bun run preview -- --port ${PORT} --ignore-lock`,
      env: { E2E_FIXTURES: "1", LEADS_DB_PATH: LEADS_DB, RESEND_API_KEY: "" },
      reuseExistingServer: false,
      stderr: "pipe",
      stdout: "ignore",
      timeout: 120_000,
      url: BASE_URL,
    },
    {
      command: `bun run dev -- --port ${DEV_PORT} --ignore-lock`,
      env: { E2E_DEV_NO_WATCH: "1" },
      reuseExistingServer: false,
      stderr: "pipe",
      stdout: "ignore",
      timeout: 120_000,
      url: `http://localhost:${DEV_PORT}/ui`,
    },
  ],
  workers: process.env.CI ? 1 : undefined,
});
