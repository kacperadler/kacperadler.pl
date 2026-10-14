/* Home page copy that /llms-full.txt serves too, so both read one source:
 * the automation examples (#examples), the notes under the offer
 * (#services), the case highlights (#cases), the about text (#about) and
 * the FAQ (#faq). Copy used only on the page stays in its section. */

export interface Automation {
  description: string;
  tags: readonly string[];
  title: string;
}

export const automations: readonly Automation[] = [
  {
    description:
      "Agent AI odpowiada na maile i czat, a trudne sprawy przekazuje człowiekowi.",
    tags: ["LLM", "MCP"],
    title: "Obsługa zapytań",
  },
  {
    description:
      "Faktury, umowy, CV i zamówienia trafiają do Twojego systemu jako dane, bez przepisywania.",
    tags: ["LLM", "API"],
    title: "Przetwarzanie dokumentów",
  },
  {
    description:
      "CRM, Gmail, arkusze i ERP wymieniają dane same, bez kopiuj-wklej.",
    tags: ["API", "MCP"],
    title: "Integracje",
  },
  {
    description: "Dane z wielu źródeł w jednym miejscu, aktualne na bieżąco.",
    tags: ["API", "React"],
    title: "Raporty i dashboardy",
  },
  {
    description:
      "Panele, CRM-y i aplikacje szyte pod Twój proces, w przeglądarce i na telefonie.",
    tags: ["React", "React Native", "TypeScript"],
    title: "Narzędzia wewnętrzne",
  },
];

// Under the offer's table: how pricing works, then the audit credit.
export const offerNotes: readonly string[] = [
  "Każdy projekt wyceniam indywidualnie. Wycenę dostajesz w 2–3 dni po rozmowie. Rozmowa i wycena są bezpłatne i do niczego nie zobowiązują.",
  "Koszt audytu odliczam od wdrożenia.",
];

/* A project told as problem, solution and scale. `experience` is the id of
 * its entry in src/content/experience (company, logo, case study link); an
 * id with no entry fails the build (sections/cases.astro). */
export interface CaseHighlight {
  experience: string;
  kind: string;
  problem: string;
  scale: string;
  solution: string;
}

export const caseHighlights: readonly CaseHighlight[] = [
  {
    experience: "helpfind",
    kind: "CRM wewnętrzny",
    problem:
      "Ponad 200 pracowników i partnerów potrzebowało jednego narzędzia do codziennej pracy, połączonego z pocztą i systemem Weylo/Focus.",
    scale: "200+ osób pracuje w nim codziennie.",
    solution:
      "Wewnętrzny CRM zintegrowany z Gmailem i Weylo/Focus, z szybkimi długimi listami i własną biblioteką komponentów.",
  },
  {
    experience: "energiadirect",
    kind: "Aplikacja mobilna",
    problem:
      "Działający marketplace z leadami dla branży OZE i budowlanej potrzebował aplikacji na telefon dla handlowców i wykonawców.",
    scale: "Średnio 200 użytkowników dziennie.",
    solution:
      "Aplikacja mobilna na iOS i Android, połączona z działającym marketplace'em.",
  },
];

export const about: readonly string[] = [
  "Od 2021 roku buduję oprogramowanie: od PwC, przez software house Apptension, po wewnętrzne systemy używane codziennie przez setki osób.",
  "Dziś łączę to doświadczenie z AI: sam dowożę to, na co kiedyś trzeba było całego zespołu.",
  "Pracuję z firmami jako ich partner technologiczny: rozumiem biznes, tłumaczę technologię na ludzki język i biorę odpowiedzialność za efekt.",
];

export interface FaqItem {
  answer: string;
  question: string;
}

export const faq: readonly FaqItem[] = [
  {
    answer:
      "Od tego jest audyt. Sprawdzam Twoje procesy i liczę, co się opłaca. Jeśli AI nie ma sensu, powiem Ci to wprost.",
    question: "Czy AI w ogóle ma sens w mojej firmie?",
  },
  {
    answer:
      "Zależy od zakresu. Wycenę dostajesz w 2–3 dni po bezpłatnej rozmowie, bez ukrytych kosztów.",
    question: "Ile to kosztuje?",
  },
  {
    answer:
      "Korzystam z AI przez API albo plany firmowe (np. Claude, ChatGPT), które nie trenują modeli na Twoich danych. Pliki i bazy zostają u Ciebie, a do AI trafia tylko to, czego wymaga zadanie.",
    question: "Co z bezpieczeństwem danych?",
  },
  {
    answer:
      "Kod i dokumentacja należą do Ciebie. Możesz je przekazać innej osobie lub firmie i rozwijać dalej.",
    question: "Co, jeśli przestaniesz ze mną współpracować?",
  },
  {
    answer:
      "Nie. To moja robota. Rozmawiamy o Twoich procesach, a technologię biorę na siebie.",
    question: "Nie znam się na technologii. Czy to problem?",
  },
  {
    answer: "Pierwsze działające elementy zwykle w 1–2 tygodnie.",
    question: "Jak szybko zobaczę efekt?",
  },
];
