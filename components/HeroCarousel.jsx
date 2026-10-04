"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { TeeArt, CapArt } from "./ProductArt";
import DropCountdown from "./DropCountdown";

const SLIDES = [
  {
    eyebrow: "Drop 07 — live now",
    title: "Tees made for every Friday.",
    body: "Heavyweight cotton, honest cuts, small batches. A fresh run every week — once it's worn out, it's out.",
    cta: { label: "Shop Drop 07", href: "/collections/tees" },
    bg: "#17140F",
    art: "tee",
    artHex: "#2C46E0",
    showCountdown: true,
  },
  {
    eyebrow: "New feature",
    title: "Design your own tee or cap.",
    body: "Upload your own artwork to the front, back, neck label, or either sleeve — we print and ship, no minimum order.",
    cta: { label: "Open the design studio", href: "/custom" },
    bg: "#2C46E0",
    art: "tee",
    artHex: "#F0EEE6",
  },
  {
    eyebrow: "This week only",
    title: "Up to ৳300 off select tees.",
    body: "A handful of last-drop colourways are marked down while sizes last. First come, first served.",
    cta: { label: "Shop the sale", href: "/collections/tees?sort=sale" },
    bg: "#C1432E",
    art: "cap",
    artHex: "#F0EEE6",
  },
];

export default function HeroCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), 6000);
    return () => clearInterval(id);
  }, []);

  const slide = SLIDES[index];
  const Art = slide.art === "cap" ? CapArt : TeeArt;

  return (
    <section className="border-b border-line overflow-hidden">
      <div className="grid md:grid-cols-[1.05fr_.95fr] min-h-[560px] md:min-h-[640px]">
        <div className="flex flex-col justify-center gap-5 px-6 sm:px-14 py-10">
          <div className="inline-flex items-center gap-2.5 w-fit px-3.5 py-2 border-[1.5px] border-ink rounded-full font-mono text-[11px] tracking-wider uppercase">
            <span className="w-6 h-6 rounded-full bg-stamp spin-slow" />
            {slide.eyebrow}
          </div>
          <h1 key={`t-${index}`} className="font-display text-[38px] sm:text-[56px] lg:text-[72px] leading-[1.02] animate-fade-up">
            {slide.title}
          </h1>
          <p key={`b-${index}`} className="max-w-[46ch] text-[17px] text-ink/70 animate-fade-up" style={{ animationDelay: "60ms" }}>
            {slide.body}
          </p>
          <div className="flex items-center gap-4 mt-1">
            <Link
              href={slide.cta.href}
              className="bg-ink text-canvas px-6 py-3.5 font-mono text-[13px] uppercase tracking-wider rounded-sm hover:bg-cobalt transition-all shadow-[0_8px_20px_rgba(23,20,15,0.22)] hover:shadow-[0_10px_24px_rgba(44,70,224,0.35)] hover:-translate-y-0.5"
            >
              {slide.cta.label}
            </Link>
            {slide.showCountdown && (
              <span className="font-mono text-xs text-ink/45">
                37 left · <DropCountdown />
              </span>
            )}
          </div>

          <div className="flex gap-2 mt-4">
            {SLIDES.map((s, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${i === index ? "w-8 bg-ink" : "w-3 bg-ink/20"}`}
              />
            ))}
          </div>
        </div>

        <div
          className="relative flex items-center justify-center min-h-[320px] overflow-hidden transition-colors duration-700"
          style={{ background: `radial-gradient(120% 120% at 30% 20%, ${slide.bg}, ${slide.bg} 55%, rgba(0,0,0,0.18))` }}
        >
          {/* halftone dot texture */}
          <div
            className="absolute inset-0 opacity-[0.12]"
            style={{
              backgroundImage: "radial-gradient(circle, rgba(240,238,230,.9) 1px, transparent 1px)",
              backgroundSize: "16px 16px",
            }}
          />
          {/* soft glow behind the art */}
          <div
            className="absolute w-[70%] aspect-square rounded-full blur-3xl opacity-20"
            style={{ background: slide.artHex }}
          />
          <Art key={index} hex={slide.artHex} className="w-[58%] max-w-[360px] relative z-[1] drop-shadow-2xl animate-art-in" />

          <div className="absolute bottom-6 right-6 bg-canvas/95 backdrop-blur px-4 py-2.5 rounded-sm rotate-2 shadow-xl font-mono text-[11px] z-[1]">
            {slide.eyebrow.split(" — ")[0]}
            <b className="block text-sm text-ink">৳850+</b>
          </div>
        </div>
      </div>
    </section>
  );
}
