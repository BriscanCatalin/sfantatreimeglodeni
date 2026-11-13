import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { posts } from "@/lib/posts";
import hero from "@/assets/download.jpg";

export const Route = createFileRoute("/noutati/$slug")({
  loader: ({ params }) => {
    const post = posts.find((p) => p.slug === params.slug);
    if (!post) throw notFound();
    return post;
  },
  head: ({ loaderData }) => {
    const t = loaderData ? `${loaderData.title} – O pâine pe zi` : "Articol indisponibil";
    const d = loaderData?.excerpt ?? "";
    const meta = [
      { title: t }, { name: "description", content: d },
      { property: "og:title", content: t }, { property: "og:description", content: d },
      { property: "og:type", content: "article" }, { name: "twitter:card", content: "summary_large_image" },
    ];
    if (loaderData?.img) meta.push({ property: "og:image", content: loaderData.img }, { name: "twitter:image", content: loaderData.img });
    return { meta };
  },
  notFoundComponent: () => (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-3xl">Articolul nu a fost găsit</h1>
      <Link to="/" className="text-primary underline">Înapoi acasă</Link>
    </div>
  ),
  component: PostPage,
});

function PostPage() {
  const post = Route.useLoaderData();
  const i = posts.findIndex((p) => p.slug === post.slug);
  const others = posts.filter((p) => p.slug !== post.slug).slice(0, 3);
  const prev = posts[i + 1], next = posts[i - 1];
  return (
    <main>
      <header className="relative h-[60vh] min-h-[420px] flex items-end overflow-hidden">
        <img src={post.img ?? hero} alt={post.title} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-overlay" />
        <nav className="absolute top-0 inset-x-0 flex justify-between items-center px-6 md:px-12 py-6 text-primary-foreground">
          <Link to="/" className="font-serif text-xl">Igor Lazăr</Link>
          <Link to="/" hash="noutati" className="text-sm">← Toate noutățile</Link>
        </nav>
        <div className="relative px-6 md:px-12 pb-14 max-w-4xl mx-auto w-full text-primary-foreground">
          <p className="uppercase tracking-[0.3em] text-xs mb-4 opacity-80">{post.date}</p>
          <h1 className="text-4xl md:text-6xl leading-[1.1]">{post.title}</h1>
        </div>
      </header>

      <article className="px-6 py-20 max-w-2xl mx-auto">
        <p className="font-serif text-2xl leading-snug text-foreground mb-10">{post.excerpt}</p>
        <div className="space-y-6 text-lg leading-relaxed text-muted-foreground">
          {post.body.map((b, k) => <p key={k}>{b}</p>)}
        </div>
        <div className="mt-12 pt-8 border-t flex flex-wrap justify-between gap-4 text-sm">
          {prev ? <Link to="/noutati/$slug" params={{ slug: prev.slug }} className="hover:text-primary">← {prev.title}</Link> : <span />}
          {next && <Link to="/noutati/$slug" params={{ slug: next.slug }} className="hover:text-primary text-right">{next.title} →</Link>}
        </div>
      </article>

      {post.gallery && (
        <section aria-labelledby="galerie-foto" className="px-6 md:px-12 pb-20 max-w-6xl mx-auto">
          <h2 id="galerie-foto" className="text-3xl mb-8">Galerie foto</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {post.gallery.map((photo) => (
              <img
                key={photo.src}
                src={photo.src}
                alt={photo.alt}
                loading="lazy"
                className="h-72 md:h-96 w-full rounded-lg object-cover"
              />
            ))}
          </div>
        </section>
      )}

      <section className="bg-secondary px-6 md:px-12 py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl mb-8">Citește și</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {others.map((p) => (
              <Link key={p.slug} to="/noutati/$slug" params={{ slug: p.slug }} className="group rounded-lg overflow-hidden bg-card border hover:shadow-lg transition">
                {p.img ? <img src={p.img} alt={p.title} loading="lazy" className="h-40 w-full object-cover" /> : <div className="h-40 bg-muted flex items-center justify-center font-serif text-5xl text-primary/40">❦</div>}
                <div className="p-5"><p className="text-xs text-muted-foreground">{p.date}</p><h3 className="mt-2 text-lg group-hover:text-primary transition">{p.title}</h3></div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-accent text-accent-foreground px-6 py-12 text-center">
        <Link to="/" className="font-serif text-2xl">O pâine pe zi</Link>
        <p className="mt-3 text-xs opacity-60">© {new Date().getFullYear()} Igor Lazăr</p>
      </footer>
    </main>
  );
}
