"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function CartDrawer({ open, onClose }) {
  const { items, updateQty, removeItem, subtotal, settings } = useCart();
  const threshold = settings.freeShippingThreshold;
  const remaining = Math.max(0, threshold - subtotal);
  const progress = Math.min(100, (subtotal / threshold) * 100);

  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-ink/40 z-50 transition-opacity ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />
      <aside
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-paper z-50 flex flex-col
        transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-line">
          <h2 className="font-display text-xl">Your Cart</h2>
          <button onClick={onClose} aria-label="Close cart" className="text-2xl leading-none">
            &times;
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
          {items.length > 0 && (
            <div className="pb-1">
              <p className="font-mono text-[11px] text-ink/60 mb-2">
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
          )}
          {items.length === 0 && (
            <p className="text-ink/60 font-mono text-sm mt-8 text-center">
              Your cart is empty.
            </p>
          )}
          {items.map((item, idx) => (
            <div key={idx} className="flex gap-4 border-b border-dashed border-line pb-4">
              <div
                className="w-16 h-16 flex-none rounded-sm flex items-center justify-center"
                style={{ background: item.hex + "22" }}
              >
                <div className="w-8 h-8 rounded-full" style={{ background: item.hex }} />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm">{item.name}</p>
                <p className="eyebrow mt-0.5">
                  {item.size}
                  {item.customSignature ? " · custom design" : ""}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center border border-ink rounded-sm">
                    <button
                      className="w-7 h-7 font-mono"
                      onClick={() => updateQty(item, item.qty - 1)}
                    >
                      −
                    </button>
                    <span className="w-7 text-center font-mono text-xs">{item.qty}</span>
                    <button
                      className="w-7 h-7 font-mono"
                      onClick={() => updateQty(item, item.qty + 1)}
                    >
                      +
                    </button>
                  </div>
                  <span className="font-mono text-sm">৳ {(item.price * item.qty).toLocaleString()}</span>
                </div>
              </div>
              <button
                onClick={() => removeItem(item)}
                aria-label="Remove item"
                className="text-ink/40 hover:text-stamp text-lg leading-none"
              >
                &times;
              </button>
            </div>
          ))}
        </div>

        <div className="px-6 py-5 border-t border-line space-y-3">
          <div className="flex justify-between font-mono text-sm">
            <span>Subtotal</span>
            <span>৳ {subtotal.toLocaleString()}</span>
          </div>
          <Link
            href="/checkout"
            onClick={onClose}
            className={`btn-primary block text-center py-3 font-mono text-xs uppercase tracking-wider rounded-sm ${
              items.length === 0 ? "pointer-events-none opacity-40" : ""
            } bg-ink text-canvas hover:bg-cobalt transition-colors`}
          >
            Checkout
          </Link>
          <Link
            href="/cart"
            onClick={onClose}
            className="block text-center font-mono text-xs uppercase tracking-wider underline"
          >
            View full cart
          </Link>
        </div>
      </aside>
    </>
  );
}
