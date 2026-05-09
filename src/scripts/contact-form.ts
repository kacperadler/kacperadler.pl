/* Contact form state machine.
 *
 * State lives on two elements:
 *   - [data-contact-wrap] — drives the visible UX block (form vs.
 *     success card vs. error banner). Values:
 *       idle | submitting | error-validation | error-submit | success
 *   - [data-submit] button — drives button styling; mirrors the
 *     wrapper state but maps both error variants to "error".
 *
 * Submit flow: validate client-side, drop silently if the honeypot
 * is filled, then POST the payload to NocoDB's public shared form
 * view as multipart/form-data with a single "data" part holding the
 * row JSON. NocoDB column names are PascalCase (Email/Type/Message).
 *
 * Listeners are document-delegated so they survive ClientRouter
 * swaps. astro:page-load resets the wrapper to "idle" so navigating
 * back to the page never lands on a stale success/error view. */

import { siteConfig } from "@/data/site-config";

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

const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_MESSAGE_LENGTH = 5000;

interface ContactPayload {
  email: string;
  message: string;
  type: string;
}

function getWrap(form: HTMLFormElement): HTMLElement | null {
  return form.closest<HTMLElement>("[data-contact-wrap]");
}

function setState(form: HTMLFormElement, state: WrapState): void {
  const wrap = getWrap(form);
  if (wrap) {
    wrap.dataset.state = state;
  }
  const submit = form.querySelector<HTMLButtonElement>("[data-submit]");
  if (submit) {
    const buttonState =
      state === "error-validation" || state === "error-submit"
        ? "error"
        : state;
    submit.dataset.state = buttonState;
    submit.disabled = state === "submitting";
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

function readPayload(form: HTMLFormElement): ContactPayload {
  const data = new FormData(form);
  return {
    email: String(data.get("email") ?? "").trim(),
    type: String(data.get("type") ?? "").trim(),
    message: String(data.get("message") ?? "").trim(),
  };
}

function validate(form: HTMLFormElement, payload: ContactPayload): boolean {
  const emailOk = EMAIL_RX.test(payload.email);
  const typeOk = payload.type.length > 0;
  const messageOk =
    payload.message.length > 0 && payload.message.length <= MAX_MESSAGE_LENGTH;

  setFieldInvalid(form, "email", !emailOk);
  setFieldInvalid(form, "type", !typeOk);
  setFieldInvalid(form, "message", !messageOk);

  return emailOk && typeOk && messageOk;
}

function isHoneypotTripped(form: HTMLFormElement): boolean {
  const data = new FormData(form);
  return String(data.get("website") ?? "").trim().length > 0;
}

async function submitToNocodb(payload: ContactPayload): Promise<boolean> {
  // NocoDB's public shared-view rows endpoint requires
  // multipart/form-data with a single part named "data" whose value
  // is a JSON string of the row fields - not separate parts per
  // column, not raw JSON. Both alternatives return "Something didn't
  // work as expected." (Inspected from a working UI submission in
  // DevTools.)
  const body = new FormData();
  body.append(
    "data",
    JSON.stringify({
      Email: payload.email,
      Type: payload.type,
      Message: payload.message,
    })
  );

  try {
    const res = await fetch(siteConfig.nocodbFormUrl, {
      method: "POST",
      body,
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

    submitToNocodb(payload).then((ok) => {
      setState(form, ok ? "success" : "error-submit");
      // Type goes to Umami so the dashboard can break submissions down
      // by project category. NocoDB still has the full record.
      trackEvent(ok ? "form-submit" : "form-error", { type: payload.type });
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
    event.target.type !== "radio"
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
