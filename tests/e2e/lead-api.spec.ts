import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { DatabaseSync } from "node:sqlite";
import { expect, test } from "@playwright/test";
import { POST } from "../../src/pages/api/lead";

// src/pages/api/lead.ts called directly, no browser and no server: what the
// route does with the lead store and the e-mail when Resend answers, fails or
// is not set up. globalThis.fetch is the route's only way to Resend; the stub
// answers in the shape of Resend's API reference.

const ENV_KEYS = [
  "LEADS_DB_PATH",
  "RESEND_API_KEY",
  "LEAD_NOTIFY_FROM",
  "LEAD_NOTIFY_TO",
] as const;
const LEAD = {
  email: "jan.kowalski@example.com",
  message: "Potrzebuję agenta AI do obsługi zgłoszeń.",
  type: "audit",
  website: "",
};

const realFetch = globalThis.fetch;
const realError = console.error;
const realWarn = console.warn;
const realInfo = console.info;
const savedEnv: Partial<Record<(typeof ENV_KEYS)[number], string>> = {};

let dbPath = "";
let fetchCalls: { init: RequestInit; url: string }[] = [];
let logged: { args: unknown[]; level: "error" | "warn" }[] = [];

function stubFetch(answer: () => Promise<Response>): void {
  globalThis.fetch = (input, init = {}) => {
    fetchCalls.push({ init, url: String(input) });
    return answer();
  };
}

function post(body: unknown): Promise<Response> {
  const request = new Request("http://localhost/api/lead", {
    body: JSON.stringify(body),
    headers: { "content-type": "application/json" },
    method: "POST",
  });
  return Promise.resolve(
    POST({ request } as unknown as Parameters<typeof POST>[0])
  );
}

function rows(): Record<string, unknown>[] {
  const db = new DatabaseSync(dbPath, { readOnly: true });
  try {
    return db.prepare("SELECT id, email, type, message FROM leads").all();
  } finally {
    db.close();
  }
}

test.beforeEach(() => {
  for (const key of ENV_KEYS) {
    savedEnv[key] = process.env[key];
  }
  dbPath = join(
    mkdtempSync(join(tmpdir(), "kacperadler-lead-api-")),
    "leads.sqlite"
  );
  process.env.LEADS_DB_PATH = dbPath;
  process.env.RESEND_API_KEY = "re_test_key";
  process.env.LEAD_NOTIFY_FROM = "Strona <leady@kacperadler.pl>";
  process.env.LEAD_NOTIFY_TO = "kacper@example.com";
  fetchCalls = [];
  logged = [];
  console.error = (...args: unknown[]) => logged.push({ args, level: "error" });
  console.warn = (...args: unknown[]) => logged.push({ args, level: "warn" });
  console.info = () => undefined;
});

test.afterEach(() => {
  for (const key of ENV_KEYS) {
    if (savedEnv[key] === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = savedEnv[key];
    }
  }
  globalThis.fetch = realFetch;
  console.error = realError;
  console.warn = realWarn;
  console.info = realInfo;
});

const SAVED_ROW = {
  email: LEAD.email,
  id: 1,
  message: LEAD.message,
  type: LEAD.type,
};

test.describe("POST /api/lead", () => {
  test("saves the lead and e-mails its number and type, without what the visitor wrote", async () => {
    stubFetch(() =>
      Promise.resolve(
        Response.json({ id: "49a3999c-0ce1-4ea6-ab68-afcd6dc2e794" })
      )
    );

    const res = await post(LEAD);

    expect(res.status).toBe(200);
    expect(rows()).toEqual([SAVED_ROW]);
    expect(fetchCalls).toHaveLength(1);
    const sent = JSON.parse(String(fetchCalls[0]?.init.body)) as {
      from: string;
      subject: string;
      text: string;
      to: string[];
    };
    expect(sent.from).toBe("Strona <leady@kacperadler.pl>");
    expect(sent.to).toEqual(["kacper@example.com"]);
    expect(sent.subject).toBe("Nowy lead #1 - Audyt AI");
    expect(sent.text).toContain("#1");
    for (const part of [sent.subject, sent.text]) {
      expect(part).not.toContain(LEAD.email);
      expect(part).not.toContain(LEAD.message);
    }
    expect(logged).toEqual([]);
  });

  test("keeps the lead and answers 200 when Resend answers with an error", async () => {
    stubFetch(() =>
      Promise.resolve(
        Response.json(
          {
            message: "Internal server error",
            name: "internal_server_error",
            statusCode: 500,
          },
          { status: 500 }
        )
      )
    );

    const res = await post(LEAD);

    expect(res.status).toBe(200);
    expect(rows()).toEqual([SAVED_ROW]);
    expect(fetchCalls).toHaveLength(1);
    expect(logged.map((entry) => entry.level)).toEqual(["error"]);
  });

  test("keeps the lead and answers 200 when Resend cannot be reached", async () => {
    stubFetch(() => Promise.reject(new TypeError("fetch failed")));

    const res = await post(LEAD);

    expect(res.status).toBe(200);
    expect(rows()).toEqual([SAVED_ROW]);
    expect(logged.map((entry) => entry.level)).toEqual(["error"]);
  });

  for (const key of [
    "RESEND_API_KEY",
    "LEAD_NOTIFY_FROM",
    "LEAD_NOTIFY_TO",
  ] as const) {
    test(`keeps the lead, sends nothing and warns when ${key} is not set`, async () => {
      stubFetch(() => Promise.resolve(Response.json({ id: "x" })));
      process.env[key] = "";

      const res = await post(LEAD);

      expect(res.status).toBe(200);
      expect(rows()).toEqual([SAVED_ROW]);
      expect(fetchCalls).toEqual([]);
      expect(logged.map((entry) => entry.level)).toEqual(["warn"]);
    });
  }

  test("answers 500 and sends no e-mail when the lead cannot be saved", async () => {
    stubFetch(() => Promise.resolve(Response.json({ id: "x" })));
    process.env.LEADS_DB_PATH = join(dbPath, "..", "missing", "leads.sqlite");

    const res = await post(LEAD);

    expect(res.status).toBe(500);
    expect(fetchCalls).toEqual([]);
    expect(logged.map((entry) => entry.level)).toEqual(["error"]);
  });

  test("answers 500 when LEADS_DB_PATH is not set", async () => {
    stubFetch(() => Promise.resolve(Response.json({ id: "x" })));
    delete process.env.LEADS_DB_PATH;

    const res = await post(LEAD);

    expect(res.status).toBe(500);
    expect(fetchCalls).toEqual([]);
  });

  test("answers 400 to a body that is not a JSON object", async () => {
    const res = await POST({
      request: new Request("http://localhost/api/lead", {
        body: "email=a@example.com",
        headers: { "content-type": "application/json" },
        method: "POST",
      }),
    } as unknown as Parameters<typeof POST>[0]);

    expect(res.status).toBe(400);
  });

  test("does not log what the visitor wrote", async () => {
    stubFetch(() => Promise.reject(new TypeError("fetch failed")));

    await post(LEAD);

    const text = JSON.stringify(logged.map((entry) => entry.args.map(String)));
    expect(text).not.toContain(LEAD.email);
    expect(text).not.toContain(LEAD.message);
  });
});
