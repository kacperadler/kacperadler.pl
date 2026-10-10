import { expect, test } from "@playwright/test";

// The AI offer is what Kacper sells first (KA0026): it leads the services
// section, and the machine-readable summaries list services in that same order.

const SERVICES_SECTION = /^## Usługi$([\s\S]*?)^## /m;
const LLMS_ITEM = /^- \*\*(.+?)\*\* \(/gm;
const LLMS_FULL_ITEM = /^### \d{2}\. (.+)$/gm;

test("the AI offer comes first, on the page and in llms.txt / llms-full.txt", async ({
  page,
  request,
}) => {
  await page.goto("/");
  const onPage = (
    await page.locator("#services .mb-card h3").allTextContents()
  ).map((title) => title.trim());

  expect(onPage[0]).toContain("Agenci AI");

  const llms = await (await request.get("/llms.txt")).text();
  const llmsServices = llms.match(SERVICES_SECTION)?.[1] ?? "";
  expect([...llmsServices.matchAll(LLMS_ITEM)].map((m) => m[1])).toEqual(
    onPage
  );

  const llmsFull = await (await request.get("/llms-full.txt")).text();
  const fullServices = llmsFull.match(SERVICES_SECTION)?.[1] ?? "";
  expect([...fullServices.matchAll(LLMS_FULL_ITEM)].map((m) => m[1])).toEqual(
    onPage
  );
});
