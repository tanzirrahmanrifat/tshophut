import Link from "next/link";
import { getProducts } from "@/lib/db";
import { TeeArt, CapArt } from "@/components/ProductArt";
import NewsletterForm from "@/components/NewsletterForm";
import RecentlyViewed from "@/components/RecentlyViewed";
import HeroCarousel from "@/components/HeroCarousel";
import ProductRail from "@/components/ProductRail";
import TrustBadges from "@/components/TrustBadges";
import StatsCounter from "@/components/StatsCounter";
import Reveal from "@/components/Reveal";

export default function HomePage() {
  const products = getProducts();
  const newArrivals = products.filter((p) => p.isNew);
  const bestsellers = [...products].sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);

  return (
    <main>
      <HeroCarousel />

      <Reveal><TrustBadges /></Reveal>

      <Reveal><ProductRail title="New Arrivals" eyebrow="Just dropped" products={newArrivals} /></Reveal>

      <hr className="stitch max-w-[1220px] mx-auto" />

      {/* CATEGORIES — bento grid */}
      <section className="py-16 sm:py-20 max-w-[1220px] mx-auto px-5 sm:px-7">
        <Reveal className="mb-10">
          <span className="eyebrow">Browse by fit</span>
          <h2 className="font-display text-3xl sm:text-4xl mt-1">Shop the range</h2>
        </Reveal>
        <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[170px] md:grid-rows-2 gap-4 md:h-[520px]">
          <Reveal delay={0} className="col-span-2 md:col-span-2 md:row-span-2">
            <BentoTile label="All Tees" sub="The weekly staple" href="/collections/tees" bg="#2C46E0" art={<TeeArt hex="#F0EEE6" className="w-28 sm:w-36" />} big />
          </Reveal>
          <Reveal delay={60} className="md:col-span-1">
            <BentoTile label="Caps" sub="One size, six colours" href="/collections/caps" bg="#0C0A07" art={<CapArt hex="#F0EEE6" className="w-16" />} />
          </Reveal>
          <Reveal delay={120} className="md:col-span-1">
            <BentoTile label="Sale" sub="While sizes last" href="/collections/tees?sort=sale" bg="#8A8370" art={<TeeArt hex="#F0EEE6" className="w-16" />} />
          </Reveal>
          <Reveal delay={180} className="col-span-2 md:col-span-2">
            <BentoTile label="Print on Demand" sub="Your artwork, our cotton" href="/custom" bg="#C1432E" art={<TeeArt hex="#F0EEE6" className="w-16" />} wide />
          </Reveal>
        </div>
      </section>

      <Reveal><StatsCounter /></Reveal>

      {/* STORY — three-tile collage */}
      <section id="story" className="py-16 sm:py-20 max-w-[1220px] mx-auto px-5 sm:px-7">
        <Reveal className="text-center max-w-[56ch] mx-auto mb-12">
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
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <Reveal delay={0} className="bg-canvas-dim border border-line aspect-[4/3] flex items-center justify-center hover:-translate-y-1 transition-transform">
            <TeeArt hex="#17140F" className="w-[45%]" />
          </Reveal>
          <Reveal delay={80} className="bg-ink aspect-[4/3] flex items-center justify-center hover:-translate-y-1 transition-transform">
            <TeeArt hex="#2C46E0" className="w-[45%]" />
          </Reveal>
          <Reveal delay={160} className="bg-canvas-dim border border-line aspect-[4/3] flex items-center justify-center hover:-translate-y-1 transition-transform">
            <CapArt hex="#C1432E" className="w-[45%]" />
          </Reveal>
        </div>

        <Reveal className="flex justify-center gap-10 sm:gap-16">
          {[["07", "Drops so far"], ["240g", "Fabric weight"], ["48h", "Avg. sell-out"]].map(([n, l]) => (
            <div key={l} className="text-center">
              <b className="font-display text-3xl block">{n}</b>
              <span className="eyebrow">{l}</span>
            </div>
          ))}
        </Reveal>
      </section>

      <Reveal><ProductRail title="Bestsellers" eyebrow="Customer favourites" products={bestsellers} /></Reveal>

      <div className="max-w-[1220px] mx-auto px-5 sm:px-7">
        <RecentlyViewed />
      </div>

      {/* NEWSLETTER */}
      <Reveal>
        <section className="bg-ink text-canvas">
          <div className="max-w-[1220px] mx-auto px-5 sm:px-7 flex items-center justify-between gap-10 py-14 flex-wrap">
            <h2 className="font-display text-3xl sm:text-4xl max-w-[12ch]">Don&apos;t miss the next drop.</h2>
            <NewsletterForm />
          </div>
        </section>
      </Reveal>
    </main>
  );
}

function BentoTile({ label, sub, href, bg, art, big, wide }) {
  return (
    <Link
      href={href}
      className={`relative h-full flex ${big ? "flex-col justify-between" : "items-end"} p-5 sm:p-6 overflow-hidden group rounded-sm`}
      style={{ background: bg }}
    >
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{ backgroundImage: "radial-gradient(circle, #F0EEE6 1px, transparent 1px)", backgroundSize: "16px 16px" }}
      />
      <div className={`absolute ${big ? "top-5 right-5" : "top-3 right-3"} opacity-80 transition-transform group-hover:scale-110 group-hover:rotate-3 z-[1]`}>
        {art}
      </div>
      <span className="relative z-10 text-canvas">
        <span className={`block font-display ${big ? "text-2xl sm:text-3xl" : "text-lg"} leading-tight`}>{label}</span>
        <span className="block font-mono text-[11px] uppercase tracking-wider text-canvas/60 mt-1">{sub}</span>
        <span className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider mt-3 border-b border-canvas/40 pb-0.5 group-hover:border-canvas transition-colors">
          Shop now
          <svg viewBox="0 0 24 24" className="w-3 h-3 transition-transform group-hover:translate-x-1" fill="none">
            <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </span>
    </Link>
  );
}
