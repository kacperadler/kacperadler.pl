import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { expect, test } from "@playwright/test";

// The per-IP limit on /api/ and the client IP it keys on, both in nginx.conf,
// checked on the production nginx image and config in Docker. A stub server
// on 127.0.0.1:4321 stands in for Node and answers 200 with the
// X-Forwarded-For nginx passed on, whose last address is the client IP nginx
// resolved. The requests come from a client container with two ways to the
// server: a network in 10.0.0.0/8, the range nginx.conf trusts as Dokploy's
// (Traefik's side), and Docker's default bridge, which it does not.

const ROOT = fileURLToPath(new URL("../..", import.meta.url));
const SERVE_IMAGE = /^FROM\s+(nginx:\S+)\s+AS\s+serve$/m.exec(
  readFileSync(`${ROOT}Dockerfile`, "utf8")
)?.[1];
const NAME = `kacperadler-lead-rate-limit-${process.pid}`;
const SERVER = `${NAME}-server`;
const CLIENT = `${NAME}-client`;
const LEAD = JSON.stringify({
  email: "a@b.cd",
  message: "x",
  type: "ai",
  website: "",
});

const STUB_NODE = `server {
    listen 127.0.0.1:4321;
    default_type text/plain;
    return 200 "$http_x_forwarded_for";
}
`;

// One request per entry: "-" sends no X-Forwarded-For, anything else is sent
// as the header. Prints "<status> <first line of the body>" per request.
const SEND = `url=$1; shift
for xff in "$@"; do
  if [ "$xff" = - ]; then
    code=$(curl -s -o /tmp/body -w '%{http_code}' -X POST -H 'content-type: application/json' --data "$LEAD" "$url")
  else
    code=$(curl -s -o /tmp/body -w '%{http_code}' -X POST -H 'content-type: application/json' -H "X-Forwarded-For: $xff" --data "$LEAD" "$url")
  fi
  echo "$code $(head -n 1 /tmp/body)"
done`;

let stubDir = "";
// The server's address on each network, as the client reaches it.
let trustedUrl = "";
let untrustedUrl = "";
let clientBridgeIp = "";

const docker = (...args: string[]) =>
  execFileSync("docker", args, { encoding: "utf8", stdio: "pipe" }).trim();

const addresses = (container: string): Partial<Record<string, string>> => {
  const networks: Record<string, { IPAddress: string }> = JSON.parse(
    docker(
      "inspect",
      "--format",
      "{{json .NetworkSettings.Networks}}",
      container
    )
  );
  return Object.fromEntries(
    Object.entries(networks).map(([name, network]) => [name, network.IPAddress])
  );
};

// A /24 in 10.0.0.0/8 that no Docker network on this machine holds yet.
const createTrustedNetwork = (): void => {
  for (let attempt = 0; attempt < 10; attempt += 1) {
    const subnet = `10.${200 + Math.floor(Math.random() * 50)}.${Math.floor(Math.random() * 256)}.0/24`;
    try {
      docker("network", "create", "--subnet", subnet, NAME);
      return;
    } catch (error) {
      if (!String(error).includes("overlap")) {
        throw error;
      }
    }
  }
  throw new Error("no free /24 in 10.200.0.0/10 for the trusted network");
};

// Each post's status and, for a 200, the client IP nginx resolved.
const send = (
  url: string,
  forwardedFor: string[]
): { client: string | undefined; status: number }[] =>
  docker(
    "exec",
    "--env",
    `LEAD=${LEAD}`,
    CLIENT,
    "sh",
    "-c",
    SEND,
    "sh",
    url,
    ...forwardedFor
  )
    .split("\n")
    .map((line) => {
      const [status, ...body] = line.split(" ");
      return {
        client:
          status === "200" ? body.join(" ").split(", ").at(-1) : undefined,
        status: Number(status),
      };
    });

const statuses = (url: string, forwardedFor: string[]): number[] =>
  send(url, forwardedFor).map(({ status }) => status);

test.describe.configure({ mode: "serial" });

test.beforeAll(async () => {
  // The first run pulls the image (CI starts without it).
  test.setTimeout(120_000);
  if (!SERVE_IMAGE) {
    throw new Error("no `FROM nginx:<tag> AS serve` stage in the Dockerfile");
  }
  stubDir = mkdtempSync(join(tmpdir(), "kacperadler-rate-limit-"));
  writeFileSync(join(stubDir, "stub-node.conf"), STUB_NODE);
  createTrustedNetwork();
  docker(
    "run",
    "--detach",
    "--rm",
    "--name",
    SERVER,
    "--network",
    NAME,
    "--volume",
    `${ROOT}nginx.conf:/etc/nginx/conf.d/default.conf:ro`,
    "--volume",
    `${join(stubDir, "stub-node.conf")}:/etc/nginx/conf.d/stub-node.conf:ro`,
    SERVE_IMAGE
  );
  docker(
    "run",
    "--detach",
    "--rm",
    "--name",
    CLIENT,
    "--network",
    NAME,
    SERVE_IMAGE,
    "sleep",
    "600"
  );
  docker("network", "connect", "bridge", SERVER);
  docker("network", "connect", "bridge", CLIENT);

  const server = addresses(SERVER);
  const bridgeIp = addresses(CLIENT).bridge;
  if (!bridgeIp || bridgeIp.startsWith("10.")) {
    throw new Error(
      `the client's address on Docker's default bridge (${bridgeIp}) is missing or in 10.0.0.0/8, the range nginx.conf trusts: no untrusted path to test`
    );
  }
  clientBridgeIp = bridgeIp;
  trustedUrl = `http://${server[NAME]}/api/lead`;
  untrustedUrl = `http://${server.bridge}/api/lead`;

  // nginx is up once / answers (404: no pages are mounted). GET / is outside
  // /api/, so the wait takes nothing from the limit.
  await expect
    .poll(
      () =>
        docker(
          "exec",
          CLIENT,
          "curl",
          "-s",
          "-o",
          "/dev/null",
          "-w",
          "%{http_code}",
          `http://${server[NAME]}/`
        ),
      { timeout: 15_000 }
    )
    .toBe("404");
});

test.afterAll(() => {
  for (const args of [
    ["rm", "--force", SERVER, CLIENT],
    ["network", "rm", NAME],
  ]) {
    try {
      docker(...args);
    } catch {
      // Never created: beforeAll failed before it.
    }
  }
  if (stubDir) {
    rmSync(stubDir, { force: true, recursive: true });
  }
});

test.describe("/api/ rate limit behind nginx", () => {
  test("a client's 6th post at once gets 429, another client is unaffected", () => {
    const flooder = Array.from({ length: 7 }, () => "203.0.113.10");
    expect(statuses(trustedUrl, flooder)).toEqual([
      200, 200, 200, 200, 200, 429, 429,
    ]);

    expect(statuses(trustedUrl, ["203.0.113.11"])).toEqual([200]);
  });

  test("X-Forwarded-For names the client only from the trusted network", () => {
    expect(send(trustedUrl, ["198.51.100.7"])).toEqual([
      { client: "198.51.100.7", status: 200 },
    ]);
    // Traefik appends the address it saw: only the last one counts, an
    // address the client put before it does not.
    expect(send(trustedUrl, ["192.0.2.1, 198.51.100.8"])).toEqual([
      { client: "198.51.100.8", status: 200 },
    ]);

    expect(send(untrustedUrl, ["198.51.100.9"])).toEqual([
      { client: clientBridgeIp, status: 200 },
    ]);
  });

  test("from outside the trusted network a new X-Forwarded-For per post does not escape the limit", () => {
    // Eight posts, each naming a new client: the last two are refused, so
    // nginx counted them all against the one address they came from.
    const spoofed = Array.from({ length: 8 }, (_, i) => `198.51.100.${20 + i}`);
    expect(statuses(untrustedUrl, spoofed).slice(-2)).toEqual([429, 429]);
  });
});
