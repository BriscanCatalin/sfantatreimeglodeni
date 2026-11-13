import { createFileRoute, Link } from "@tanstack/react-router";
import { posts } from "@/lib/posts";
import hero from "@/assets/download.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "O pâine pe zi – Igor Lazăr, Glodeni" },
      { name: "description", content: "Proiectul „O pâine pe zi” oferă pâine zilnic oamenilor nevoiași din Glodeni, Republica Moldova." },
      { property: "og:title", content: "O pâine pe zi – Igor Lazăr" },
      { property: "og:description", content: "Pâine zilnică și speranță pentru oamenii nevoiași din Glodeni." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});



function Index() {
  return (
    <main>
      <header className="relative min-h-[88vh] flex items-end overflow-hidden">
        <img src={hero} alt="Pâine proaspătă coaptă în Glodeni" width={1600} height={1008} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-overlay" />
        <nav className="absolute top-0 inset-x-0 flex justify-between items-center px-6 md:px-12 py-6 text-primary-foreground">
          <span className="font-serif text-xl">Igor Lazăr</span>
          <div className="flex gap-6 text-sm"><a href="#proiect">Proiectul</a><a href="#noutati">Noutăți</a><a href="#contact">Contact</a></div>
        </nav>
        <div className="relative px-6 md:px-12 pb-20 max-w-4xl text-primary-foreground">
          <p className="uppercase tracking-[0.3em] text-xs mb-4 opacity-80">Glodeni · Republica Moldova · din 2002</p>
          <h1 className="text-5xl md:text-7xl leading-[1.05]">O pâine pe zi</h1>
          <p className="mt-6 text-lg md:text-xl max-w-xl opacity-90">Pâinea cea de toate zilele, coaptă cu dragoste și dăruită celor nevoiași — un gest simplu care aduce speranță.</p>
          <a href="#proiect" className="inline-block mt-8 rounded-full bg-primary px-7 py-3 font-medium hover:opacity-90 transition">Descoperă proiectul</a>
        </div>
      </header>

      <section id="proiect" className="px-6 md:px-12 py-24 grid md:grid-cols-2 gap-16 max-w-6xl mx-auto">
        <div>
          <p className="text-primary uppercase tracking-widest text-xs mb-3">Povestea noastră</p>
          <h2 className="text-4xl leading-tight">Un proiect născut din credință și compasiune</h2>
        </div>
        <div className="space-y-5 text-muted-foreground text-lg leading-relaxed">
          <p>Proiectul „O pâine pe zi” a început în 2002, la inițiativa pastorului Ilie Jolța de la Biserica Penticostală Filadelfia din Oradea, care a propus Bisericii Penticostale Sfânta Treime din Glodeni să ofere oamenilor săraci câte o pâine pe zi.</p>
          <p>În 2005, biserica a achiziționat cuptoare pentru producerea pâinii, iar proiectul a căpătat amploare.</p>
        </div>
      </section>

      <section className="bg-secondary py-20 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-3 text-center gap-6">
          {[["2002","anul începerii"],["2005","brutăria proprie"],["365","pâini pe an pentru fiecare"]].map(([n,l])=>(
            <div key={n}><div className="font-serif text-4xl md:text-6xl text-primary">{n}</div><div className="mt-2 text-sm text-muted-foreground">{l}</div></div>
          ))}
        </div>
      </section>

      <section className="px-6 py-24 max-w-3xl mx-auto text-center">
        <blockquote className="font-serif text-2xl md:text-3xl leading-snug">„Trebuie să mă pocăiesc, că timp de o viață nu am sărutat pâinea, considerând că e un fapt normal să ai pâine zilnic.”</blockquote>
        <p className="mt-6 text-muted-foreground">— un diacon din județul Bihor, după prezentarea proiectului</p>
      </section>

      <section id="noutati" className="px-6 md:px-12 pb-24 max-w-6xl mx-auto">
        <h2 className="text-4xl mb-10">Noutăți</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map(p=>(
            <Link key={p.slug} to="/noutati/$slug" params={{ slug: p.slug }} className="group rounded-lg overflow-hidden bg-card border hover:shadow-lg transition">
              {p.img ? <img src={p.img} alt={p.title} loading="lazy" className="h-48 w-full object-cover group-hover:scale-105 transition" /> : <div className="h-48 bg-muted flex items-center justify-center font-serif text-5xl text-primary/40">❦</div>}
              <div className="p-6"><p className="text-xs text-muted-foreground">{p.date}</p><h3 className="mt-2 text-xl group-hover:text-primary transition">{p.title}</h3><p className="mt-2 text-sm text-muted-foreground">{p.excerpt}</p></div>
            </Link>
          ))}
        </div>
      </section>

      <footer id="contact" className="bg-accent text-accent-foreground px-6 md:px-12 py-16 text-center">
        <h2 className="text-3xl">Susține proiectul</h2>
        <p className="mt-3 opacity-80 max-w-lg mx-auto">Biserica Penticostală Sfânta Treime, Glodeni, Republica Moldova</p>
        <p className="mt-10 text-xs opacity-60">© {new Date().getFullYear()} Igor Lazăr</p>
      </footer>
    </main>
  );
}
