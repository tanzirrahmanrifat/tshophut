import { notFound } from "next/navigation";
import { getProductByHandle, getProducts } from "@/lib/db";
import ProductDetail from "@/components/ProductDetail";
import FrequentlyBoughtTogether from "@/components/FrequentlyBoughtTogether";
import RecentlyViewed from "@/components/RecentlyViewed";

export default function ProductPage({ params }) {
  const product = getProductByHandle(params.handle);
  if (!product) notFound();

  const related = getProducts()
    .filter((p) => p.category === product.category && p.handle !== product.handle)
    .slice(0, 4);

  return (
    <main className="max-w-[1220px] mx-auto px-5 sm:px-7 py-14">
      <ProductDetail product={product} />
      <FrequentlyBoughtTogether current={product} related={related} />
      <RecentlyViewed excludeHandle={product.handle} />
    </main>
  );
}
