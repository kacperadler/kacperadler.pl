import { defineConfig, devices } from "@playwright/test";

// Use a non-default port so the preview server can run alongside an
// already-running `bun dev` (which holds 4321).
const PORT = 4329;
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

  // --ignore-lock keeps `astro preview` (Astro 7) in the foreground: without it the
  // CLI detaches when it detects an AI agent, and refuses to start while another
  // preview of this project holds the lock, so Playwright sees the process exit.
  webServer: {
    command: `bun run preview -- --port ${PORT} --ignore-lock`,
    reuseExistingServer: !process.env.CI,
    stderr: "pipe",
    stdout: "ignore",
    timeout: 120_000,
    url: BASE_URL,
  },
  workers: process.env.CI ? 1 : undefined,
});
