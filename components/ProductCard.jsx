"use client";

import Link from "next/link";
import { useState } from "react";
import ProductArt from "./ProductArt";
import { useCart } from "@/context/CartContext";
import { useToast } from "./Toast";
import QuickBuyModal from "./QuickBuyModal";
import QuickViewModal from "./QuickViewModal";

export default function ProductCard({ product }) {
  const { wishlist, toggleWishlist, addItem } = useCart();
  const { showToast } = useToast();
  const isWishlisted = wishlist.includes(product.handle);
  const totalStock = product.variants.reduce((s, v) => s + v.stock, 0);
  const soldOut = totalStock === 0;
  const [buyNowOpen, setBuyNowOpen] = useState(false);
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const firstInStock = product.variants.find((v) => v.stock > 0);
  const isCustom = product.category === "custom";

  function handleQuickView(e) {
    e.preventDefault();
    e.stopPropagation();
    setQuickViewOpen(true);
  }

  function handleBuyNow(e) {
    e.preventDefault();
    e.stopPropagation();
    if (soldOut) return;
    setBuyNowOpen(true);
  }

  function handleQuickAdd(e) {
    e.preventDefault();
    e.stopPropagation();
    if (soldOut || !firstInStock) return;
    addItem({
      handle: product.handle,
      name: product.name,
      price: product.price,
      hex: product.hex,
      size: firstInStock.size,
      qty: 1,
    });
    showToast(`Added ${product.name} (${firstInStock.size}) to cart`, { actionLabel: "View cart", actionHref: "/cart" });
  }

  return (
    <article className="relative bg-paper border border-line flex flex-col group transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_18px_36px_rgba(23,20,15,0.12)] hover:border-ink/25">
      <Link href={`/products/${product.handle}`} className="relative aspect-[4/5] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 transition-transform duration-500 group-hover:scale-105"
          style={{ background: `radial-gradient(120% 100% at 50% 0%, ${product.hex}22, ${product.hex}0a)` }}
        />
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{ backgroundImage: "radial-gradient(circle, #17140F 1px, transparent 1px)", backgroundSize: "14px 14px" }}
        />
        {product.isNew && !soldOut && (
          <span className="absolute top-3 left-3 z-10 bg-cobalt text-white font-mono text-[10px] uppercase tracking-wider px-2 py-1 rounded-full">
            New
          </span>
        )}
        {product.compareAtPrice && !soldOut && (
          <span className="absolute top-3 left-3 z-10 bg-stamp text-white font-mono text-[10px] uppercase tracking-wider px-2 py-1 rounded-full">
            Sale
          </span>
        )}
        {soldOut && (
          <span className="absolute top-3 left-3 z-10 bg-ink/70 text-white font-mono text-[10px] uppercase tracking-wider px-2 py-1 rounded-full">
            Sold out
          </span>
        )}
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover z-[1] transition-transform group-hover:scale-105"
          />
        ) : (
          <ProductArt category={product.category} hex={product.hex} className="w-3/5 relative z-[1] transition-transform group-hover:scale-105 group-hover:-rotate-1" />
        )}

        <button
          onClick={handleQuickView}
          className="absolute bottom-3 left-1/2 -translate-x-1/2 z-[2] px-4 py-2 bg-ink/90 text-canvas font-mono text-[10px] uppercase tracking-wider rounded-full opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all backdrop-blur-sm hidden sm:block"
        >
          Quick view
        </button>
      </Link>

      <button
        onClick={() => toggleWishlist(product.handle)}
        aria-label="Toggle wishlist"
        className="absolute top-3 right-3 z-10 w-7 h-7 rounded-full bg-paper/90 flex items-center justify-center"
      >
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill={isWishlisted ? "#C1432E" : "none"}>
          <path d="M12 20s-7-4.4-9.3-8.8C1.2 8 2.7 5 6 5c1.9 0 3.4 1 4 2.4C10.6 6 12.1 5 14 5c3.3 0 4.8 3 3.3 6.2C15 15.6 12 20 12 20Z" stroke="#17140F" strokeWidth="1.4" strokeLinejoin="round" />
        </svg>
      </button>

      <div className="p-4 border-t border-dashed border-ink/12">
        <Link href={`/products/${product.handle}`}>
          <h3 className="text-[15px] font-bold mb-1 leading-snug group-hover:text-cobalt transition-colors">{product.name}</h3>
        </Link>
        <p className="eyebrow">{product.fit}</p>
        <div className="flex items-center justify-between mt-2">
          <span className="font-mono text-sm">
            {product.compareAtPrice && (
              <s className="text-ink/45 mr-1.5 text-xs">৳{product.compareAtPrice}</s>
            )}
            ৳{product.price}
          </span>
          <span className="eyebrow">★ {product.rating}</span>
        </div>

        {!isCustom && product.variants.length > 1 && (
          <div className="flex gap-1 mt-2.5">
            {product.variants.map((v) => (
              <span
                key={v.size}
                className={`text-[9px] font-mono px-1.5 py-0.5 border rounded-sm ${
                  v.stock > 0 ? "border-ink/20 text-ink/60" : "border-ink/10 text-ink/25 line-through"
                }`}
              >
                {v.size}
              </span>
            ))}
          </div>
        )}

        {!soldOut && (
          <div className="flex gap-2 mt-3">
            {isCustom ? (
              <Link
                href={`/products/${product.handle}`}
                className="flex-1 text-center py-2 bg-ink text-canvas font-mono text-[11px] uppercase tracking-wider rounded-sm hover:bg-cobalt transition-colors"
              >
                Customize
              </Link>
            ) : (
              <button
                onClick={handleQuickAdd}
                className="flex-1 py-2 bg-ink text-canvas font-mono text-[11px] uppercase tracking-wider rounded-sm hover:bg-cobalt transition-colors"
              >
                Add to cart
              </button>
            )}
            <button
              onClick={handleBuyNow}
              className="flex-1 py-2 border-[1.5px] border-ink font-mono text-[11px] uppercase tracking-wider rounded-sm hover:bg-ink hover:text-canvas transition-colors"
            >
              Buy now
            </button>
          </div>
        )}
      </div>

      {!soldOut && (
        <QuickBuyModal
          open={buyNowOpen}
          onClose={() => setBuyNowOpen(false)}
          item={{
            handle: product.handle,
            name: product.name,
            price: product.price,
            hex: product.hex,
            size: firstInStock?.size || product.variants[0].size,
            qty: 1,
          }}
        />
      )}

      <QuickViewModal product={product} open={quickViewOpen} onClose={() => setQuickViewOpen(false)} />
    </article>
  );
}
