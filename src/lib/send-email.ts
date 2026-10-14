/* Sends one plain-text e-mail through Resend's HTTP API
 * (https://resend.com/docs/api-reference/emails/send-email) with fetch, no
 * mail library. Everything comes in as arguments: it reads no env and knows
 * nothing about what the e-mail is for. */

const RESEND_URL = "https://api.resend.com/emails";
const TIMEOUT_MS = 5000;

export interface Email {
  apiKey: string;
  from: string;
  subject: string;
  text: string;
  to: string;
}

// Resolves to the id Resend gives the e-mail. Rejects when Resend answers
// with an error, when the request fails, or after 5 s without an answer.
export async function sendEmail({
  apiKey,
  from,
  subject,
  text,
  to,
}: Email): Promise<string> {
  const res = await fetch(RESEND_URL, {
    body: JSON.stringify({ from, subject, text, to: [to] }),
    headers: {
      authorization: `Bearer ${apiKey}`,
      "content-type": "application/json",
    },
    method: "POST",
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  const body = (await res.json().catch(() => null)) as {
    id?: string;
    message?: string;
    name?: string;
  } | null;
  if (!(res.ok && body?.id)) {
    throw new Error(
      `Resend answered ${res.status}: ${body?.name ?? "?"} - ${body?.message ?? "no message"}`
    );
  }
  return body.id;
}
