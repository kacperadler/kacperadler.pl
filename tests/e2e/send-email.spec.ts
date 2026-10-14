import { expect, test } from "@playwright/test";
import { sendEmail } from "../../src/lib/send-email";

// lib/send-email.ts on its own, no browser: globalThis.fetch is swapped for a
// stub that answers the way Resend's API reference shows
// (resend.com/docs/api-reference/emails/send-email, .../errors).

const EMAIL = {
  apiKey: "re_test_key",
  from: "Strona <leady@kacperadler.pl>",
  subject: "Temat",
  text: "Treść\nw dwóch liniach",
  to: "kacper@example.com",
};

interface Call {
  init: RequestInit;
  url: string;
}

const realFetch = globalThis.fetch;
let calls: Call[] = [];

function stubFetch(answer: (init: RequestInit) => Promise<Response>): void {
  globalThis.fetch = (input, init = {}) => {
    calls.push({ init, url: String(input) });
    return answer(init);
  };
}

test.beforeEach(() => {
  calls = [];
});

test.afterEach(() => {
  globalThis.fetch = realFetch;
});

test.describe("sendEmail", () => {
  test("posts the e-mail to Resend with the key and resolves to its id", async () => {
    stubFetch(() =>
      Promise.resolve(
        Response.json({ id: "49a3999c-0ce1-4ea6-ab68-afcd6dc2e794" })
      )
    );

    await expect(sendEmail(EMAIL)).resolves.toBe(
      "49a3999c-0ce1-4ea6-ab68-afcd6dc2e794"
    );

    expect(calls).toHaveLength(1);
    const [{ init, url }] = calls as [Call];
    expect(url).toBe("https://api.resend.com/emails");
    expect(init.method).toBe("POST");
    expect(init.headers).toEqual({
      authorization: "Bearer re_test_key",
      "content-type": "application/json",
    });
    expect(JSON.parse(String(init.body))).toEqual({
      from: EMAIL.from,
      subject: EMAIL.subject,
      text: EMAIL.text,
      to: [EMAIL.to],
    });
  });

  test("rejects with Resend's error when it turns the e-mail away", async () => {
    stubFetch(() =>
      Promise.resolve(
        Response.json(
          {
            message: "The `to` field must be a `string`.",
            name: "validation_error",
            statusCode: 422,
          },
          { status: 422 }
        )
      )
    );

    await expect(sendEmail(EMAIL)).rejects.toThrow(
      "Resend answered 422: validation_error - The `to` field must be a `string`."
    );
  });

  test("rejects when the request itself fails", async () => {
    stubFetch(() => Promise.reject(new TypeError("fetch failed")));

    await expect(sendEmail(EMAIL)).rejects.toThrow("fetch failed");
  });

  test("gives up after 5 s without an answer", async () => {
    // Answers only when the request is aborted, the way fetch does.
    stubFetch((init) => {
      const { promise, reject } = Promise.withResolvers<Response>();
      init.signal?.addEventListener("abort", () => reject(init.signal?.reason));
      return promise;
    });

    const started = Date.now();
    await expect(sendEmail(EMAIL)).rejects.toThrow();
    expect(Date.now() - started).toBeGreaterThanOrEqual(4900);
    expect(Date.now() - started).toBeLessThan(7000);
  });
});
