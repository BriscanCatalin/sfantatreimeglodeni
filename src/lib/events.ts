import rugulAprinsPoster from "@/assets/rugul-aprins-2026.png";

export interface EventRecord {
  id: string;
  title: string;
  organizer: string;
  date: string;
  time: string;
  venue: string;
  description: string;
  entrance: string;
  imageUrl: string | null;
}

export const featuredEvents: EventRecord[] = [
  {
    id: "rugul-aprins-2026",
    title: "Rugul Aprins",
    organizer: "Grupul Rugul Aprins",
    date: "2026-11-14",
    time: "18:00",
    venue: "Palatul de Cultură din Glodeni",
    description:
      "Seară de cântare și Cuvântul lui Dumnezeu, cu participarea Bisericii Sfânta Treime Glodeni.",
    entrance: "Intrare liberă",
    imageUrl: rugulAprinsPoster,
  },
];

export function formatEventDate(date: string): string {
  return new Intl.DateTimeFormat("ro-RO", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00.000Z`));
}
