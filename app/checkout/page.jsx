"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

export default function CheckoutPage() {
  const { items, subtotal, clearCart, hydrated } = useCart();
  const router = useRouter();
  const [form, setForm] = useState({ name: "", phone: "", address: "", city: "", note: "" });
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const shippingFee = subtotal >= 2000 || subtotal === 0 ? 0 : 80;
  const total = subtotal + shippingFee;

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (items.length === 0) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, shipping: form, paymentMethod }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Checkout failed");
      clearCart();
      router.push(`/order-confirmation/${data.order.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (!hydrated) return null;

  if (items.length === 0) {
    return (
      <main className="max-w-[900px] mx-auto px-5 sm:px-7 py-20 text-center">
        <p className="text-ink/60 font-mono text-sm">Your cart is empty — nothing to check out.</p>
      </main>
    );
  }

  return (
    <main className="max-w-[1000px] mx-auto px-5 sm:px-7 py-14">
      <h1 className="font-display text-3xl sm:text-4xl mb-10">Checkout</h1>
      <div className="grid md:grid-cols-[1.1fr_.9fr] gap-12">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <span className="eyebrow block mb-2">Shipping details</span>
            <div className="space-y-3">
              <Input label="Full name" value={form.name} onChange={(v) => update("name", v)} required />
              <Input label="Phone number" value={form.phone} onChange={(v) => update("phone", v)} required />
              <Input label="City" value={form.city} onChange={(v) => update("city", v)} required />
              <Input label="Full address" value={form.address} onChange={(v) => update("address", v)} required textarea />
              <Input label="Order note (optional)" value={form.note} onChange={(v) => update("note", v)} textarea />
            </div>
          </div>

          <div>
            <span className="eyebrow block mb-2">Payment method</span>
            <div className="space-y-2">
              <PaymentOption
                id="cod"
                label="Cash on Delivery"
                sub="Pay when your order arrives"
                active={paymentMethod === "cod"}
                onSelect={() => setPaymentMethod("cod")}
              />
              <PaymentOption id="bkash" label="bKash" sub="Coming soon" disabled />
              <PaymentOption id="card" label="Credit / Debit Card" sub="Coming soon" disabled />
            </div>
          </div>

          {error && <p className="text-stamp font-mono text-sm">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-ink text-canvas py-3.5 font-mono text-xs uppercase tracking-wider rounded-sm hover:bg-cobalt transition-colors disabled:opacity-50"
          >
            {submitting ? "Placing order…" : `Place order · ৳${total.toLocaleString()}`}
          </button>
        </form>

        <div className="bg-paper border border-line p-6 h-fit">
          <span className="eyebrow block mb-4">Order summary</span>
          <div className="space-y-3 mb-5">
            {items.map((item, idx) => (
              <div key={idx} className="flex justify-between text-sm">
                <span>
                  {item.name} <span className="text-ink/45">× {item.qty}</span>
                </span>
                <span className="font-mono">৳{(item.price * item.qty).toLocaleString()}</span>
              </div>
            ))}
          </div>
          <hr className="border-line mb-4" />
          <div className="space-y-1.5 font-mono text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>৳{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{shippingFee === 0 ? "Free" : `৳${shippingFee}`}</span>
            </div>
            <div className="flex justify-between text-base pt-2 border-t border-line mt-2">
              <span>Total</span>
              <span>৳{total.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function Input({ label, value, onChange, required, textarea }) {
  const Tag = textarea ? "textarea" : "input";
  return (
    <label className="block">
      <span className="font-mono text-[11px] uppercase tracking-wider text-ink/50 block mb-1.5">{label}</span>
      <Tag
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        rows={textarea ? 3 : undefined}
        className="w-full border border-line rounded-sm px-3.5 py-2.5 bg-paper text-sm outline-none focus:border-cobalt"
      />
    </label>
  );
}

function PaymentOption({ label, sub, active, disabled, onSelect }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      className={`w-full flex items-center justify-between px-4 py-3.5 border rounded-sm text-left
      ${active ? "border-cobalt bg-cobalt/5" : "border-line"}
      ${disabled ? "opacity-40 cursor-not-allowed" : ""}`}
    >
      <span>
        <span className="block font-semibold text-sm">{label}</span>
        <span className="block font-mono text-[11px] text-ink/50">{sub}</span>
      </span>
      <span className={`w-4 h-4 rounded-full border-2 ${active ? "border-cobalt bg-cobalt" : "border-ink/30"}`} />
    </button>
  );
}
