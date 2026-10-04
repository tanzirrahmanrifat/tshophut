"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { items, updateQty, removeItem, subtotal, hydrated, settings } = useCart();
  const threshold = settings.freeShippingThreshold;
  const remaining = Math.max(0, threshold - subtotal);
  const progress = Math.min(100, (subtotal / threshold) * 100);

  if (!hydrated) return null;

  return (
    <main className="max-w-[900px] mx-auto px-5 sm:px-7 py-14">
      <h1 className="font-display text-3xl sm:text-4xl mb-10">Your Cart</h1>

      {items.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-ink/60 font-mono text-sm mb-6">Your cart is empty.</p>
          <Link href="/collections/tees" className="bg-ink text-canvas px-6 py-3 font-mono text-xs uppercase tracking-wider rounded-sm">
            Shop the drop
          </Link>
        </div>
      ) : (
        <>
          <div className="mb-8">
            <p className="font-mono text-xs text-ink/60 mb-2">
              {remaining === 0 ? (
                <span className="text-cobalt">You&apos;ve unlocked free shipping 🎉</span>
              ) : (
                <>Add <b>৳{remaining.toLocaleString()}</b> more for free shipping</>
              )}
            </p>
            <div className="h-1.5 bg-canvas-dim rounded-full overflow-hidden">
              <div className="h-full bg-cobalt transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <div className="space-y-5 mb-10">
            {items.map((item, idx) => (
              <div key={idx} className="flex gap-5 border-b border-line pb-5">
                <div className="w-20 h-20 flex-none rounded-sm flex items-center justify-center" style={{ background: item.hex + "22" }}>
                  <div className="w-10 h-10 rounded-full" style={{ background: item.hex }} />
                </div>
                <div className="flex-1">
                  <p className="font-semibold">{item.name}</p>
                  <p className="eyebrow mt-1">
                    Size {item.size}
                    {item.customSignature ? " · custom design" : ""}
                  </p>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border border-ink rounded-sm">
                      <button className="w-8 h-8 font-mono" onClick={() => updateQty(item, item.qty - 1)}>−</button>
                      <span className="w-8 text-center font-mono text-sm">{item.qty}</span>
                      <button className="w-8 h-8 font-mono" onClick={() => updateQty(item, item.qty + 1)}>+</button>
                    </div>
                    <span className="font-mono">৳ {(item.price * item.qty).toLocaleString()}</span>
                  </div>
                </div>
                <button onClick={() => removeItem(item)} className="text-ink/40 hover:text-stamp self-start text-xl leading-none">
                  &times;
                </button>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center mb-6 font-mono">
            <span className="text-ink/70">Subtotal</span>
            <span className="text-lg">৳ {subtotal.toLocaleString()}</span>
          </div>
          <Link
            href="/checkout"
            className="block text-center bg-ink text-canvas py-3.5 font-mono text-xs uppercase tracking-wider rounded-sm hover:bg-cobalt transition-colors"
          >
            Proceed to checkout
          </Link>
        </>
      )}
    </main>
  );
}
