"use client";

import { useState } from "react";
import { TeeArt, TeeArtBack, CapArt, CapArtBack } from "./ProductArt";

export default function ProductGallery({ product }) {
  const [view, setView] = useState("front");
  const isCap = product.category === "caps";

  const Front = isCap ? CapArt : TeeArt;
  const Back = isCap ? CapArtBack : TeeArtBack;

  if (product.imageUrl) {
    return (
      <div className="bg-canvas-dim border border-line aspect-square flex items-center justify-center overflow-hidden rounded-sm">
        <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
      </div>
    );
  }

  return (
    <div>
      <div className="relative bg-canvas-dim border border-line aspect-square flex items-center justify-center overflow-hidden rounded-sm">
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{ backgroundImage: "radial-gradient(circle, #17140F 1px, transparent 1px)", backgroundSize: "16px 16px" }}
        />
        {view === "front" ? (
          <Front key="front" hex={product.hex} className="w-1/2 relative z-[1] animate-art-in" />
        ) : (
          <Back key="back" hex={product.hex} className="w-1/2 relative z-[1] animate-art-in" />
        )}
      </div>

      <div className="flex gap-3 mt-3">
        <button
          onClick={() => setView("front")}
          className={`flex-1 aspect-square rounded-sm border flex items-center justify-center transition-colors ${
            view === "front" ? "border-cobalt bg-cobalt/5" : "border-line bg-paper hover:border-ink/30"
          }`}
        >
          <Front hex={product.hex} className="w-2/3" />
        </button>
        <button
          onClick={() => setView("back")}
          className={`flex-1 aspect-square rounded-sm border flex items-center justify-center transition-colors ${
            view === "back" ? "border-cobalt bg-cobalt/5" : "border-line bg-paper hover:border-ink/30"
          }`}
        >
          <Back hex={product.hex} className="w-2/3" />
        </button>
      </div>
      <p className="font-mono text-[10px] text-ink/40 text-center mt-2 uppercase tracking-wider">
        {view === "front" ? "Front" : "Back"} view
      </p>
    </div>
  );
}
