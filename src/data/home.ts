/* Home page copy that /llms-full.txt serves too, so both read one source:
 * the problems and their effects (#problems), the offer's pricing lede and
 * custom apps (#services), the case highlights (#cases), the about text
 * (#about) and the FAQ (#faq). Copy used only on the page stays in its section. */

/* The situations a visitor should recognise (#problems), each with the
 * effect an automation gives: the card's heading, its sentence and, under
 * a hairline, the effect. /llms.txt and /llms-full.txt list them as what
 * can be automated. */
export interface Problem {
  effect: string;
  text: string;
  title: string;
}

export const problems: readonly Problem[] = [
  {
    effect: "CRM, poczta i arkusze wymieniają się danymi same.",
    text: "Zespół godzinami kopiuje te same dane między systemami.",
    title: "Przepisywanie danych",
  },
  {
    effect:
      "Agent AI odpowiada na proste sprawy, a trudne przekazuje Wam z gotowym podsumowaniem.",
    text: "Odpowiadacie w kółko na podobne maile i zapytania klientów.",
    title: "Te same pytania",
  },
  {
    effect: "Raport jest gotowy, zanim o niego poprosisz.",
    text: "Co tydzień składacie raport z kilku Exceli.",
    title: "Ręczne raporty",
  },
  {
    effect: "Dane z dokumentów trafiają do systemu same.",
    text: "Ktoś ręcznie wypełnia i sprawdza dokumenty, faktury i umowy.",
    title: "Dokumenty i faktury",
  },
  {
    effect:
      "Asystent AI odpowiada każdemu w zespole na podstawie Waszych dokumentów.",
    text: "Odpowiedzi znają tylko konkretne osoby, a reszta czeka na nie.",
    title: "Wiedza w głowach",
  },
  {
    effect: "Na bezpłatnej rozmowie pokażę, od czego zacząć i ile to kosztuje.",
    text: "Wiesz, że AI mogłoby pomóc, ale nie wiesz, od czego zacząć.",
    title: "AI bez planu",
  },
];

// Under the offer's table (#services): custom apps, beside the three steps.
export const customApps = {
  description:
    "Gotowe programy nie pasują do Twojego procesu? Buduję aplikacje webowe i mobilne, CRM-y i panele dokładnie pod to, jak pracuje Twoja firma. Z AI tam, gdzie pomaga, bez AI tam, gdzie nie jest potrzebne.",
  title: "Aplikacje szyte na miarę",
};

// The offer's lede: how pricing works. The audit credit is the audit
// step's own `note` (src/content/services/audit.json).
export const offerPricing =
  "Każdy projekt wyceniam indywidualnie. Wycenę dostajesz w 2–3 dni po rozmowie. Rozmowa i wycena są bezpłatne i do niczego nie zobowiązują.";

/* A project told as problem, solution and effect, newest first.
 * `experiences` are the ids of its entries in src/content/experience (one,
 * or two for a project built for two companies): the card shows their
 * logos and links the first one's case study; an id with no entry or no
 * logo fails the build (sections/cases.astro). */
export interface CaseHighlight {
  effect: string;
  experiences: readonly string[];
  kind: string;
  problem: string;
  solution: string;
}

export const caseHighlights: readonly CaseHighlight[] = [
  {
    effect:
      "Pracuję przy niej na co dzień, a nowe funkcje trafiają do użytkowników na bieżąco.",
    experiences: ["rex"],
    kind: "Platforma rekrutacyjna",
    problem:
      "Platforma rex.hr, która łączy pracodawców, headhunterów i kandydatów, potrzebowała frontendu, który nadąży za jej rozwojem.",
    solution:
      "Buduję, optymalizuję i rozwijam jej frontend: nowe widoki, szybsze działanie i porządek w starszym kodzie.",
  },
  {
    effect:
      "Platforma działa od 19.10.2026 na leadbuster.pl i leadapartament.pl, a ja zapewniam jej wsparcie, utrzymanie i rozwój.",
    experiences: ["leadbuster", "leadapartament"],
    kind: "Marketplace leadów",
    problem:
      "Dwie firmy miały marketplace do sprzedaży leadów, ale istniejący kod nie był gotowy do startu.",
    solution:
      "Przejąłem kod, naprawiłem go i dostosowałem do wymagań każdej z firm, a potem uruchomiłem platformę.",
  },
  {
    effect: "Ponad 200 osób pracuje w nim codziennie.",
    experiences: ["helpfind"],
    kind: "Narzędzie wewnętrzne · B2B",
    problem:
      "Firma potrzebowała jednego narzędzia do codziennej pracy dla ponad 200 pracowników i partnerów.",
    solution:
      "W zespole budowałem wewnętrzny CRM z integracjami z Gmailem i Weylo/Focus, obsługą bardzo długich list i własną biblioteką komponentów, a także strony landingowe firmy.",
  },
  {
    effect: "Ok. 200 użytkowników dziennie.",
    experiences: ["energiadirect"],
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
    question: "Ile projektów prowadzisz jednocześnie?",
  },
];
