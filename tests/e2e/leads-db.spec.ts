import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { DatabaseSync } from "node:sqlite";
import { expect, test } from "@playwright/test";
import { saveLead } from "../../src/lib/leads-db";

// lib/leads-db.ts on its own, no browser, on a fresh SQLite file per test.

const ISO_TIME = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

const freshPath = (): string =>
  join(mkdtempSync(join(tmpdir(), "kacperadler-leads-db-")), "leads.sqlite");

function readLeads(path: string): Record<string, unknown>[] {
  const db = new DatabaseSync(path, { readOnly: true });
  try {
    return db.prepare("SELECT * FROM leads ORDER BY id").all();
  } finally {
    db.close();
  }
}

test.describe("saveLead", () => {
  test("creates the file and the table, and keeps every lead with its time", () => {
    const path = freshPath();
    const before = new Date().toISOString();

    const first = saveLead(path, {
      email: "a@example.com",
      message: "Pierwsza",
      types: ["audit", "implementation"],
    });
    const second = saveLead(path, {
      email: "b@example.com",
      message: "Druga\nz nową linią i 'cudzysłowem'",
      types: ["other"],
    });

    expect(first).toBe(1);
    expect(second).toBe(2);
    const rows = readLeads(path);
    expect(rows.map(({ created_at, ...rest }) => rest)).toEqual([
      {
        email: "a@example.com",
        id: 1,
        message: "Pierwsza",
        type: "audit,implementation",
      },
      {
        email: "b@example.com",
        id: 2,
        message: "Druga\nz nową linią i 'cudzysłowem'",
        type: "other",
      },
    ]);
    for (const { created_at } of rows) {
      expect(created_at).toMatch(ISO_TIME);
      expect(String(created_at) >= before.slice(0, 19)).toBe(true);
    }
  });

  test("adds to a file that already holds leads", () => {
    const path = freshPath();
    const db = new DatabaseSync(path);
    db.exec(`CREATE TABLE leads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
      email TEXT NOT NULL,
      type TEXT NOT NULL,
      message TEXT NOT NULL
    )`);
    db.prepare("INSERT INTO leads (email, type, message) VALUES (?, ?, ?)").run(
      "old@example.com",
      "webapp",
      "Stary"
    );
    db.close();

    expect(
      saveLead(path, {
        email: "new@example.com",
        message: "Nowy",
        types: ["audit"],
      })
    ).toBe(2);
    expect(readLeads(path).map((row) => row.email)).toEqual([
      "old@example.com",
      "new@example.com",
    ]);
  });

  test("throws when the file cannot be created", () => {
    const path = join(freshPath(), "..", "missing-dir", "leads.sqlite");

    expect(() =>
      saveLead(path, { email: "a@example.com", message: "x", types: ["audit"] })
    ).toThrow();
  });
});
