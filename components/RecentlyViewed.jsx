"use client";

import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { getRecentlyViewed } from "@/lib/recentlyViewed";

export default function RecentlyViewed({ excludeHandle }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const handles = getRecentlyViewed().filter((h) => h !== excludeHandle);
    if (handles.length === 0) return;
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => {
        const byHandle = new Map((data.products || []).map((p) => [p.handle, p]));
        setProducts(handles.map((h) => byHandle.get(h)).filter(Boolean).slice(0, 4));
      });
  }, [excludeHandle]);

  if (products.length === 0) return null;

  return (
    <section className="mt-20">
      <h2 className="font-display text-2xl sm:text-3xl mb-6">Recently viewed</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
