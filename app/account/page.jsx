"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { getCachedOrders } from "@/lib/orderCache";

export default function AccountPage() {
  const { wishlist, hydrated } = useCart();
  const [wishProducts, setWishProducts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState(null);
  const [lookupError, setLookupError] = useState("");

  useEffect(() => {
    setRecentOrders(getCachedOrders());
  }, []);

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
      <div>
        <span className="eyebrow">Account</span>
        <h1 className="font-display text-3xl mt-1 mb-2">Your Tshophut</h1>
        <p className="text-ink/60 text-sm max-w-[56ch]">
          No sign-in needed — your wishlist and recent orders are saved on this device.
          Switching browsers or clearing site data will reset them; use the order lookup
          below with your order ID or phone number from any device.
        </p>
      </div>

      <section>
        <span className="eyebrow">Recent orders</span>
        <h2 className="font-display text-2xl mt-1 mb-6">Placed from this device</h2>
        {recentOrders.length === 0 ? (
          <p className="font-mono text-sm text-ink/50">
            No orders placed from this device yet — they&apos;ll show up here right after checkout.
          </p>
        ) : (
          <div className="space-y-3">
            {recentOrders.map((o) => (
              <Link
                key={o.id}
                href={`/order-confirmation/${o.id}`}
                className="flex items-center justify-between border border-line bg-paper p-4 hover:border-cobalt transition-colors"
              >
                <div>
                  <p className="font-mono text-sm font-bold">{o.id}</p>
                  <p className="font-mono text-xs text-ink/50">
                    {new Date(o.createdAt).toLocaleDateString()} · {o.items.length} item{o.items.length > 1 ? "s" : ""}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-sm">৳{o.total.toLocaleString()}</p>
                  <p className="font-mono text-xs text-ink/50">{o.status}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section>
        <span className="eyebrow">Wishlist</span>
        <h2 className="font-display text-2xl mt-1 mb-6">Saved for later</h2>
        {wishProducts.length === 0 ? (
          <p className="font-mono text-sm text-ink/50">
            Nothing saved yet — tap the heart on any product to add it here.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {wishProducts.map((p) => (
              <Link key={p.id} href={`/products/${p.handle}`} className="border border-line p-3 flex items-center gap-3 hover:border-cobalt transition-colors">
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
        <h2 className="font-display text-2xl mt-1 mb-2">Look up by order ID</h2>
        <p className="text-ink/60 text-sm mb-5">Placed an order from another device? Look it up here.</p>
        <form onSubmit={trackOrder} className="flex gap-3 mb-4">
          <input
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder="e.g. TSH-123456ABCDE"
            className="flex-1 border border-line rounded-sm px-3.5 py-2.5 text-sm outline-none focus:border-cobalt font-mono"
          />
          <button className="bg-ink text-canvas px-5 font-mono text-xs uppercase tracking-wider rounded-sm hover:bg-cobalt transition-colors">
            Track
          </button>
        </form>
        {lookupError && <p className="font-mono text-sm text-stamp">{lookupError}</p>}
        {order && (
          <Link href={`/order-confirmation/${order.id}`} className="block bg-paper border border-line p-5 hover:border-cobalt transition-colors">
            <p className="font-mono text-sm mb-1">
              <b>{order.id}</b> — {order.status}
            </p>
            <p className="text-ink/60 text-sm">
              {order.items.length} item{order.items.length > 1 ? "s" : ""} · ৳{order.total.toLocaleString()} ·{" "}
              {order.paymentMethod === "cod" ? "Cash on Delivery" : order.paymentMethod}
            </p>
          </Link>
        )}
      </section>
    </main>
  );
}
