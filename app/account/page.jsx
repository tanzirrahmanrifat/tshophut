"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function AccountPage() {
  const { wishlist, hydrated } = useCart();
  const [wishProducts, setWishProducts] = useState([]);
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState(null);
  const [lookupError, setLookupError] = useState("");

  useEffect(() => {
    if (!hydrated || wishlist.length === 0) {
      setWishProducts([]);
      return;
    }
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => setWishProducts((data.products || []).filter((p) => wishlist.includes(p.handle))));
  }, [wishlist, hydrated]);

  async function trackOrder(e) {
    e.preventDefault();
    setLookupError("");
    setOrder(null);
    const res = await fetch(`/api/orders/${orderId.trim()}`);
    if (!res.ok) {
      setLookupError("No order found with that ID.");
      return;
    }
    const data = await res.json();
    setOrder(data.order);
  }

  return (
    <main className="max-w-[900px] mx-auto px-5 sm:px-7 py-14 space-y-16">
      <section>
        <span className="eyebrow">Wishlist</span>
        <h1 className="font-display text-3xl mt-1 mb-6">Saved for later</h1>
        {wishProducts.length === 0 ? (
          <p className="font-mono text-sm text-ink/50">
            Nothing saved yet — tap the heart on any product to add it here.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {wishProducts.map((p) => (
              <Link key={p.id} href={`/products/${p.handle}`} className="border border-line p-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex-none" style={{ background: p.hex }} />
                <div>
                  <p className="text-sm font-semibold">{p.name}</p>
                  <p className="font-mono text-xs text-ink/50">৳{p.price}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section>
        <span className="eyebrow">Track an order</span>
        <h2 className="font-display text-2xl mt-1 mb-5">Order lookup</h2>
        <form onSubmit={trackOrder} className="flex gap-3 mb-4">
          <input
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder="e.g. TSH-123456ABCDE"
            className="flex-1 border border-line rounded-sm px-3.5 py-2.5 text-sm outline-none focus:border-cobalt font-mono"
          />
          <button className="bg-ink text-canvas px-5 font-mono text-xs uppercase tracking-wider rounded-sm">
            Track
          </button>
        </form>
        {lookupError && <p className="font-mono text-sm text-stamp">{lookupError}</p>}
        {order && (
          <div className="bg-paper border border-line p-5">
            <p className="font-mono text-sm mb-1">
              <b>{order.id}</b> — {order.status}
            </p>
            <p className="text-ink/60 text-sm">
              {order.items.length} item{order.items.length > 1 ? "s" : ""} · ৳{order.total.toLocaleString()} ·{" "}
              {order.paymentMethod === "cod" ? "Cash on Delivery" : order.paymentMethod}
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
