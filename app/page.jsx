import Link from "next/link";
import { getProducts } from "@/lib/db";
import ProductCard from "@/components/ProductCard";
import { TeeArt } from "@/components/ProductArt";
import NewsletterForm from "@/components/NewsletterForm";

export default function HomePage() {
  const products = getProducts();
  const featured = products.filter((p) => p.featured).slice(0, 4);

  return (
    <main>
      {/* HERO */}
      <section className="border-b border-line overflow-hidden">
        <div className="grid md:grid-cols-[1.05fr_.95fr] min-h-[560px] md:min-h-[640px]">
          <div className="flex flex-col justify-center gap-5 px-6 sm:px-14 py-10">
            <div className="inline-flex items-center gap-2.5 w-fit px-3.5 py-2 border-[1.5px] border-ink rounded-full font-mono text-[11px] tracking-wider uppercase">
              <span className="w-6 h-6 rounded-full bg-stamp spin-slow" />
              Drop 07 — live now
            </div>
            <h1 className="font-display text-[44px] sm:text-[64px] lg:text-[80px] leading-none">
              Tees made for <span className="text-cobalt">every</span> Friday.
            </h1>
            <p className="max-w-[46ch] text-[17px] text-ink/70">
              Heavyweight cotton, honest cuts, small batches. We drop a fresh run
              every week and don't restock — once it's worn out, it's out.
            </p>
            <div className="flex items-center gap-4 mt-1">
              <Link href="/collections/tees" className="bg-ink text-canvas px-6 py-3.5 font-mono text-[13px] uppercase tracking-wider rounded-sm hover:bg-cobalt transition-colors">
                Shop Drop 07
              </Link>
              <span className="font-mono text-xs text-ink/45">37 left · closes Fri 6PM</span>
            </div>
          </div>
          <div className="relative bg-ink flex items-center justify-center min-h-[320px]">
            <TeeArt hex="#2C46E0" className="w-[62%] max-w-[380px]" />
            <div className="absolute top-8 right-8 bg-canvas px-3.5 py-2.5 rounded-sm rotate-3 shadow-xl font-mono text-xs">
              Drop 07
              <b className="block text-[15px]">৳ 850</b>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED DROP */}
      <section className="py-16 sm:py-20 max-w-[1220px] mx-auto px-5 sm:px-7">
        <div className="flex items-end justify-between gap-6 mb-10 flex-wrap">
          <div>
            <span className="eyebrow text-cobalt">Drop 07 / Limited</span>
            <h2 className="font-display text-3xl sm:text-4xl mt-1">This week&apos;s run</h2>
            <p className="text-ink/70 max-w-[44ch] mt-2">
              Six colourways, one silhouette. When it&apos;s gone, it&apos;s gone until the next drop.
            </p>
          </div>
          <Link href="/collections/tees" className="font-mono text-xs uppercase tracking-wider border-b-[1.5px] border-ink pb-1 hover:text-cobalt hover:border-cobalt">
            View all tees →
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <hr className="stitch max-w-[1220px] mx-auto" />

      {/* CATEGORIES */}
      <section className="py-16 sm:py-20 max-w-[1220px] mx-auto px-5 sm:px-7">
        <div className="mb-10">
          <span className="eyebrow">Browse by fit</span>
          <h2 className="font-display text-3xl sm:text-4xl mt-1">Shop the range</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "All Tees", href: "/collections/tees", bg: "#2C46E0" },
            { label: "Caps", href: "/collections/caps", bg: "#0C0A07" },
            { label: "Print on Demand", href: "/custom", bg: "#C1432E" },
            { label: "Sale", href: "/collections/tees?sort=sale", bg: "#8A8370" },
          ].map((t) => (
            <Link
              key={t.label}
              href={t.href}
              className="relative aspect-[3/4] flex items-end p-5 overflow-hidden group"
              style={{ background: t.bg }}
            >
              <span className="relative z-10 text-canvas font-mono text-[13px] tracking-wider uppercase flex items-center gap-2">
                {t.label}
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" fill="none">
                  <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* VALUES */}
      <div className="grid md:grid-cols-3 border-y border-line">
        {[
          ["240 GSM cotton", "Heavier than the mall stuff. Doesn't go see-through, doesn't go thin after a few washes."],
          ["Weekly drops, no restocks", "Small batches every Friday. Sizes and colours don't come back — that's the whole idea."],
          ["Sized for real bodies", "Cut from local size data, not borrowed charts — check the fit guide before you order."],
        ].map(([title, body], i) => (
          <div key={title} className={`p-9 ${i > 0 ? "md:border-l border-t md:border-t-0 border-line" : ""}`}>
            <h3 className="font-bold text-[17px] mb-2">{title}</h3>
            <p className="text-ink/70 text-[14.5px]">{body}</p>
          </div>
        ))}
      </div>

      {/* STORY */}
      <section id="story" className="py-16 sm:py-20 max-w-[1220px] mx-auto px-5 sm:px-7">
        <div className="grid md:grid-cols-[.9fr_1.1fr] gap-14 items-center">
          <div className="bg-canvas-dim border border-line aspect-[4/3] flex items-center justify-center">
            <TeeArt hex="#17140F" className="w-[55%]" />
          </div>
          <div>
            <span className="eyebrow text-cobalt">Why weekly drops</span>
            <h2 className="font-display text-3xl sm:text-4xl mt-3 mb-4">
              We&apos;d rather sell out than sit in a warehouse.
            </h2>
            <p className="text-ink/70 max-w-[52ch] mb-6">
              Tshophut started as a two-person print run out of a Dhaka garage. We
              kept the model on purpose: one fabric, one fit, a new colour or
              graphic every Friday, and nothing reordered.
            </p>
            <div className="flex gap-10">
              {[["07", "Drops so far"], ["240g", "Fabric weight"], ["48h", "Avg. sell-out"]].map(([n, l]) => (
                <div key={l}>
                  <b className="font-display text-3xl block">{n}</b>
                  <span className="eyebrow">{l}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="bg-ink text-canvas">
        <div className="max-w-[1220px] mx-auto px-5 sm:px-7 flex items-center justify-between gap-10 py-14 flex-wrap">
          <h2 className="font-display text-3xl sm:text-4xl max-w-[12ch]">Don&apos;t miss the next drop.</h2>
          <NewsletterForm />
        </div>
      </section>
    </main>
  );
}
