"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getCachedOrder } from "@/lib/orderCache";

export default function OrderConfirmationPage({ params }) {
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | found | not-found
  const [fromCache, setFromCache] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetch(`/api/orders/${params.id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled) return;
        if (data?.order) {
          setOrder(data.order);
          setStatus("found");
          return;
        }
        // Server didn't have it (common right after checkout on serverless —
        // see lib/orderCache.js) — fall back to what the browser cached.
        const cached = getCachedOrder(params.id);
        if (cached) {
          setOrder(cached);
          setFromCache(true);
          setStatus("found");
        } else {
          setStatus("not-found");
        }
      })
      .catch(() => {
        const cached = getCachedOrder(params.id);
        if (!cancelled && cached) {
          setOrder(cached);
          setFromCache(true);
          setStatus("found");
        } else if (!cancelled) {
          setStatus("not-found");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [params.id]);

  if (status === "loading") {
    return (
      <main className="max-w-[720px] mx-auto px-5 sm:px-7 py-16 text-center">
        <p className="font-mono text-sm text-ink/50">Loading your order…</p>
      </main>
    );
  }

  if (status === "not-found") {
    return (
      <main className="max-w-[720px] mx-auto px-5 sm:px-7 py-16 text-center">
        <span className="eyebrow">Order lookup</span>
        <h1 className="font-display text-2xl sm:text-3xl mt-2 mb-3">We couldn&apos;t find that order</h1>
        <p className="text-ink/70 mb-8 max-w-[48ch] mx-auto">
          This order ID doesn&apos;t match anything on this device or in our records. If you just placed it,
          try refreshing — otherwise double-check the order ID, or contact us with your phone number from
          checkout.
        </p>
        <Link href="/collections/tees" className="inline-block bg-ink text-canvas px-6 py-3 font-mono text-xs uppercase tracking-wider rounded-sm hover:bg-cobalt transition-colors">
          Back to shop
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-[720px] mx-auto px-5 sm:px-7 py-16 text-center">
      <div className="w-14 h-14 rounded-full bg-cobalt text-white flex items-center justify-center mx-auto mb-6">
        <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none">
          <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <span className="eyebrow">Order confirmed</span>
      <h1 className="font-display text-3xl sm:text-4xl mt-2 mb-3">Thanks, {order.shipping.name.split(" ")[0]}.</h1>
      <p className="text-ink/70 mb-2">
        Order <b className="font-mono">{order.id}</b> is confirmed for Cash on Delivery.
        We&apos;ll call {order.shipping.phone} before it ships.
      </p>
      {fromCache && (
        <p className="font-mono text-[11px] text-ink/40 mb-8">
          Showing the copy saved on this device.
        </p>
      )}
      {!fromCache && <div className="mb-8" />}

      <div className="bg-paper border border-line p-6 text-left mb-8">
        <span className="eyebrow block mb-4">Order summary</span>
        <div className="space-y-2 mb-4">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex justify-between text-sm">
              <span>
                {item.name} <span className="text-ink/45">({item.size}) × {item.qty}</span>
              </span>
              <span className="font-mono">৳{(item.price * item.qty).toLocaleString()}</span>
            </div>
          ))}
        </div>
        <hr className="border-line mb-3" />
        <div className="flex justify-between font-mono text-sm mb-1">
          <span>Subtotal</span>
          <span>৳{order.subtotal.toLocaleString()}</span>
        </div>
        {order.discountAmount > 0 && (
          <div className="flex justify-between font-mono text-sm mb-1 text-cobalt">
            <span>Discount {order.discountCode ? `(${order.discountCode})` : ""}</span>
            <span>−৳{order.discountAmount.toLocaleString()}</span>
          </div>
        )}
        <div className="flex justify-between font-mono text-sm mb-1">
          <span>Shipping</span>
          <span>{order.shippingFee === 0 ? "Free" : `৳${order.shippingFee}`}</span>
        </div>
        <div className="flex justify-between font-mono text-base font-bold">
          <span>Total</span>
          <span>৳{order.total.toLocaleString()}</span>
        </div>
      </div>

      <Link href="/collections/tees" className="inline-block bg-ink text-canvas px-6 py-3 font-mono text-xs uppercase tracking-wider rounded-sm hover:bg-cobalt transition-colors">
        Keep shopping
      </Link>
    </main>
  );
}
