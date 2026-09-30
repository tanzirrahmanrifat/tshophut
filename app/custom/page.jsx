import { Suspense } from "react";
import CustomDesigner from "@/components/CustomDesigner";

export default function CustomPage() {
  return (
    <main className="max-w-[1220px] mx-auto px-5 sm:px-7 py-14">
      <div className="mb-10">
        <span className="eyebrow text-cobalt">Print on demand</span>
        <h1 className="font-display text-3xl sm:text-4xl mt-1">Design your own tee or cap</h1>
        <p className="text-ink/70 max-w-[60ch] mt-2">
          Pick a colour, drop in your artwork, drag it into place on the front,
          back, neck label, or either sleeve. We print and ship — no minimum order.
        </p>
      </div>
      <Suspense fallback={null}>
        <CustomDesigner />
      </Suspense>
    </main>
  );
}
