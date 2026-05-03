/* Contact form state machine. States surfaced via data-state on the
 * submit button and data-invalid on the field wrappers.
 *
 * F5 mock: validate client-side, console.info the payload, simulate
 * a 600ms in-flight delay, then transition to success. F9 will swap
 * the setTimeout for an Astro Action call without changing this
 * file's surface.
 *
 * Listeners are document-delegated so they survive ClientRouter
 * swaps. The form's clean state (no data-invalid, button data-state
 * back to idle, success hidden) is restored on every astro:page-load
 * in case the user navigates away mid-submit. */

type FormState = "idle" | "submitting" | "success" | "error";

const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SUBMIT_DELAY_MS = 600;

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
  const messageOk = payload.message.length > 0;

  setFieldInvalid(form, "email", !emailOk);
  setFieldInvalid(form, "type", !typeOk);
  setFieldInvalid(form, "message", !messageOk);

  return emailOk && typeOk && messageOk;
}

function resetForm(form: HTMLFormElement): void {
  setState(form, "idle");
  setFieldInvalid(form, "email", false);
  setFieldInvalid(form, "type", false);
  setFieldInvalid(form, "message", false);
}

document.addEventListener("submit", (event) => {
  const form = event.target;
  if (
    !(form instanceof HTMLFormElement && form.matches("[data-contact-form]"))
  ) {
    return;
  }
  event.preventDefault();

  const payload = readPayload(form);
  if (!validate(form, payload)) {
    setState(form, "error");
    return;
  }

  setState(form, "submitting");

  // Mock the network round-trip. F9 replaces this with actions.contact().
  console.info("[contact]", payload);
  window.setTimeout(() => {
    setState(form, "success");
  }, SUBMIT_DELAY_MS);
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
  const form = document.querySelector<HTMLFormElement>("[data-contact-form]");
  if (form) {
    resetForm(form);
  }
}

document.addEventListener("astro:page-load", syncOnLoad);

export {};
