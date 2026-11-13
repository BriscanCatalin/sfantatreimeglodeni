import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  featuredEvents,
  formatEventDate,
  type EventRecord,
} from "@/lib/events";

export const Route = createFileRoute("/evenimente")({
  head: () => ({
    meta: [
      { title: "Evenimente – O pâine pe zi" },
      {
        name: "description",
        content:
          "Evenimentele Bisericii Penticostale Sfânta Treime din Glodeni.",
      },
    ],
  }),
  component: EventsPage,
});

function EventsPage() {
  const [events, setEvents] = useState<EventRecord[]>(featuredEvents);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let active = true;

    fetch("/api/public/events")
      .then(async (response) => {
        const result = (await response.json()) as {
          events?: EventRecord[];
          error?: string;
        };
        if (!response.ok || !Array.isArray(result.events)) {
          throw new Error(
            result.error ?? "Evenimentele nu au putut fi încărcate.",
          );
        }
        if (active) setEvents(result.events);
      })
      .catch((error: unknown) => {
        if (active) {
          setLoadError(
            error instanceof Error
              ? error.message
              : "Evenimentele nu au putut fi încărcate.",
          );
        }
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="min-h-screen">
      <header className="bg-accent text-accent-foreground px-6 md:px-12 py-8">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <Link to="/" className="font-serif text-xl">
            O pâine pe zi
          </Link>
          <Link to="/" className="text-sm underline underline-offset-4">
            Înapoi acasă
          </Link>
        </div>
      </header>

      <section className="px-6 md:px-12 py-16 md:py-24 max-w-6xl mx-auto">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-primary uppercase tracking-widest text-xs mb-3">
              Biserica Sfânta Treime · Glodeni
            </p>
            <h1 className="font-serif text-4xl md:text-5xl">Evenimente</h1>
            <p className="mt-4 max-w-2xl text-muted-foreground">
              Întâlniri, seri de cântare și alte evenimente ale comunității
              noastre.
            </p>
          </div>
          <a
            href="/admin/evenimente"
            className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-primary-foreground font-medium hover:opacity-90 transition"
          >
            Adaugă un eveniment
          </a>
        </div>

        {loadError && (
          <p
            role="alert"
            className="mt-8 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm"
          >
            {loadError}
          </p>
        )}

        <div className="mt-10 mx-auto max-w-4xl space-y-8">
          {events.map((event) => (
            <article
              key={event.id}
              className="overflow-hidden rounded-lg border bg-card"
            >
              {event.imageUrl ? (
                <a
                  href={event.imageUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Deschide afișul pentru ${event.title} la dimensiune originală`}
                  className="block bg-muted"
                >
                  <img
                    src={event.imageUrl}
                    alt={`Afiș pentru evenimentul ${event.title}`}
                    loading="lazy"
                    className="mx-auto max-h-[85vh] w-full object-contain"
                  />
                </a>
              ) : (
                <div
                  className="aspect-[4/3] w-full bg-secondary"
                  aria-hidden="true"
                />
              )}
              <div className="p-6">
                {event.imageUrl && (
                  <p className="mb-4 text-xs text-muted-foreground">
                    Apasă pe afiș pentru a-l deschide la dimensiune originală.
                  </p>
                )}
                <p className="text-primary text-sm font-medium">
                  {event.scheduleLabel ??
                    (event.date
                      ? `${formatEventDate(event.date)} · ${event.time}`
                      : event.time)}
                </p>
                <h2 className="mt-2 font-serif text-2xl">{event.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {event.organizer}
                </p>
                <p className="mt-4 text-sm leading-relaxed">
                  {event.description}
                </p>
                <dl className="mt-5 space-y-2 border-t pt-4 text-sm">
                  <div>
                    <dt className="inline font-medium">Locație: </dt>
                    <dd className="inline text-muted-foreground">
                      {event.venue}
                    </dd>
                  </div>
                  {event.entrance && (
                    <div>
                      <dt className="inline font-medium">Acces: </dt>
                      <dd className="inline text-muted-foreground">
                        {event.entrance}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            </article>
          ))}
        </div>
      </section>

      <footer className="bg-accent text-accent-foreground px-6 py-8 text-center">
        <p className="text-xs opacity-70">
          © {new Date().getFullYear()} Igor Lazăr
        </p>
      </footer>
    </main>
  );
}
