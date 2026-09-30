"use client";

import { useMemo, useState } from "react";
import ProductCard from "./ProductCard";

export default function FilterableGrid({ products, initialSort = "featured" }) {
  const [fit, setFit] = useState("all");
  const [color, setColor] = useState("all");
  const [sort, setSort] = useState(initialSort);

  const fits = useMemo(() => ["all", ...new Set(products.map((p) => p.fit))], [products]);
  const colors = useMemo(() => ["all", ...new Set(products.map((p) => p.color))], [products]);

  const filtered = useMemo(() => {
    let list = products.filter(
      (p) => (fit === "all" || p.fit === fit) && (color === "all" || p.color === color)
    );
    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "newest") list = [...list].sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    if (sort === "sale") list = list.filter((p) => p.compareAtPrice);
    return list;
  }, [products, fit, color, sort]);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-8 font-mono text-xs uppercase tracking-wider">
        <Select label="Fit" value={fit} onChange={setFit} options={fits} />
        <Select label="Colour" value={color} onChange={setColor} options={colors} />
        <Select
          label="Sort"
          value={sort}
          onChange={setSort}
          options={["featured", "price-asc", "price-desc", "newest", "sale"]}
          display={{
            featured: "Featured",
            "price-asc": "Price: Low to High",
            "price-desc": "Price: High to Low",
            newest: "Newest",
            sale: "On Sale",
          }}
        />
        <span className="text-ink/45 ml-auto">{filtered.length} products</span>
      </div>

      {filtered.length === 0 ? (
        <p className="text-ink/60 font-mono text-sm py-16 text-center">No products match those filters.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}

function Select({ label, value, onChange, options, display }) {
  return (
    <label className="flex items-center gap-2 border border-line rounded-sm px-3 py-2 bg-paper">
      <span className="text-ink/45">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent outline-none"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {display ? display[o] : o === "all" ? "All" : o}
          </option>
        ))}
      </select>
    </label>
  );
}
