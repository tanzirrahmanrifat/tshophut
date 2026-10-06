"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useToast } from "./Toast";
import QuickBuyModal from "./QuickBuyModal";
import StickyBuyBar from "./StickyBuyBar";
import ProductGallery from "./ProductGallery";
import SizeGuideModal from "./SizeGuideModal";
import SocialProofBadge from "./SocialProofBadge";
import NotifyStockForm from "./NotifyStockForm";
import { pushRecentlyViewed } from "@/lib/recentlyViewed";

export default function ProductDetail({ product }) {
  const { addItem, wishlist, toggleWishlist } = useCart();
  const { showToast } = useToast();
  const router = useRouter();
  const inStockVariants = product.variants.filter((v) => v.stock > 0);
  const [size, setSize] = useState(inStockVariants[0]?.size || product.variants[0].size);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [buyNowOpen, setBuyNowOpen] = useState(false);
  const isWishlisted = wishlist.includes(product.handle);

  useEffect(() => {
    pushRecentlyViewed(product.handle);
  }, [product.handle]);

  const selectedVariant = product.variants.find((v) => v.size === size);
  const soldOut = !selectedVariant || selectedVariant.stock === 0;
  const totalStock = product.variants.reduce((s, v) => s + v.stock, 0);
  const allSoldOut = totalStock === 0;

  function handleAdd() {
    if (soldOut) return;
    addItem({
      handle: product.handle,
      name: product.name,
      price: product.price,
      hex: product.hex,
      size,
      qty,
    });
    setAdded(true);
    showToast(`Added ${product.name} (${size}) to cart`, { actionLabel: "View cart", actionHref: "/cart" });
    setTimeout(() => setAdded(false), 1600);
  }

  return (
    <div className="grid md:grid-cols-2 gap-12">
      <ProductGallery product={product} />

      <div>
        <span className="eyebrow">{product.fit}</span>
        <h1 className="font-display text-3xl sm:text-4xl mt-1 mb-3">{product.name}</h1>
        <div className="flex items-center gap-3 mb-4">
          <span className="font-mono text-lg">
            {product.compareAtPrice && (
              <s className="text-ink/40 mr-2 text-sm">৳{product.compareAtPrice}</s>
            )}
            ৳{product.price}
          </span>
          <span className="eyebrow">★ {product.rating} ({product.reviewCount} reviews)</span>
        </div>

        <div className="mb-5">
          <SocialProofBadge handle={product.handle} />
        </div>

        <p className="text-ink/70 max-w-[52ch] mb-7">{product.description}</p>

        {product.category !== "custom" && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="eyebrow">Size</span>
              <SizeGuideModal />
            </div>
            <div className="flex flex-wrap gap-2">
              {product.variants.map((v) => (
                <button
                  key={v.size}
                  disabled={v.stock === 0}
                  onClick={() => setSize(v.size)}
                  className={`px-4 py-2 border rounded-sm font-mono text-xs uppercase tracking-wider
                  ${size === v.size ? "bg-ink text-canvas border-ink" : "border-line"}
                  ${v.stock === 0 ? "opacity-30 line-through cursor-not-allowed" : "hover:border-cobalt"}`}
                >
                  {v.size}
                </button>
              ))}
            </div>
            {selectedVariant && selectedVariant.stock > 0 && selectedVariant.stock <= 5 && (
              <div className="mt-3">
                <div className="flex justify-between font-mono text-xs text-stamp mb-1">
                  <span>Only {selectedVariant.stock} left in {size}</span>
                  <span>Almost gone</span>
                </div>
                <div className="h-1 bg-canvas-dim rounded-full overflow-hidden">
                  <div className="h-full bg-stamp" style={{ width: `${Math.min(100, (selectedVariant.stock / 10) * 100)}%` }} />
                </div>
              </div>
            )}
            {soldOut && !allSoldOut && (
              <NotifyStockForm handle={product.handle} productName={product.name} size={size} />
            )}
          </div>
        )}

        <div className="flex items-center gap-4 mb-7">
          <div className="flex items-center border border-ink rounded-sm">
            <button className="w-9 h-9 font-mono" onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
            <span className="w-9 text-center font-mono text-sm">{qty}</span>
            <button className="w-9 h-9 font-mono" onClick={() => setQty((q) => q + 1)}>+</button>
          </div>
          <button
            onClick={handleAdd}
            disabled={soldOut}
            className={`flex-1 py-3.5 font-mono text-xs uppercase tracking-wider rounded-sm transition-colors
            ${soldOut ? "bg-ink/20 cursor-not-allowed" : added ? "bg-cobalt text-white" : "bg-ink text-canvas hover:bg-cobalt"}`}
          >
            {soldOut ? "Sold out" : added ? "Added ✓" : "Add to cart"}
          </button>
          <button
            onClick={() => toggleWishlist(product.handle)}
            aria-label="Toggle wishlist"
            className="w-11 h-11 border border-line rounded-sm flex items-center justify-center flex-none"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill={isWishlisted ? "#C1432E" : "none"}>
              <path d="M12 20s-7-4.4-9.3-8.8C1.2 8 2.7 5 6 5c1.9 0 3.4 1 4 2.4C10.6 6 12.1 5 14 5c3.3 0 4.8 3 3.3 6.2C15 15.6 12 20 12 20Z" stroke="#17140F" strokeWidth="1.4" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {!soldOut && (
          <button
            onClick={() => setBuyNowOpen(true)}
            className="w-full py-3 border-[1.5px] border-ink font-mono text-xs uppercase tracking-wider rounded-sm hover:bg-ink hover:text-canvas transition-colors mb-3"
          >
            Buy now — express checkout
          </button>
        )}

        {product.podEnabled && (
          <button
            onClick={() => router.push(`/custom?type=${product.category === "caps" ? "cap" : "tee"}&color=${encodeURIComponent(product.hex)}`)}
            className="w-full py-3 bg-cobalt/10 border-[1.5px] border-cobalt text-cobalt font-mono text-xs uppercase tracking-wider rounded-sm hover:bg-cobalt hover:text-white transition-colors mb-3"
          >
            Personalize this design →
          </button>
        )}

        {product.category === "custom" && (
          <button
            onClick={() => router.push("/custom")}
            className="w-full py-3 border-[1.5px] border-ink font-mono text-xs uppercase tracking-wider rounded-sm hover:bg-ink hover:text-canvas transition-colors"
          >
            Open the design studio →
          </button>
        )}

        <QuickBuyModal
          open={buyNowOpen}
          onClose={() => setBuyNowOpen(false)}
          item={{ handle: product.handle, name: product.name, price: product.price, hex: product.hex, size, qty }}
        />

        <div className="mt-8 pt-6 border-t border-dashed border-line font-mono text-xs text-ink/60 space-y-1.5">
          <p>240 GSM heavyweight cotton</p>
          <p>Cash on Delivery available nationwide</p>
          <p>Free delivery over ৳2,000</p>
        </div>
      </div>

      <StickyBuyBar
        product={product}
        soldOut={soldOut}
        onAdd={handleAdd}
        onBuyNow={() => setBuyNowOpen(true)}
      />
    </div>
  );
}
