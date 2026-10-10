/* Process steps - 5-stage flow used in the home page "Proces" section and
 * also served via /llms-full.txt for AI agents that want the full content
 * without parsing HTML. Single source of truth so both stay in sync. */

export interface ProcessStep {
  badge: string;
  description: string;
  icon: string;
  num: string;
  title: string;
}

export const processSteps: readonly ProcessStep[] = [
  {
    badge: "~ 30 min",
    description:
      "Krótkie spotkanie albo wymiana maili - co Ci wygodniej. Opowiadasz, co chcesz zbudować i po co; ja zadaję pytania, czasem niewygodne.",
    icon: "lucide:messages-square",
    num: "01",
    title: "Rozmowa",
  },
  {
    badge: "2–3 dni",
    description:
      "Po rozmowie dostajesz krótki dokument: co robimy, w jakiej kolejności, ile to zajmie i ile kosztuje. Bez ukrytych kosztów, bez niespodzianek w trakcie.",
    icon: "lucide:clipboard-list",
    num: "02",
    title: "Plan i wycena",
  },
  {
    badge: "podział na etapy",
    description:
      "Pracuję małymi etapami - co tydzień widzisz coś, co działa, nie obrazek. Gdy coś idzie nie tak, łatwiej to zauważyć i poprawić.",
    icon: "lucide:code",
    num: "03",
    title: "Realizacja",
  },
  {
    badge: "na bieżąco",
    description:
      "Nie musisz znać się na technologii. Mówisz „to powinno być szybsze”, „tu brakuje jasności”, „zmieńmy kolejność” - ja tłumaczę to na konkretne zmiany i pokazuję efekt.",
    icon: "lucide:message-circle",
    num: "04",
    title: "Feedback i iteracje",
  },
  {
    badge: "+ nadzór",
    description:
      "Po wdrożeniu zostaje monitoring. Łapię błędy zanim staną się problemem, mierzę performance, przygotowuję poprawki. Twój produkt nie jest sam.",
    icon: "lucide:rocket",
    num: "05",
    title: "Wdrożenie i opieka",
  },
];
