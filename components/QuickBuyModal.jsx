"use client";

import { useState } from "react";
import Link from "next/link";

export default function QuickBuyModal({ open, onClose, item }) {
  const [form, setForm] = useState({ name: "", phone: "", address: "", city: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [order, setOrder] = useState(null);

  if (!open) return null;

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
      <div onClick={handleClose} className="absolute inset-0 bg-ink/50" />
      <div className="relative bg-paper w-full max-w-md max-h-[90vh] overflow-y-auto p-6 sm:p-7 rounded-sm">
        <button onClick={handleClose} aria-label="Close" className="absolute top-4 right-4 text-2xl leading-none">
          &times;
        </button>

        {order ? (
          <div className="text-center py-6">
            <div className="w-12 h-12 rounded-full bg-cobalt text-white flex items-center justify-center mx-auto mb-4">
              <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
                <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="eyebrow">Order confirmed</span>
            <h3 className="font-display text-2xl mt-2 mb-2">Thanks, {form.name.split(" ")[0]}.</h3>
            <p className="text-ink/70 text-sm mb-6">
              Order <b className="font-mono">{order.id}</b> is on its way — Cash on Delivery, ৳{order.total.toLocaleString()} total.
            </p>
            <div className="flex gap-3 justify-center">
              <Link
                href={`/order-confirmation/${order.id}`}
                className="bg-ink text-canvas px-5 py-2.5 font-mono text-xs uppercase tracking-wider rounded-sm"
              >
                View order
              </Link>
              <button onClick={handleClose} className="border border-line px-5 py-2.5 font-mono text-xs uppercase tracking-wider rounded-sm">
                Keep shopping
              </button>
            </div>
          </div>
        ) : (
          <>
            <span className="eyebrow">Quick checkout</span>
            <h3 className="font-display text-2xl mt-1 mb-1">Buy now</h3>
            <p className="text-ink/60 text-sm mb-5">
              {item?.name} ({item?.size}) × {item?.qty} · <span className="font-mono">৳{(item?.price * item?.qty).toLocaleString()}</span>
            </p>

            <form onSubmit={handleSubmit} className="space-y-3">
              <QField label="Full name" value={form.name} onChange={(v) => update("name", v)} required />
              <QField label="Phone number" value={form.phone} onChange={(v) => update("phone", v)} required />
              <QField label="City" value={form.city} onChange={(v) => update("city", v)} required />
              <QField label="Full address" value={form.address} onChange={(v) => update("address", v)} required textarea />

              <div className="flex items-center justify-between px-3.5 py-3 border border-cobalt/30 bg-cobalt/5 rounded-sm">
                <span className="text-sm font-semibold">Cash on Delivery</span>
                <span className="w-4 h-4 rounded-full border-2 border-cobalt bg-cobalt" />
              </div>

              {error && <p className="text-stamp font-mono text-xs">{error}</p>}

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-ink text-canvas py-3 font-mono text-xs uppercase tracking-wider rounded-sm hover:bg-cobalt transition-colors disabled:opacity-50"
              >
                {submitting ? "Placing order…" : `Place order · ৳${(item?.price * item?.qty).toLocaleString()}`}
              </button>
            </form>
          </>
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
