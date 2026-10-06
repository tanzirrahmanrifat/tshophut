"use client";

import { useState } from "react";

export default function NotifyStockForm({ handle, productName, size }) {
  const [contact, setContact] = useState("");
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!contact.trim()) return;
    setSubmitting(true);
    await fetch("/api/notify-stock", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ handle, productName, size, contact }),
    });
    setSubmitting(false);
    setSent(true);
  }

  if (sent) {
    return (
      <p className="font-mono text-xs text-cobalt mt-2">
        You&apos;re on the list — we&apos;ll reach out when {size} is back.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mt-2">
      <input
        value={contact}
        onChange={(e) => setContact(e.target.value)}
        placeholder="Phone or email for a restock alert"
        required
        className="flex-1 border border-line rounded-sm px-3 py-2 text-xs font-mono outline-none focus:border-cobalt bg-paper"
      />
      <button
        type="submit"
        disabled={submitting}
        className="px-3.5 py-2 bg-ink text-canvas font-mono text-[11px] uppercase tracking-wider rounded-sm hover:bg-cobalt transition-colors disabled:opacity-50"
      >
        {submitting ? "…" : "Notify me"}
      </button>
    </form>
  );
}
