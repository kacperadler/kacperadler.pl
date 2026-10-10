/* llms-full.txt - extended machine-friendly content for AI agents that
 * want the full picture without parsing HTML. Includes service body
 * copy, process step descriptions, experience descriptions, and a
 * "how to engage" section. */

import { getCollection } from "astro:content";
import { processSteps } from "@/data/process";
import { siteConfig } from "@/data/site-config";
import { caseStudyPath, sortedCaseStudies } from "@/lib/case-studies";

export const prerender = true;

export async function GET(): Promise<Response> {
  const services = (await getCollection("services")).sort(
    (a, b) => a.data.order - b.data.order
  );

  const experience = (await getCollection("experience")).sort(
    (a, b) => a.data.order - b.data.order
  );

  const caseStudies = await sortedCaseStudies();

  const servicesBlock = services
    .map(
      (s, idx) =>
        `### ${String(idx + 1).padStart(2, "0")}. ${s.data.title}

${s.data.description}

**Stack**: ${s.data.tags.join(", ")}`
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

  const body = `# ${siteConfig.name} - ${siteConfig.role}

> ${siteConfig.tagline}

${siteConfig.description}

Pracuję async, w sprintach, z zespołami produktowymi w Polsce i Unii Europejskiej. Single-source pracy: ${siteConfig.url}

---

## Usługi

Cztery główne obszary; każdy z własnym stackiem dobranym pod kontekst projektu. React i TypeScript jako fundament, reszta dobiera się pod konkretny projekt.

${servicesBlock}

---

## Proces współpracy

Pięć etapów od pierwszej rozmowy do wdrożenia. Bez ceremonii, dużo komunikacji, miejsce na feedback na każdym etapie.

${processBlock}

---

## Współprace

Frontend dla firm z różnych branż - od korporacji (PwC, Apptension) po Web3 side-projekty (Payloo) i mobile zlecenia (Energia Direct). Łącznie 5+ lat w branży.

${experienceBlock}

---

${caseStudiesBlock}## Kontakt

Najszybciej przez formularz na ${siteConfig.url}#contact (odpowiadam w ciągu 24h) albo bezpośrednio:

- **Email**: ${siteConfig.email}
- **LinkedIn**: ${siteConfig.social.linkedin}
- **GitHub**: ${siteConfig.social.github}

## Co napisać w pierwszej wiadomości

Trzy rzeczy które przyspieszają rozmowę:

1. **Co budujesz** - kontekst produktu, problem który rozwiązuje, gdzie obecnie jesteś (pomysł / MVP / produkcja).
2. **W jakim terminie** - kiedy chcesz wystartować i ile czasu masz na realizację. Pomaga oszacować dostępność i scope.
3. **Co Cię blokuje** - najtrudniejszy element, niepewność techniczna, brak rąk do roboty. Mów wprost - łatwiej wycenić rzeczywiste potrzeby.

2-3 zdania wystarczą żeby zacząć rozmowę. Reszta przychodzi w pytaniach z mojej strony.
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
