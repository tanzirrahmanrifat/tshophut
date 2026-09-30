import { notFound } from "next/navigation";
import { getProductByHandle, getProducts } from "@/lib/db";
import ProductDetail from "@/components/ProductDetail";
import ProductCard from "@/components/ProductCard";

export default function ProductPage({ params }) {
  const product = getProductByHandle(params.handle);
  if (!product) notFound();

  const related = getProducts()
    .filter((p) => p.category === product.category && p.handle !== product.handle)
    .slice(0, 4);

  return (
    <main className="max-w-[1220px] mx-auto px-5 sm:px-7 py-14">
      <ProductDetail product={product} />

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="font-display text-2xl sm:text-3xl mb-6">You might also like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
