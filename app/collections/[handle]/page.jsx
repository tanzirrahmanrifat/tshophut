import { getProducts } from "@/lib/db";
import FilterableGrid from "@/components/FilterableGrid";
import Breadcrumbs from "@/components/Breadcrumbs";

const TITLES = {
  tees: "All Tees",
  caps: "Caps",
  custom: "Print on Demand Blanks",
};

export function generateStaticParams() {
  return [{ handle: "tees" }, { handle: "caps" }, { handle: "custom" }];
}

export default function CollectionPage({ params, searchParams }) {
  const products = getProducts().filter((p) => p.category === params.handle);
  const title = TITLES[params.handle] || "Shop";

  return (
    <main className="max-w-[1220px] mx-auto px-5 sm:px-7 py-10 sm:py-14">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: title }]} />
      <div className="mb-10">
        <span className="eyebrow">Collection</span>
        <h1 className="font-display text-3xl sm:text-4xl mt-1">{title}</h1>
      </div>
      <FilterableGrid products={products} initialSort={searchParams.sort || "featured"} />
    </main>
  );
}
