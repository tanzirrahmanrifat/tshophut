"use client";

import { useEffect, useState } from "react";

export default function StickyBuyBar({ product, soldOut, onAdd, onBuyNow }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 420);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (soldOut) return null;

  return (
    <div
      className={`md:hidden fixed bottom-0 left-0 right-0 z-50 bg-paper border-t border-line px-4 py-3 flex items-center gap-3 transition-transform duration-200 ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
      style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom, 0px))" }}
    >
      <div className="w-9 h-9 rounded-full flex-none" style={{ background: product.hex }} />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold truncate">{product.name}</p>
        <p className="font-mono text-xs text-ink/60">৳{product.price}</p>
      </div>
      <button
        onClick={onAdd}
        className="px-3.5 py-2 border-[1.5px] border-ink font-mono text-[10px] uppercase tracking-wider rounded-sm flex-none"
      >
        Add
      </button>
      <button
        onClick={onBuyNow}
        className="px-3.5 py-2 bg-ink text-canvas font-mono text-[10px] uppercase tracking-wider rounded-sm flex-none"
      >
        Buy now
      </button>
    </div>
  );
}
