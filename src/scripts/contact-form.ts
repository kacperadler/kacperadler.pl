/* Contact form state machine. States surfaced via data-state on the
 * submit button and data-invalid on the field wrappers.
 *
 * On submit: validate client-side, drop silently if the honeypot is
 * filled, then POST the payload to NocoDB's public shared form view
 * endpoint. NocoDB column names are PascalCase (Email/Type/Message)
 * and must match the table view exactly.
 *
 * Listeners are document-delegated so they survive ClientRouter
 * swaps. The form's clean state (no data-invalid, button data-state
 * back to idle, success hidden) is restored on every astro:page-load
 * in case the user navigates away mid-submit. */

import { siteConfig } from "@/data/site-config";

type FormState = "idle" | "submitting" | "success" | "error";

const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_MESSAGE_LENGTH = 5000;

interface ContactPayload {
  email: string;
  message: string;
  type: string;
}

function setState(form: HTMLFormElement, state: FormState): void {
  const submit = form.querySelector<HTMLButtonElement>("[data-submit]");
  if (submit) {
    submit.dataset.state = state;
    submit.disabled = state === "submitting";
    submit.setAttribute("aria-busy", state === "submitting" ? "true" : "false");
  }
  const success = form.querySelector<HTMLElement>("[data-form-success]");
  if (success) {
    if (state === "success") {
      success.dataset.show = "true";
    } else {
      delete success.dataset.show;
    }
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
  try {
    const res = await fetch(siteConfig.nocodbFormUrl, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        Email: payload.email,
        Type: payload.type,
        Message: payload.message,
      }),
    });
    return res.ok;
  } catch (err) {
    console.error("[contact] submit failed", err);
    return false;
  }
}

function resetForm(form: HTMLFormElement): void {
  setState(form, "idle");
  setFieldInvalid(form, "email", false);
  setFieldInvalid(form, "type", false);
  setFieldInvalid(form, "message", false);
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
    // submit; loud rejection would help the bot iterate.
    if (isHoneypotTripped(form)) {
      setState(form, "success");
      return;
    }

    const payload = readPayload(form);
    if (!validate(form, payload)) {
      setState(form, "error");
      return;
    }

    setState(form, "submitting");

    submitToNocodb(payload).then((ok) => {
      setState(form, ok ? "success" : "error");
    });
  },
  true
);

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
  const form = document.querySelector<HTMLFormElement>("[data-contact-form]");
  if (form) {
    resetForm(form);
  }
}

document.addEventListener("astro:page-load", syncOnLoad);
