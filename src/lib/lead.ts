/* The rules a lead from the contact form must meet, shared by the browser
 * (scripts/contact-form.ts) and the server (pages/api/lead.ts), so the two
 * can never disagree. Plain TS with no Node imports: the browser bundle
 * imports it too. */

/* A lead names one or more of these (the form's checkboxes); the leads
 * table stores the chosen values comma-joined in its `type` column, in
 * this order ("audit,implementation"). Rows saved before KA0075 keep the
 * old single values (ai, webapp, landing, mobile, tool); the form and the
 * API take only these. */
export const projectTypes = [
  { label: "Audyt AI", value: "audit" },
  { label: "Wdrożenie", value: "implementation" },
  { label: "Stała współpraca", value: "partner" },
  { label: "Inne", value: "other" },
] as const;

export const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const MAX_MESSAGE_LENGTH = 5000;

export interface Lead {
  email: string;
  message: string;
  types: readonly string[];
}

export interface LeadCheck {
  email: boolean;
  message: boolean;
  ok: boolean;
  types: boolean;
}

// Expects trimmed values; says which fields pass and whether all of them do.
// The types pass when there is at least one, each is a project type and
// none repeats.
export function checkLead(lead: Lead): LeadCheck {
  const email = EMAIL_RX.test(lead.email);
  const types =
    lead.types.length > 0 &&
    new Set(lead.types).size === lead.types.length &&
    lead.types.every((type) =>
      projectTypes.some((option) => option.value === type)
    );
  const message =
    lead.message.length > 0 && lead.message.length <= MAX_MESSAGE_LENGTH;
  return { email, message, ok: email && types && message, types };
}

// The chosen types in projectTypes' order: what the leads table stores
// (comma-joined) and what the notification and analytics name.
export function orderedTypes(types: readonly string[]): string[] {
  return projectTypes
    .filter((option) => types.includes(option.value))
    .map((option) => option.value);
}
