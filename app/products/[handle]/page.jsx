import { notFound } from "next/navigation";
import { getProductByHandle, getProducts } from "@/lib/db";
import ProductDetail from "@/components/ProductDetail";
import FrequentlyBoughtTogether from "@/components/FrequentlyBoughtTogether";
import RecentlyViewed from "@/components/RecentlyViewed";
import Breadcrumbs from "@/components/Breadcrumbs";

const CATEGORY_LABEL = { tees: "Tees", caps: "Caps", custom: "Print on Demand" };
const CATEGORY_HREF = { tees: "/collections/tees", caps: "/collections/caps", custom: "/custom" };

export default function ProductPage({ params }) {
  const product = getProductByHandle(params.handle);
  if (!product) notFound();

  const related = getProducts()
    .filter((p) => p.category === product.category && p.handle !== product.handle)
    .slice(0, 4);

  return (
    <main className="max-w-[1220px] mx-auto px-5 sm:px-7 py-10 sm:py-14">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: CATEGORY_LABEL[product.category] || "Shop", href: CATEGORY_HREF[product.category] || "/" },
          { label: product.name },
        ]}
      />
      <ProductDetail product={product} />
      <FrequentlyBoughtTogether current={product} related={related} />
      <RecentlyViewed excludeHandle={product.handle} />
    </main>
  );
}
