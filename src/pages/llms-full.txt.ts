/* llms-full.txt - extended machine-friendly content for AI agents that
 * want the full picture without parsing HTML: the offer, the automation
 * examples, the selected projects, the process, the about text, the
 * experience, the case studies, the FAQ and how to get in touch. The copy
 * shared with the home page comes from src/data/home.ts and
 * src/data/process.ts. */

import { getCollection } from "astro:content";
import {
  about,
  automations,
  caseHighlights,
  faq,
  offerNotes,
} from "@/data/home";
import { processSteps } from "@/data/process";
import { siteConfig } from "@/data/site-config";
import { caseStudyPath, sortedCaseStudies } from "@/lib/case-studies";

export const prerender = true;

export async function GET(): Promise<Response> {
  const offer = (await getCollection("services")).sort(
    (a, b) => a.data.order - b.data.order
  );

  const experience = (await getCollection("experience")).sort(
    (a, b) => a.data.order - b.data.order
  );
  const companyById = new Map(
    experience.map((entry) => [entry.id, entry.data.company])
  );

  const caseStudies = await sortedCaseStudies();

  const offerBlock = offer
    .map(
      (s, idx) =>
        `### ${String(idx + 1).padStart(2, "0")}. ${s.data.title}

**Dla kogo**: ${s.data.audience}

**Co dostajesz**: ${s.data.description}

**Czas**: ${s.data.duration}`
    )
    .join("\n\n");

  const automationBlock = automations
    .map((a) => `- **${a.title}**: ${a.description}`)
    .join("\n");

  const highlightBlock = caseHighlights
    .map(
      (h) => `### ${companyById.get(h.experience) ?? h.experience} (${h.kind})

**Problem**: ${h.problem}

**Rozwiązanie**: ${h.solution}

**Skala**: ${h.scale}`
    )
    .join("\n\n");

  const processBlock = processSteps
    .map(
      (step) =>
        `### ${step.num}. ${step.title} (${step.badge})

${step.description}`
    )
    .join("\n\n");

  const experienceBlock = experience
    .map((item) => {
      const startYear = item.data.startDate.slice(0, 4);
      const endYear = item.data.endDate?.slice(0, 4);
      let period: string;
      if (item.data.current) {
        period = "teraz";
      } else if (item.data.badge) {
        period = `${item.data.badge}, ${startYear}`;
      } else {
        period = `${startYear}–${endYear}`;
      }
      return `### ${item.data.company} (${period})

**Rola**: ${item.data.role}

${item.data.description}`;
    })
    .join("\n\n");

  // The MDX body's own headings (## and below) are pushed two levels down so
  // they nest under the case study's ### heading.
  const caseStudyEntries = caseStudies
    .map(
      (c) => `### ${c.data.company} (${c.data.period})

**Rola**: ${c.data.role}

**Stack**: ${c.data.stack.join(", ")}

**Strona**: ${siteConfig.url}${caseStudyPath(c)}

${c.data.summary}

${(c.body ?? "").trim().replace(/^(#{1,4}) /gm, "##$1 ")}`
    )
    .join("\n\n");

  const caseStudiesBlock =
    caseStudies.length > 0
      ? `## Realizacje

Opisy wybranych współprac: kontekst, moja rola, stack i efekt. Lista: ${siteConfig.url}/realizacje/

${caseStudyEntries}

---

`
      : "";

  const faqBlock = faq
    .map((item) => `### ${item.question}\n\n${item.answer}`)
    .join("\n\n");

  const body = `# ${siteConfig.name} - ${siteConfig.role}

> ${siteConfig.tagline}

${siteConfig.description}

Dla firm w Polsce i Unii Europejskiej, które chcą mniej ręcznej roboty bez zatrudniania działu IT. Strona: ${siteConfig.url}

---

## Oferta

Od audytu do stałej opieki. Zacznij od kroku, który pasuje do Ciebie dziś.

${offerBlock}

${offerNotes.join(" ")}

---

## Co mogę zautomatyzować

${automationBlock}

---

## Wybrane projekty

${highlightBlock}

---

## Proces współpracy

${processBlock}

---

## O mnie

${about.join("\n\n")}

---

## Doświadczenie

${experienceBlock}

---

${caseStudiesBlock}## FAQ

${faqBlock}

---

## Kontakt

Najszybciej przez formularz na ${siteConfig.url}/#contact (odpowiadam w ciągu 24h) albo bezpośrednio:

- **Email**: ${siteConfig.email}
- **LinkedIn**: ${siteConfig.social.linkedin}
- **GitHub**: ${siteConfig.social.github}

## Co napisać w pierwszej wiadomości

1. **Co robicie ręcznie**
2. **Ile czasu to zajmuje**
3. **Czego szukasz** - audyt, wdrożenie czy stała współpraca

2–3 zdania wystarczą, żeby zacząć rozmowę.
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
