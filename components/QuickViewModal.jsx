"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProductArt from "./ProductArt";
import { useCart } from "@/context/CartContext";
import { useToast } from "./Toast";

export default function QuickViewModal({ product, open, onClose }) {
  const { addItem } = useCart();
  const { showToast } = useToast();
  const inStock = product?.variants.filter((v) => v.stock > 0) || [];
  const [size, setSize] = useState(inStock[0]?.size);

  useEffect(() => {
    if (product) setSize(product.variants.find((v) => v.stock > 0)?.size);
  }, [product]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open || !product) return null;

  const selectedVariant = product.variants.find((v) => v.size === size);
  const soldOut = !selectedVariant || selectedVariant.stock === 0;

  function handleAdd() {
    if (soldOut) return;
    addItem({ handle: product.handle, name: product.name, price: product.price, hex: product.hex, size, qty: 1 });
    showToast(`Added ${product.name} (${size}) to cart`, { actionLabel: "View cart", actionHref: "/cart" });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[65] flex items-center justify-center p-4">
      <div onClick={onClose} className="absolute inset-0 bg-ink/50 backdrop-blur-[1px]" />
      <div className="relative bg-paper w-full max-w-2xl rounded-sm shadow-2xl max-h-[88vh] overflow-y-auto">
        <button onClick={onClose} aria-label="Close" className="absolute top-4 right-4 z-10 text-2xl leading-none text-ink/40 hover:text-ink">
          &times;
        </button>
        <div className="grid sm:grid-cols-2 gap-0">
          <div className="bg-canvas-dim flex items-center justify-center p-10 sm:p-12">
            {product.imageUrl ? (
              <img src={product.imageUrl} alt={product.name} className="w-full rounded-sm" />
            ) : (
              <ProductArt category={product.category} hex={product.hex} className="w-3/5" />
            )}
          </div>
          <div className="p-6 sm:p-8">
            <span className="eyebrow">{product.fit}</span>
            <h3 className="font-display text-2xl mt-1 mb-2">{product.name}</h3>
            <div className="flex items-center gap-3 mb-4">
              <span className="font-mono text-base">
                {product.compareAtPrice && <s className="text-ink/40 mr-2 text-sm">৳{product.compareAtPrice}</s>}
                ৳{product.price}
              </span>
              <span className="eyebrow">★ {product.rating}</span>
            </div>
            <p className="text-ink/70 text-sm mb-6">{product.description}</p>

            {product.category !== "custom" && (
              <div className="mb-6">
                <span className="eyebrow block mb-2">Size</span>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => (
                    <button
                      key={v.size}
                      disabled={v.stock === 0}
                      onClick={() => setSize(v.size)}
                      className={`px-3.5 py-1.5 border rounded-sm font-mono text-xs uppercase tracking-wider
                      ${size === v.size ? "bg-ink text-canvas border-ink" : "border-line"}
                      ${v.stock === 0 ? "opacity-30 line-through cursor-not-allowed" : "hover:border-cobalt"}`}
                    >
                      {v.size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleAdd}
                disabled={soldOut}
                className={`flex-1 py-3 font-mono text-xs uppercase tracking-wider rounded-sm transition-colors
                ${soldOut ? "bg-ink/20 cursor-not-allowed" : "bg-ink text-canvas hover:bg-cobalt"}`}
              >
                {soldOut ? "Sold out" : "Add to cart"}
              </button>
              <Link
                href={`/products/${product.handle}`}
                className="flex-1 text-center py-3 border-[1.5px] border-ink font-mono text-xs uppercase tracking-wider rounded-sm hover:bg-ink hover:text-canvas transition-colors"
              >
                Full details
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
