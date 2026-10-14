/* Home page copy that /llms-full.txt serves too, so both read one source:
 * the automation examples (#examples), the offer's pricing lede
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
      "Agent AI odpowiada na maile i wiadomości z czatu. Proste sprawy załatwia sam, trudne przekazuje człowiekowi z gotowym podsumowaniem.",
    tags: ["LLM", "MCP"],
    title: "Obsługa zapytań",
  },
  {
    description:
      "Faktury, umowy, CV, zamówienia. Dane trafiają do systemu same, bez ręcznego przepisywania.",
    tags: ["LLM", "API"],
    title: "Przetwarzanie dokumentów",
  },
  {
    description:
      "CRM, poczta, arkusze i systemy, których używacie, wymieniają się danymi automatycznie. Koniec z kopiuj-wklej.",
    tags: ["API", "MCP"],
    title: "Integracje narzędzi",
  },
  {
    description:
      "Dane z wielu źródeł w jednym miejscu, aktualne na bieżąco. Raport, który składał się godzinę, jest gotowy, zanim o niego poprosisz.",
    tags: ["API", "React"],
    title: "Raporty i dashboardy",
  },
  {
    description:
      "Gotowe programy nie pasują do Twojego procesu? Buduję aplikacje webowe i mobilne, CRM-y i panele dokładnie pod to, jak pracuje Twoja firma. Z AI tam, gdzie pomaga, bez AI tam, gdzie nie jest potrzebne.",
    tags: ["React", "React Native", "TypeScript"],
    title: "Aplikacje szyte na miarę",
  },
];

// The offer's lede: how pricing works. The audit credit is the audit
// step's own `note` (src/content/services/audit.json).
export const offerPricing =
  "Każdy projekt wyceniam indywidualnie. Wycenę dostajesz w 2–3 dni po rozmowie. Rozmowa i wycena są bezpłatne i do niczego nie zobowiązują.";

/* A project told as problem, solution and effect. `experience` is the id of
 * its entry in src/content/experience (company, logo, case study link); an
 * id with no entry fails the build (sections/cases.astro). */
export interface CaseHighlight {
  effect: string;
  experience: string;
  kind: string;
  problem: string;
  solution: string;
}

export const caseHighlights: readonly CaseHighlight[] = [
  {
    effect: "Codzienne narzędzie pracy całej firmy.",
    experience: "helpfind",
    kind: "Narzędzie wewnętrzne · B2B",
    problem:
      "Firma potrzebowała jednego narzędzia do codziennej pracy dla ponad 200 pracowników i partnerów.",
    solution:
      "Wewnętrzny CRM z integracjami z Gmailem i Weylo/Focus, obsługą bardzo długich list i własną biblioteką komponentów.",
  },
  {
    effect: "Ok. 200 użytkowników dziennie.",
    experience: "energiadirect",
    kind: "Aplikacja mobilna",
    problem:
      "Działający marketplace leadów dla branży OZE i budowlanej potrzebował aplikacji dla handlowców i wykonawców.",
    solution:
      "Aplikacja na iOS i Android, która daje dostęp do leadów w terenie.",
  },
];

export const about: readonly string[] = [
  "Od 2021 roku buduję oprogramowanie: od PwC, przez software house Apptension, po wewnętrzne systemy używane codziennie przez setki osób.",
  "Dziś łączę to doświadczenie z AI. Sam dowożę to, na co kiedyś trzeba było całego zespołu: analizę procesu, backend, frontend, integracje i wdrożenie.",
  "Pracuję z firmami jako ich partner technologiczny. Rozumiem biznes, tłumaczę technologię na ludzki język i biorę odpowiedzialność za efekt.",
];

export interface FaqItem {
  answer: string;
  question: string;
}

export const faq: readonly FaqItem[] = [
  {
    answer:
      "Od tego jest audyt. Sprawdzam Wasze procesy i mówię wprost, co się opłaca, a co nie. Jeśli nic, też to usłyszysz.",
    question: "Czy AI w ogóle ma sens w mojej firmie?",
  },
  {
    answer:
      "To zależy od zakresu. Wycenę dostajesz w 2–3 dni po bezpłatnej rozmowie, bez ukrytych kosztów.",
    question: "Ile to kosztuje?",
  },
  {
    answer:
      "Projektuję rozwiązania zgodnie z RODO. Ustalamy razem, gdzie trzymane są dane i które modele AI mogą je przetwarzać. Tam, gdzie to konieczne, korzystam z dostawców z umową powierzenia danych.",
    question: "Co z bezpieczeństwem danych?",
  },
  {
    answer:
      "Nie. AI to narzędzie, nie cel. Buduję też aplikacje webowe i mobilne, systemy wewnętrzne i integracje dopasowane do potrzeb firmy. Dobieram rozwiązanie do problemu, a nie problem do modnej technologii.",
    question: "Czy zajmujesz się tylko AI?",
  },
  {
    answer:
      "Nie. To moja robota. Ty znasz swój biznes, ja zamieniam to na działający system.",
    question: "Nie znam się na technologii. Czy to problem?",
  },
  {
    answer: "Pierwsze działające elementy zwykle po 1–2 tygodniach.",
    question: "Jak szybko zobaczę efekt?",
  },
  {
    answer:
      "Kod, dostępy i dokumentacja należą do Ciebie. Nie jesteś ode mnie uzależniony.",
    question: "Co, jeśli zakończymy współpracę?",
  },
  {
    answer:
      "Przyjmuję 1–2 projekty jednocześnie, żeby każdy dostał pełną uwagę.",
    question: "Ile masz dostępności?",
  },
];
