import { spawn } from "node:child_process";
import { once } from "node:events";
import { createInterface } from "node:readline";
import { fileURLToPath } from "node:url";
import { expect, test } from "@playwright/test";

// playwright.config.ts picks the ports of the preview and the dev server when
// a run starts, and the servers bind them only after the build. Two runs
// started together (two worktrees) must still get different ports, or the
// later preview dies on EADDRINUSE and fails a run with nothing broken.

const CONFIG = fileURLToPath(
  new URL("../../playwright.config.ts", import.meta.url)
);

// Loads the config the way the runner of another run would, prints the ports
// it picked and stays alive, holding them, until its stdin closes.
const LOAD = `
await import(process.env.CONFIG);
console.log(JSON.stringify([process.env.E2E_PORT, process.env.E2E_DEV_PORT]));
for await (const _ of process.stdin);
`;

const startRun = async () => {
  // Without the ports of this run in its env, the config picks its own.
  const { E2E_PORT: _port, E2E_DEV_PORT: _devPort, ...env } = process.env;
  const child = spawn("bun", ["-e", LOAD], {
    env: { ...env, CONFIG },
    stdio: ["pipe", "pipe", "inherit"],
  });
  const [line] = await once(createInterface(child.stdout), "line");
  return {
    end: async () => {
      child.stdin.end();
      await once(child, "exit");
    },
    ports: JSON.parse(line) as string[],
  };
};

test("two runs started together get four different ports", async () => {
  const first = await startRun();
  try {
    // Nothing listens on the first run's ports yet: its build is still on.
    const second = await startRun();
    try {
      expect(new Set([...first.ports, ...second.ports]).size).toBe(4);
    } finally {
      await second.end();
    }
  } finally {
    await first.end();
  }
});
