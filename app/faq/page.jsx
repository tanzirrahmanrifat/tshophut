import FaqAccordion from "@/components/FaqAccordion";
import Breadcrumbs from "@/components/Breadcrumbs";

export default function FaqPage() {
  return (
    <main className="max-w-[1220px] mx-auto px-5 sm:px-7 py-14">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "FAQ" }]} />
      <div className="text-center mb-12">
        <span className="eyebrow text-cobalt">Help</span>
        <h1 className="font-display text-3xl sm:text-4xl mt-2">Frequently asked questions</h1>
      </div>
      <FaqAccordion />
    </main>
  );
}
