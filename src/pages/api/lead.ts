/* POST /api/lead - the contact form's lead store, the one route rendered on
 * demand (Node adapter); every page stays prerendered.
 *
 * It takes JSON { email, type, message, website }. A filled honeypot
 * (website) gets 200 and saves nothing; a lead that fails lib/lead.ts's
 * checks gets 400; a valid one is saved in SQLite (lib/leads-db.ts) and gets
 * 200, or 500 when it cannot be saved. After the save an e-mail with the lead
 * number and project type (no visitor data) goes out through Resend
 * (lib/send-email.ts); a send that fails or is not configured is only logged.
 *
 * Settings come from process.env on each request, not import.meta.env,
 * which Astro would bake into the build:
 *   LEADS_DB_PATH                                     the SQLite file
 *   RESEND_API_KEY, LEAD_NOTIFY_FROM, LEAD_NOTIFY_TO  the notification
 * Logs carry the lead number only, never what the visitor wrote. */

import type { APIRoute } from "astro";
import { checkLead, projectTypes } from "@/lib/lead";
import { saveLead } from "@/lib/leads-db";
import { sendEmail } from "@/lib/send-email";

export const prerender = false;

const json = (status: number, body: Record<string, unknown>): Response =>
  Response.json(body, {
    headers: { "cache-control": "no-store" },
    status,
  });

export const POST: APIRoute = async ({ request }) => {
  let body: Record<string, unknown>;
  try {
    const parsed: unknown = await request.json();
    if (typeof parsed !== "object" || parsed === null) {
      return json(400, { error: "invalid" });
    }
    body = parsed as Record<string, unknown>;
  } catch {
    return json(400, { error: "invalid" });
  }
  const field = (name: string): string =>
    typeof body[name] === "string" ? body[name].trim() : "";

  if (field("website").length > 0) {
    return json(200, { ok: true });
  }

  const lead = {
    email: field("email"),
    message: field("message"),
    type: field("type"),
  };
  const check = checkLead(lead);
  if (!check.ok) {
    return json(400, {
      error: "invalid",
      fields: Object.entries({
        email: check.email,
        message: check.message,
        type: check.type,
      })
        .filter(([, ok]) => !ok)
        .map(([name]) => name),
    });
  }

  const dbPath = process.env.LEADS_DB_PATH;
  if (!dbPath) {
    console.error("[lead] LEADS_DB_PATH is not set, the lead is not saved");
    return json(500, { error: "store" });
  }
  let id: number;
  try {
    id = saveLead(dbPath, lead);
  } catch (error) {
    console.error("[lead] could not save the lead", error);
    return json(500, { error: "store" });
  }
  console.info(`[lead] saved #${id}`);

  const { LEAD_NOTIFY_FROM, LEAD_NOTIFY_TO, RESEND_API_KEY } = process.env;
  if (!(RESEND_API_KEY && LEAD_NOTIFY_FROM && LEAD_NOTIFY_TO)) {
    console.warn(
      `[lead] #${id}: no e-mail, RESEND_API_KEY, LEAD_NOTIFY_FROM or LEAD_NOTIFY_TO is not set`
    );
    return json(200, { ok: true });
  }
  const label =
    projectTypes.find((option) => option.value === lead.type)?.label ??
    lead.type;
  try {
    await sendEmail({
      apiKey: RESEND_API_KEY,
      from: LEAD_NOTIFY_FROM,
      subject: `Nowy lead #${id} - ${label}`,
      text: [
        `Nowy lead #${id} z formularza na kacperadler.pl.`,
        `Typ projektu: ${label}`,
        `Czas: ${new Date().toISOString()}`,
        "",
        "Email i treść są w bazie. W terminalu kontenera w Dokploy:",
        `node -e "const {DatabaseSync}=require('node:sqlite');console.table(new DatabaseSync(process.env.LEADS_DB_PATH,{readOnly:true}).prepare('select * from leads where id = ${id}').all())"`,
      ].join("\n"),
      to: LEAD_NOTIFY_TO,
    });
  } catch (error) {
    console.error(`[lead] #${id}: the e-mail was not sent`, error);
  }
  return json(200, { ok: true });
};
