"use client";

import Link from "next/link";
import { useState } from "react";
import ProductArt from "./ProductArt";
import { useCart } from "@/context/CartContext";
import QuickBuyModal from "./QuickBuyModal";

export default function ProductCard({ product }) {
  const { wishlist, toggleWishlist } = useCart();
  const isWishlisted = wishlist.includes(product.handle);
  const totalStock = product.variants.reduce((s, v) => s + v.stock, 0);
  const soldOut = totalStock === 0;
  const [buyNowOpen, setBuyNowOpen] = useState(false);
  const firstInStock = product.variants.find((v) => v.stock > 0);

  function handleBuyNow(e) {
    e.preventDefault();
    e.stopPropagation();
    if (soldOut) return;
    setBuyNowOpen(true);
  }

  return (
    <article className="relative bg-paper border border-line flex flex-col group transition-transform hover:-translate-y-1 hover:shadow-lg">
      <Link href={`/products/${product.handle}`} className="relative aspect-[4/5] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0" style={{ background: product.hex + "18" }} />
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

      <div className="p-4 border-t border-dashed border-ink/10">
        <Link href={`/products/${product.handle}`}>
          <h3 className="text-[15px] font-bold mb-1">{product.name}</h3>
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
        {!soldOut && (
          <button
            onClick={handleBuyNow}
            className="w-full mt-3 py-2 border-[1.5px] border-ink font-mono text-[11px] uppercase tracking-wider rounded-sm hover:bg-ink hover:text-canvas transition-colors"
          >
            Buy now
          </button>
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
    </article>
  );
}
