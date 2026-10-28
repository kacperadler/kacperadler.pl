/* Contact form state machine.
 *
 * State lives on two elements:
 *   - [data-contact-wrap] - drives the visible UX block (form vs.
 *     success card vs. error banner). Values:
 *       idle | submitting | error-validation | error-submit | success
 *   - [data-submit] button - drives button styling; mirrors the
 *     wrapper state but maps both error variants to "error".
 * While "submitting", every input, textarea and button of the form is
 * disabled, so nothing can be edited until the request settles; any
 * other state enables them again.
 *
 * Submit flow: validate client-side with lib/lead.ts's checkLead (the
 * same rules the server applies), drop silently if the honeypot is
 * filled, then POST the payload as JSON to /api/lead, which saves it in
 * SQLite. The company is optional (empty passes). The project types are
 * checkboxes: every checked one goes in `types`. Any answer other than
 * 2xx, or no answer, is "error-submit".
 *
 * Listeners are document-delegated so they survive ClientRouter
 * swaps. astro:page-load resets the wrapper to "idle" so navigating
 * back to the page never lands on a stale success/error view. */

import { checkLead, type Lead, orderedTypes } from "@/lib/lead";

declare global {
  interface Window {
    umami?: {
      track: (name: string, data?: Record<string, unknown>) => void;
    };
  }
}

type WrapState =
  | "idle"
  | "submitting"
  | "error-validation"
  | "error-submit"
  | "success";

// Optional-chained call: Umami isn't loaded in dev, may be blocked by
// ad-blockers, and visitors with Do Not Track are deliberately skipped
// by the tracker itself. All those cases are fine - just no-op.
function trackEvent(name: string, data?: Record<string, unknown>): void {
  window.umami?.track(name, data);
}

function getWrap(form: HTMLFormElement): HTMLElement | null {
  return form.closest<HTMLElement>("[data-contact-wrap]");
}

function setState(form: HTMLFormElement, state: WrapState): void {
  const wrap = getWrap(form);
  if (wrap) {
    wrap.dataset.state = state;
  }
  for (const control of form.querySelectorAll<
    HTMLInputElement | HTMLTextAreaElement | HTMLButtonElement
  >("input, textarea, button")) {
    control.disabled = state === "submitting";
  }
  const submit = form.querySelector<HTMLButtonElement>("[data-submit]");
  if (submit) {
    const buttonState =
      state === "error-validation" || state === "error-submit"
        ? "error"
        : state;
    submit.dataset.state = buttonState;
    submit.setAttribute("aria-busy", state === "submitting" ? "true" : "false");
  }
}

function setFieldInvalid(
  form: HTMLFormElement,
  name: string,
  invalid: boolean
): void {
  const field = form.querySelector<HTMLElement>(`[data-field="${name}"]`);
  if (!field) {
    return;
  }
  if (invalid) {
    field.dataset.invalid = "true";
  } else {
    delete field.dataset.invalid;
  }
}

function readPayload(form: HTMLFormElement): Lead {
  const data = new FormData(form);
  return {
    company: String(data.get("company") ?? "").trim(),
    email: String(data.get("email") ?? "").trim(),
    message: String(data.get("message") ?? "").trim(),
    types: data.getAll("type").map((type) => String(type).trim()),
  };
}

function validate(form: HTMLFormElement, payload: Lead): boolean {
  const check = checkLead(payload);
  setFieldInvalid(form, "email", !check.email);
  setFieldInvalid(form, "company", !check.company);
  setFieldInvalid(form, "type", !check.types);
  setFieldInvalid(form, "message", !check.message);
  return check.ok;
}

function isHoneypotTripped(form: HTMLFormElement): boolean {
  const data = new FormData(form);
  return String(data.get("website") ?? "").trim().length > 0;
}

async function submitLead(payload: Lead): Promise<boolean> {
  try {
    const res = await fetch("/api/lead", {
      body: JSON.stringify({ ...payload, website: "" }),
      headers: { "content-type": "application/json" },
      method: "POST",
    });
    return res.ok;
  } catch (err) {
    console.error("[contact] submit failed", err);
    return false;
  }
}

function clearState(form: HTMLFormElement): void {
  setState(form, "idle");
  setFieldInvalid(form, "email", false);
  setFieldInvalid(form, "company", false);
  setFieldInvalid(form, "type", false);
  setFieldInvalid(form, "message", false);
}

function resetForm(form: HTMLFormElement): void {
  form.reset();
  clearState(form);
}

// Capture phase: ClientRouter also listens for submit and would
// otherwise treat the relative-action form as an internal navigation
// (swapping the DOM and resetting our state). Running first lets us
// preventDefault before ClientRouter's bubble-phase handler sees it.
document.addEventListener(
  "submit",
  (event) => {
    const form = event.target;
    if (
      !(form instanceof HTMLFormElement && form.matches("[data-contact-form]"))
    ) {
      return;
    }
    event.preventDefault();

    // Honeypot hit - bot. Pretend everything's fine but don't actually
    // submit; loud rejection would help the bot iterate. Track
    // separately from real submits so honeypot hits don't inflate the
    // form-submit number.
    if (isHoneypotTripped(form)) {
      trackEvent("form-honeypot");
      setState(form, "success");
      return;
    }

    const payload = readPayload(form);
    if (!validate(form, payload)) {
      setState(form, "error-validation");
      return;
    }

    setState(form, "submitting");

    submitLead(payload).then((ok) => {
      setState(form, ok ? "success" : "error-submit");
      // The types go to Umami (comma-joined, in projectTypes' order) so the
      // dashboard can break submissions down by project category. The lead
      // store has the full record.
      trackEvent(ok ? "form-submit" : "form-error", {
        type: orderedTypes(payload.types).join(","),
      });
    });
  },
  true
);

// "Wyślij kolejną wiadomość" button on the success card resets the
// form back to a clean idle state. Document-delegated so it survives
// ClientRouter swaps.
document.addEventListener("click", (event) => {
  if (!(event.target instanceof Element)) {
    return;
  }
  const reset = event.target.closest<HTMLElement>("[data-form-reset]");
  if (!reset) {
    return;
  }
  const wrap = reset.closest<HTMLElement>("[data-contact-wrap]");
  const form = wrap?.querySelector<HTMLFormElement>("[data-contact-form]");
  if (form) {
    resetForm(form);
    form
      .querySelector<HTMLInputElement>('input[name="email"]')
      ?.focus({ preventScroll: true });
  }
});

// Clear the per-field invalid mark as soon as the user edits.
document.addEventListener("input", (event) => {
  if (!(event.target instanceof Element)) {
    return;
  }
  const field = event.target.closest<HTMLElement>("[data-field]");
  if (field) {
    delete field.dataset.invalid;
  }
});

document.addEventListener("change", (event) => {
  if (
    !(event.target instanceof HTMLInputElement) ||
    event.target.type !== "checkbox"
  ) {
    return;
  }
  const field = event.target.closest<HTMLElement>("[data-field]");
  if (field) {
    delete field.dataset.invalid;
  }
});

function syncOnLoad(): void {
  // Only nuke state (button/wrapper/invalid markers), never the field
  // values - the user might be returning to the page mid-fill.
  const form = document.querySelector<HTMLFormElement>("[data-contact-form]");
  if (form) {
    clearState(form);
  }
}

document.addEventListener("astro:page-load", syncOnLoad);
