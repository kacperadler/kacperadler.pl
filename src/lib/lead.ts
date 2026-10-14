/* The rules a lead from the contact form must meet, shared by the browser
 * (scripts/contact-form.ts) and the server (pages/api/lead.ts), so the two
 * can never disagree. Plain TS with no Node imports: the browser bundle
 * imports it too. */

export const projectTypes = [
  { label: "AI i automatyzacje", value: "ai" },
  { label: "Aplikacja webowa", value: "webapp" },
  { label: "Landing page", value: "landing" },
  { label: "Aplikacja mobilna", value: "mobile" },
  { label: "Narzędzie wewn.", value: "tool" },
  { label: "Inne", value: "other" },
] as const;

export const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const MAX_MESSAGE_LENGTH = 5000;

export interface Lead {
  email: string;
  message: string;
  type: string;
}

export interface LeadCheck {
  email: boolean;
  message: boolean;
  ok: boolean;
  type: boolean;
}

// Expects trimmed values; says which fields pass and whether all of them do.
export function checkLead(lead: Lead): LeadCheck {
  const email = EMAIL_RX.test(lead.email);
  const type = projectTypes.some((option) => option.value === lead.type);
  const message =
    lead.message.length > 0 && lead.message.length <= MAX_MESSAGE_LENGTH;
  return { email, message, ok: email && type && message, type };
}
