"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/ProductCard";

export default function SearchPage() {
  return (
    <Suspense fallback={null}>
      <SearchResults />
    </Suspense>
  );
}

function SearchResults() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/products?q=${encodeURIComponent(q)}`)
      .then((r) => r.json())
      .then((data) => setResults(data.products || []))
      .finally(() => setLoading(false));
  }, [q]);

  return (
    <main className="max-w-[1220px] mx-auto px-5 sm:px-7 py-14">
      <div className="mb-10">
        <span className="eyebrow">Search results</span>
        <h1 className="font-display text-3xl sm:text-4xl mt-1">
          {q ? `"${q}"` : "Search"}
        </h1>
      </div>

      {loading ? (
        <p className="font-mono text-sm text-ink/50">Searching…</p>
      ) : results.length === 0 ? (
        <p className="font-mono text-sm text-ink/50">No products matched that search.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {results.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </main>
  );
}
