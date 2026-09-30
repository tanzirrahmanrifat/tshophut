"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useCart } from "@/context/CartContext";
import ProductArt from "./ProductArt";

export default function FrequentlyBoughtTogether({ current, related }) {
  const { addItem } = useCart();
  const bundle = useMemo(() => [current, ...related.slice(0, 2)], [current, related]);
  const [checked, setChecked] = useState(() => new Set(bundle.map((p) => p.id)));
  const [added, setAdded] = useState(false);

  function toggle(id) {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const selected = bundle.filter((p) => checked.has(p.id));
  const total = selected.reduce((sum, p) => sum + p.price, 0);

  function handleAddAll() {
    selected.forEach((p) => {
      const firstInStock = p.variants.find((v) => v.stock > 0);
      if (!firstInStock) return;
      addItem({ handle: p.handle, name: p.name, price: p.price, hex: p.hex, size: firstInStock.size, qty: 1 });
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  }

  if (bundle.length < 2) return null;

  return (
    <section className="mt-20 bg-paper border border-line p-6 sm:p-8">
      <span className="eyebrow text-cobalt">Bundle up</span>
      <h2 className="font-display text-2xl sm:text-3xl mt-1 mb-6">Frequently bought together</h2>

      <div className="flex flex-wrap items-center gap-4 mb-6">
        {bundle.map((p, i) => (
          <div key={p.id} className="flex items-center gap-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={checked.has(p.id)} onChange={() => toggle(p.id)} className="w-4 h-4 accent-cobalt" />
              <div className="w-14 h-14 rounded-sm flex items-center justify-center" style={{ background: p.hex + "18" }}>
                <ProductArt category={p.category} hex={p.hex} className="w-7" />
              </div>
              <div>
                <p className="text-sm font-semibold">{p.name}</p>
                <p className="font-mono text-xs text-ink/50">৳{p.price}</p>
              </div>
            </label>
            {i < bundle.length - 1 && <span className="text-ink/30 text-xl">+</span>}
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between flex-wrap gap-4">
        <span className="font-mono text-sm">
          Total for {selected.length} item{selected.length === 1 ? "" : "s"}: <b className="text-base">৳{total.toLocaleString()}</b>
        </span>
        <button
          onClick={handleAddAll}
          disabled={selected.length === 0}
          className={`px-6 py-3 font-mono text-xs uppercase tracking-wider rounded-sm transition-colors
          ${added ? "bg-cobalt text-white" : "bg-ink text-canvas hover:bg-cobalt"} disabled:opacity-40`}
        >
          {added ? "Added ✓" : "Add selected to cart"}
        </button>
      </div>

      {related.length > 0 && (
        <div className="mt-8 pt-6 border-t border-dashed border-line">
          <span className="eyebrow block mb-4">More like this</span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {related.map((p) => (
              <Link key={p.id} href={`/products/${p.handle}`} className="flex items-center gap-2.5 border border-line p-2.5">
                <div className="w-9 h-9 rounded-full flex-none" style={{ background: p.hex }} />
                <div>
                  <p className="text-xs font-semibold leading-tight">{p.name}</p>
                  <p className="font-mono text-[11px] text-ink/50">৳{p.price}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
