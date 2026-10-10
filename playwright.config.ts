import { createServer } from "node:net";
import { defineConfig, devices } from "@playwright/test";

// Non-default port so the preview can run alongside `bun dev` (which holds 4321).
const DEFAULT_PORT = 4329;

// Resolves to `port` when nothing listens on it (on any address), otherwise to
// a free port picked by the OS.
const freePort = (port: number): Promise<number> => {
  const { promise, resolve, reject } = Promise.withResolvers<number>();
  const server = createServer();
  server.once("error", (error: NodeJS.ErrnoException) => {
    if (error.code === "EADDRINUSE" && port !== 0) {
      resolve(freePort(0));
    } else {
      reject(error);
    }
  });
  server.listen(port, () => {
    const { port: bound } = server.address() as { port: number };
    server.close(() => resolve(bound));
  });
  return promise;
};

// E2E_PORT is used as given. Without it the run takes 4329, or a free port when
// another server (a preview from another worktree, `bun dev`) holds 4329, so a
// stray server can neither fail the run nor stand in for this tree's build.
// Writing the result back makes the workers, which load this file again, use
// the same port as the runner instead of probing the one our preview now holds.
const PORT = process.env.E2E_PORT
  ? Number(process.env.E2E_PORT)
  : await freePort(DEFAULT_PORT);
process.env.E2E_PORT = String(PORT);
const BASE_URL = `http://localhost:${PORT}`;

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
  webServer: {
    command: `E2E_FIXTURES=none bun run build -- --outDir dist-no-case-studies && bun run build && bun run preview -- --port ${PORT} --ignore-lock`,
    env: { E2E_FIXTURES: "1" },
    reuseExistingServer: false,
    stderr: "pipe",
    stdout: "ignore",
    timeout: 120_000,
    url: BASE_URL,
  },
  workers: process.env.CI ? 1 : undefined,
});
