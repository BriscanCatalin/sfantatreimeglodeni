import { createFileRoute, Link } from "@tanstack/react-router";
import { posts } from "@/lib/posts";
import hero from "@/assets/download.jpg";
import church from "@/assets/glodeni-biserica.jpeg";

const donationAccounts = [
  { currency: "MDL", iban: "MD38VI022512700000074MDL" },
  { currency: "EUR", iban: "MD51VI022512700000012EUR" },
  { currency: "USD", iban: "MD04VI022512700000010USD" },
];

const churchStructuredData = {
  "@context": "https://schema.org",
  "@type": "Church",
  name: "Biserica Penticostală Sfânta Treime",
  url: "https://sfantatreimeglodeni.com/",
  telephone: "+37369050161",
  email: "Igorlazar2274@gmail.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Str. Mihai Eminescu nr. 11",
    addressLocality: "Glodeni",
    addressCountry: "MD",
  },
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "Biserica Sfânta Treime Glodeni | O pâine pe zi",
      },
      {
        name: "description",
        content:
          "Biserica Penticostală Sfânta Treime din Glodeni, Republica Moldova. Programul slujbelor și al copiilor, evenimente și proiectul social „O pâine pe zi”.",
      },
      {
        property: "og:title",
        content: "Biserica Sfânta Treime Glodeni | O pâine pe zi",
      },
      {
        property: "og:description",
        content:
          "Programul bisericii, evenimente și proiectul social „O pâine pe zi” din Glodeni, Republica Moldova.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://sfantatreimeglodeni.com/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: "https://sfantatreimeglodeni.com/" },
    ],
  }),
  component: Index,
});



function Index() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(churchStructuredData),
        }}
      />
      <header className="relative min-h-[88vh] flex items-end overflow-hidden">
        <img src={hero} alt="Pâine proaspătă coaptă în Glodeni" width={1600} height={1008} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-overlay" />
        <nav className="absolute top-0 inset-x-0 flex flex-wrap justify-between items-center gap-y-3 px-6 md:px-12 py-6 text-primary-foreground">
          <span className="font-serif text-xl">Igor Lazăr</span>
          <div className="flex flex-wrap gap-x-4 gap-y-2 md:gap-x-6 text-xs md:text-sm"><a href="#proiect">Proiectul</a><a href="#noutati">Noutăți</a><Link to="/evenimente">Evenimente</Link><a href="#doneaza">Donează</a><a href="#contact">Contact</a></div>
        </nav>
        <div className="relative px-6 md:px-12 pb-20 max-w-4xl text-primary-foreground">
          <p className="uppercase tracking-[0.3em] text-xs mb-4 opacity-80">
            Biserica Penticostală Sfânta Treime · Glodeni · Republica Moldova ·
            din 2002
          </p>
          <h1 className="text-5xl md:text-7xl leading-[1.05]">O pâine pe zi</h1>
          <p className="mt-6 text-lg md:text-xl max-w-xl opacity-90">Pâinea cea de toate zilele, coaptă cu dragoste și dăruită celor nevoiași — un gest simplu care aduce speranță.</p>
          <a href="#proiect" className="inline-block mt-8 rounded-full bg-primary px-7 py-3 font-medium hover:opacity-90 transition">Descoperă proiectul</a>
        </div>
      </header>

      <section id="proiect" className="px-6 md:px-12 py-24 grid md:grid-cols-2 gap-16 max-w-6xl mx-auto">
        <div className="md:sticky md:top-20 md:self-start">
          <p className="text-primary uppercase tracking-widest text-xs mb-3">Povestea noastră</p>
          <h2 className="text-4xl leading-tight">Un proiect născut din credință și compasiune</h2>
        </div>
        <div className="text-muted-foreground text-lg leading-relaxed">
          <p>
            De la o pâine oferită cu dragoste, proiectul a crescut într-o
            lucrare de sprijin pentru copii, persoane cu dizabilități și familii
            aflate în nevoie.
          </p>
          <ol
            aria-label="Istoricul proiectului"
            className="relative mt-8 space-y-8 border-l border-primary/20 pl-7"
          >
            <li className="relative">
              <span
                aria-hidden="true"
                className="absolute -left-[1.9rem] top-1 h-3 w-3 rounded-full border-2 border-background bg-primary"
              />
              <p className="text-sm font-semibold uppercase tracking-widest text-primary">
                2002
              </p>
              <h3 className="mt-1 text-xl font-medium text-foreground">
                O pâine pentru cei în nevoie
              </h3>
              <p className="mt-2 text-base">
                La inițiativa pastorului Ilie Jolța de la Biserica Penticostală
                Filadelfia din Oradea, Biserica Penticostală Sfânta Treime din
                Glodeni începe să ofere zilnic pâine oamenilor săraci.
              </p>
            </li>
            <li className="relative">
              <span
                aria-hidden="true"
                className="absolute -left-[1.9rem] top-1 h-3 w-3 rounded-full border-2 border-background bg-primary"
              />
              <p className="text-sm font-semibold uppercase tracking-widest text-primary">
                2005
              </p>
              <h3 className="mt-1 text-xl font-medium text-foreground">
                Cuptoare pentru pâinea dăruită
              </h3>
              <p className="mt-2 text-base">
                Biserica achiziționează cuptoare proprii, iar proiectul se
                dezvoltă pentru a putea ajunge la mai mulți oameni.
              </p>
            </li>
            <li className="relative">
              <span
                aria-hidden="true"
                className="absolute -left-[1.9rem] top-1 h-3 w-3 rounded-full border-2 border-background bg-primary"
              />
              <p className="text-sm font-semibold uppercase tracking-widest text-primary">
                12 iulie 2015 · viața comunității
              </p>
              <h3 className="mt-1 text-xl font-medium text-foreground">
                O comunitate care crește
              </h3>
              <p className="mt-2 text-base">
                Biserica Sfânta Treime sărbătorește botezul a 12 persoane — un
                reper din viața spirituală a comunității în care se desfășoară
                proiectul.
              </p>
              <a
                className="mt-2 inline-block text-sm text-primary underline underline-offset-4 hover:opacity-80"
                href="https://www.facebook.com/share/p/14vY1j3uthm/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
              >
                Vezi relatarea despre botez
              </a>
            </li>
            <li className="relative">
              <span
                aria-hidden="true"
                className="absolute -left-[1.9rem] top-1 h-3 w-3 rounded-full border-2 border-background bg-primary"
              />
              <p className="text-sm font-semibold uppercase tracking-widest text-primary">
                De-a lungul timpului
              </p>
              <h3 className="mt-1 text-xl font-medium text-foreground">
                Grija ajunge aproape de oameni
              </h3>
              <p className="mt-2 text-base">
                Pastorul și familia sa vizitează persoane aflate în nevoie, iar
                cei săraci sau fără adăpost pot primi o masă la biserică după
                slujbă. Ajutorul este însoțit de sprijin în sezonul rece, seri
                de evanghelizare și activități creștine pentru copii.
              </p>
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm">
                <a
                  className="text-primary underline underline-offset-4 hover:opacity-80"
                  href="https://www.facebook.com/share/p/1Dk1cXHxTN/?mibextid=wwXIfr"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Vizite la domiciliu
                </a>
                <a
                  className="text-primary underline underline-offset-4 hover:opacity-80"
                  href="https://www.facebook.com/share/p/1Ho6VNfTbm/?mibextid=wwXIfr"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Masă după slujbă
                </a>
                <a
                  className="text-primary underline underline-offset-4 hover:opacity-80"
                  href="https://www.facebook.com/share/p/18Ut4SeVjv/?mibextid=wwXIfr"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Ajutor de iarnă
                </a>
                <a
                  className="text-primary underline underline-offset-4 hover:opacity-80"
                  href="https://www.facebook.com/share/p/19uez4cdRn/?mibextid=wwXIfr"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Seri de evanghelizare
                </a>
                <a
                  className="text-primary underline underline-offset-4 hover:opacity-80"
                  href="https://www.facebook.com/share/p/1HdyKRfZKY/?mibextid=wwXIfr"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Sprijin și activități
                </a>
              </div>
            </li>
            <li className="relative">
              <span
                aria-hidden="true"
                className="absolute -left-[1.9rem] top-1 h-3 w-3 rounded-full border-2 border-background bg-primary"
              />
              <p className="text-sm font-semibold uppercase tracking-widest text-primary">
                Relatările recente
              </p>
              <h3 className="mt-1 text-xl font-medium text-foreground">
                Ajutor concret, zi de zi
              </h3>
              <p className="mt-2 text-base">
                Biserica asigură prânzul, de luni până vineri, pentru 20 de
                copii din familii vulnerabile și pregătește lunar pachete pentru
                25 de persoane cu dizabilități și oameni din gospodării
                vulnerabile. Rugăciunea, donațiile și implicarea comunității
                ajută lucrarea să continue.
              </p>
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm">
                <a
                  className="text-primary underline underline-offset-4 hover:opacity-80"
                  href="https://www.facebook.com/share/p/1EiN65a7MG/?mibextid=wwXIfr"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Prânz pentru copii
                </a>
                <a
                  className="text-primary underline underline-offset-4 hover:opacity-80"
                  href="https://www.facebook.com/share/p/1JprRK9fnV/?mibextid=wwXIfr"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Pachete lunare
                </a>
                <a
                  className="text-primary underline underline-offset-4 hover:opacity-80"
                  href="https://www.facebook.com/share/p/17z2sJudDC/?mibextid=wwXIfr"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Rugăciune și sprijin
                </a>
                <a
                  className="text-primary underline underline-offset-4 hover:opacity-80"
                  href="https://www.facebook.com/share/p/1JAAPR8FCR/?mibextid=wwXIfr"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Proiectul în Glodeni
                </a>
                <a
                  className="text-primary underline underline-offset-4 hover:opacity-80"
                  href="https://www.facebook.com/share/1CVgGBkD5r/?mibextid=wwXIfr"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Apel pentru susținere
                </a>
                <a
                  className="text-primary underline underline-offset-4 hover:opacity-80"
                  href="https://www.facebook.com/share/p/1E18U5Ai3A/?mibextid=wwXIfr"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Mulțumiri donatorilor
                </a>
              </div>
            </li>
          </ol>
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

      <section id="doneaza" aria-labelledby="doneaza-heading" className="bg-secondary px-6 md:px-12 py-20">
        <div className="max-w-6xl mx-auto">
          <p className="text-primary uppercase tracking-widest text-xs mb-3">Susține proiectul</p>
          <h2 id="doneaza-heading" className="text-4xl">Donează</h2>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Poți susține proiectul „O pâine pe zi” prin transfer bancar în moneda dorită.
          </p>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            {donationAccounts.map(({ currency, iban }) => (
              <article key={currency} className="rounded-lg border bg-card p-6 text-center">
                <h3 className="font-serif text-2xl text-primary">{currency}</h3>
                <p className="mt-4 text-xs uppercase tracking-widest text-muted-foreground">IBAN</p>
                <p className="mt-2 break-all font-mono text-sm md:text-base">{iban}</p>
                <p className="mt-4 text-xs uppercase tracking-widest text-muted-foreground">Titular cont</p>
                <p className="mt-1 text-sm font-medium">A.O O PAINE PE ZI</p>
              </article>
            ))}
          </div>
          <p className="mt-6 text-sm text-muted-foreground">Banca: BC Victoriabank SA</p>
        </div>
      </section>

      <section id="contact" aria-labelledby="contact-heading" className="bg-accent text-accent-foreground px-6 md:px-12 py-16">
        <div className="max-w-6xl mx-auto">
          <p className="uppercase tracking-widest text-xs mb-3 opacity-80">Biserica Penticostală Sfânta Treime</p>
          <h2 id="contact-heading" className="text-3xl md:text-4xl">Contact și program</h2>
          <div className="mt-10 grid md:grid-cols-2 gap-10 items-start">
            <img
              src={church}
              alt="Casa de rugăciune din Glodeni"
              loading="lazy"
              className="w-full h-72 md:h-full min-h-[360px] rounded-lg object-cover"
            />
            <div className="grid sm:grid-cols-2 gap-8">
              <div>
                <h3 className="font-serif text-2xl">Contact</h3>
                <address className="mt-4 space-y-4 not-italic">
                  <p><span className="font-medium">Pastor:</span> Igor Lazăr</p>
                  <p><span className="font-medium">Telefon:</span> <a className="underline underline-offset-4 hover:opacity-80" href="tel:+37369050161">+373 690 50 161</a></p>
                  <p><span className="font-medium">Email:</span> <a className="break-all underline underline-offset-4 hover:opacity-80" href="mailto:Igorlazar2274@gmail.com">Igorlazar2274@gmail.com</a></p>
                  <p><span className="font-medium">Adresă:</span> Str. Mihai Eminescu nr. 11, Glodeni</p>
                </address>
              </div>
              <div>
                <h3 className="font-serif text-2xl">Programul bisericii</h3>
                <dl className="mt-4 space-y-4">
                  <div><dt className="font-medium">Luni · 18:00</dt><dd className="opacity-80">Studiu Biblic</dd></div>
                  <div><dt className="font-medium">Miercuri · 18:00</dt><dd className="opacity-80">Slujbă de Evanghelizare</dd></div>
                  <div><dt className="font-medium">Vineri · 18:00</dt><dd className="opacity-80">Rugăciune</dd></div>
                  <div>
                    <dt className="font-medium">Sâmbătă · 10:00–13:00</dt>
                    <dd className="opacity-80">Program pentru copii</dd>
                  </div>
                  <div><dt className="font-medium">Duminică · 10:00</dt><dd className="opacity-80">Laudă și închinare</dd></div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </section>
      <footer className="bg-accent text-accent-foreground px-6 md:px-12 pb-8 text-center">
        <p className="text-xs opacity-60">© {new Date().getFullYear()} Igor Lazăr</p>
      </footer>
    </main>
  );
}
