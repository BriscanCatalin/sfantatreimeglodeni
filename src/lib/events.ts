import childrenProgramPoster from "@/assets/program-copii-sambata.png";
import specialInvitationPoster from "@/assets/invitatie-speciala-nevazatori.png";
import rugulAprinsPoster from "@/assets/rugul-aprins-2026.png";

export interface EventRecord {
  id: string;
  title: string;
  organizer: string;
  date: string | null;
  time: string;
  venue: string;
  description: string;
  entrance: string;
  imageUrl: string | null;
  scheduleLabel?: string;
  isPermanent?: boolean;
}

export const featuredEvents: EventRecord[] = [
  {
    id: "program-copii-sambata",
    title: "Program pentru copii",
    organizer: "Biserica Sfânta Treime Glodeni",
    date: null,
    time: "10:00",
    venue:
      "Casa de rugăciune, str. Eminescu nr. 15 (vis-à-vis de parc), Glodeni",
    description:
      "În fiecare sâmbătă, toți copiii sunt invitați la o lecție biblică, lucru manual, concursuri, jocuri sportive și un prânz cald. Orice copil este binevenit!",
    entrance: "",
    imageUrl: childrenProgramPoster,
    scheduleLabel: "În fiecare sâmbătă · 10:00–13:00",
    isPermanent: true,
  },
  {
    id: "invitatie-speciala-nevazatori-2026",
    title: "Invitație specială",
    organizer: "Biserica Sfânta Treime Glodeni",
    date: "2026-11-22",
    time: "10:00",
    venue: "Biserica Sfânta Treime, Str. Mihai Eminescu nr. 11, Glodeni",
    description:
      "Biserica Sfânta Treime invită persoanele nevăzătoare din Glodeni la slujba de duminică dimineața. Cu prilejul Zilei Internaționale a Nevăzătorilor din 13 noiembrie, biserica pregătește o mică atenție pentru invitați.",
    entrance: "",
    imageUrl: specialInvitationPoster,
  },
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
