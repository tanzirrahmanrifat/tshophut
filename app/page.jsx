import Link from "next/link";
import { getProducts } from "@/lib/db";
import { TeeArt, CapArt } from "@/components/ProductArt";
import NewsletterForm from "@/components/NewsletterForm";
import RecentlyViewed from "@/components/RecentlyViewed";
import HeroCarousel from "@/components/HeroCarousel";
import ProductRail from "@/components/ProductRail";
import TrustBadges from "@/components/TrustBadges";
import StatsCounter from "@/components/StatsCounter";

export default function HomePage() {
  const products = getProducts();
  const newArrivals = products.filter((p) => p.isNew);
  const bestsellers = [...products].sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);

  return (
    <main>
      <HeroCarousel />

      <TrustBadges />

      <ProductRail title="New Arrivals" eyebrow="Just dropped" products={newArrivals} />

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

      <StatsCounter />

      {/* STORY — three-tile collage */}
      <section id="story" className="py-16 sm:py-20 max-w-[1220px] mx-auto px-5 sm:px-7">
        <div className="text-center max-w-[56ch] mx-auto mb-12">
          <span className="eyebrow text-cobalt">Why weekly drops</span>
          <h2 className="font-display text-3xl sm:text-4xl mt-3 mb-4">
            We&apos;d rather sell out than sit in a warehouse.
          </h2>
          <p className="text-ink/70">
            Tshophut started as a two-person print run out of a Dhaka garage. We
            kept the model on purpose: one fabric, one fit, a new colour or
            graphic every Friday, and nothing reordered — less overstock, less
            waste, better cotton.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <div className="bg-canvas-dim border border-line aspect-[4/3] flex items-center justify-center">
            <TeeArt hex="#17140F" className="w-[45%]" />
          </div>
          <div className="bg-ink aspect-[4/3] flex items-center justify-center">
            <TeeArt hex="#2C46E0" className="w-[45%]" />
          </div>
          <div className="bg-canvas-dim border border-line aspect-[4/3] flex items-center justify-center">
            <CapArt hex="#C1432E" className="w-[45%]" />
          </div>
        </div>

        <div className="flex justify-center gap-10 sm:gap-16">
          {[["07", "Drops so far"], ["240g", "Fabric weight"], ["48h", "Avg. sell-out"]].map(([n, l]) => (
            <div key={l} className="text-center">
              <b className="font-display text-3xl block">{n}</b>
              <span className="eyebrow">{l}</span>
            </div>
          ))}
        </div>
      </section>

      <ProductRail title="Bestsellers" eyebrow="Customer favourites" products={bestsellers} />

      <div className="max-w-[1220px] mx-auto px-5 sm:px-7">
        <RecentlyViewed />
      </div>

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
