/* Saves contact form leads in one SQLite file through node:sqlite, built
 * into Node (22.13+), so there is no native package to build. The file's
 * path comes in as an argument; the table is created on first use. Each
 * path is opened once and kept open for the life of the process. */

import { DatabaseSync, type StatementSync } from "node:sqlite";
import type { Lead } from "@/lib/lead";

const inserts = new Map<string, StatementSync>();

function insertInto(path: string): StatementSync {
  const cached = inserts.get(path);
  if (cached) {
    return cached;
  }
  const db = new DatabaseSync(path);
  // Wait instead of failing when someone reads the file while a lead is
  // written (the README's check command, a backup).
  db.exec("PRAGMA busy_timeout = 5000");
  db.exec(`CREATE TABLE IF NOT EXISTS leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    email TEXT NOT NULL,
    type TEXT NOT NULL,
    message TEXT NOT NULL
  )`);
  const insert = db.prepare(
    "INSERT INTO leads (email, type, message) VALUES (?, ?, ?)"
  );
  inserts.set(path, insert);
  return insert;
}

// Returns the new lead's id. Throws when the file cannot be opened or
// written.
export function saveLead(path: string, { email, message, type }: Lead): number {
  const { lastInsertRowid } = insertInto(path).run(email, type, message);
  return Number(lastInsertRowid);
}
