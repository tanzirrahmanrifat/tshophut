"use client";

import { useMemo, useState } from "react";
import ProductCard from "./ProductCard";

export default function ProductRail({ title, eyebrow, products }) {
  const categories = useMemo(() => ["All", ...new Set(products.map((p) => catLabel(p.category)))], [products]);
  const [tab, setTab] = useState("All");

  const filtered = tab === "All" ? products : products.filter((p) => catLabel(p.category) === tab);

  return (
    <section className="py-14 sm:py-16 max-w-[1220px] mx-auto px-5 sm:px-7">
      <div className="flex items-end justify-between gap-6 mb-8 flex-wrap">
        <div>
          <span className="eyebrow text-cobalt">{eyebrow}</span>
          <h2 className="font-display text-3xl sm:text-4xl mt-1">{title}</h2>
        </div>
        <div className="flex gap-2 font-mono text-xs uppercase tracking-wider">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setTab(c)}
              className={`px-3.5 py-2 rounded-full border transition-colors ${
                tab === c ? "bg-ink text-canvas border-ink" : "border-line text-ink/60 hover:border-ink"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-3 -mx-1 px-1 snap-x snap-mandatory scrollbar-thin">
        {filtered.map((p) => (
          <div key={p.id} className="min-w-[220px] sm:min-w-[260px] snap-start">
            <ProductCard product={p} />
          </div>
        ))}
        {filtered.length === 0 && <p className="font-mono text-sm text-ink/50 py-10">Nothing here yet.</p>}
      </div>
    </section>
  );
}

function catLabel(category) {
  if (category === "tees") return "Tees";
  if (category === "caps") return "Caps";
  if (category === "custom") return "Custom";
  return category;
}
