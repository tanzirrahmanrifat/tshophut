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
          <h1 className="font-display text-[38px] sm:text-[56px] lg:text-[72px] leading-[1.02]">
            {slide.title}
          </h1>
          <p className="max-w-[46ch] text-[17px] text-ink/70">{slide.body}</p>
          <div className="flex items-center gap-4 mt-1">
            <Link
              href={slide.cta.href}
              className="bg-ink text-canvas px-6 py-3.5 font-mono text-[13px] uppercase tracking-wider rounded-sm hover:bg-cobalt transition-colors"
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
          className="relative flex items-center justify-center min-h-[320px] transition-colors duration-700"
          style={{ background: slide.bg }}
        >
          <Art hex={slide.artHex} className="w-[62%] max-w-[380px]" />
        </div>
      </div>
    </section>
  );
}
