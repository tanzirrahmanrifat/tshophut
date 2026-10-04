"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function QuickBuyModal({ open, onClose, item }) {
  const { settings } = useCart();
  const [form, setForm] = useState({ name: "", phone: "", address: "", city: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [order, setOrder] = useState(null);

  if (!open) return null;

  const lineTotal = (item?.price || 0) * (item?.qty || 1);
  const shippingFee = lineTotal >= settings.freeShippingThreshold ? 0 : settings.standardShippingFee;
  const total = lineTotal + shippingFee;

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: [item], shipping: form, paymentMethod: "cod" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Checkout failed");
      setOrder(data.order);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  function handleClose() {
    setOrder(null);
    setForm({ name: "", phone: "", address: "", city: "" });
    setError("");
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div onClick={handleClose} className="absolute inset-0 bg-ink/50 backdrop-blur-[1px]" />
      <div className="relative bg-paper w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-sm shadow-2xl">
        <div className="flex items-center justify-between px-6 sm:px-7 py-5 border-b border-line sticky top-0 bg-paper z-10">
          <div>
            <span className="eyebrow">{order ? "Order confirmed" : "Express checkout"}</span>
            <h3 className="font-display text-xl mt-0.5">{order ? "You're all set" : "Buy now"}</h3>
          </div>
          <button onClick={handleClose} aria-label="Close" className="text-2xl leading-none text-ink/40 hover:text-ink">
            &times;
          </button>
        </div>

        {order ? (
          <div className="text-center px-6 sm:px-7 py-10">
            <div className="w-12 h-12 rounded-full bg-cobalt text-white flex items-center justify-center mx-auto mb-4">
              <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
                <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3 className="font-display text-2xl mb-2">Thanks, {form.name.split(" ")[0]}.</h3>
            <p className="text-ink/70 text-sm mb-6">
              Order <b className="font-mono">{order.id}</b> is on its way — Cash on Delivery, ৳{order.total.toLocaleString()} total.
            </p>
            <div className="flex gap-3 justify-center">
              <Link
                href={`/order-confirmation/${order.id}`}
                className="bg-ink text-canvas px-5 py-2.5 font-mono text-xs uppercase tracking-wider rounded-sm hover:bg-cobalt transition-colors"
              >
                View order
              </Link>
              <button onClick={handleClose} className="border border-line px-5 py-2.5 font-mono text-xs uppercase tracking-wider rounded-sm">
                Keep shopping
              </button>
            </div>
          </div>
        ) : (
          <div className="px-6 sm:px-7 py-6">
            <div className="flex items-center gap-3.5 mb-6 pb-5 border-b border-dashed border-line">
              <div className="w-14 h-14 rounded-sm flex-none" style={{ background: (item?.hex || "#17140F") + "22" }}>
                <div className="w-full h-full rounded-sm" style={{ background: item?.hex, opacity: 0.85 }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate">{item?.name}</p>
                <p className="font-mono text-xs text-ink/50">
                  {item?.size} · qty {item?.qty}
                </p>
              </div>
              <span className="font-mono text-sm font-bold flex-none">৳{lineTotal.toLocaleString()}</span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <QField label="Full name" value={form.name} onChange={(v) => update("name", v)} required />
                <QField label="Phone number" value={form.phone} onChange={(v) => update("phone", v)} required />
              </div>
              <QField label="City" value={form.city} onChange={(v) => update("city", v)} required />
              <QField label="Full address" value={form.address} onChange={(v) => update("address", v)} required textarea />

              <div className="flex items-center justify-between px-3.5 py-3 border border-cobalt/30 bg-cobalt/5 rounded-sm">
                <span className="text-sm font-semibold">Cash on Delivery</span>
                <span className="w-4 h-4 rounded-full border-2 border-cobalt bg-cobalt flex-none" />
              </div>

              <div className="pt-2 space-y-1.5 font-mono text-sm">
                <div className="flex justify-between text-ink/60">
                  <span>Subtotal</span>
                  <span>৳{lineTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-ink/60">
                  <span>Shipping</span>
                  <span>{shippingFee === 0 ? "Free" : `৳${shippingFee}`}</span>
                </div>
                <div className="flex justify-between text-base font-bold pt-1.5 border-t border-line">
                  <span>Total</span>
                  <span>৳{total.toLocaleString()}</span>
                </div>
              </div>

              {error && <p className="text-stamp font-mono text-xs">{error}</p>}

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-ink text-canvas py-3.5 font-mono text-xs uppercase tracking-wider rounded-sm hover:bg-cobalt transition-colors disabled:opacity-50"
              >
                {submitting ? "Placing order…" : `Place order · ৳${total.toLocaleString()}`}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

function QField({ label, value, onChange, required, textarea }) {
  const Tag = textarea ? "textarea" : "input";
  return (
    <label className="block">
      <span className="font-mono text-[11px] uppercase tracking-wider text-ink/50 block mb-1">{label}</span>
      <Tag
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        rows={textarea ? 2 : undefined}
        className="w-full border border-line rounded-sm px-3 py-2 bg-canvas text-sm outline-none focus:border-cobalt"
      />
    </label>
  );
}
