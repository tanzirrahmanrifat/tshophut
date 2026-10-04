"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const STATUSES = ["Processing", "Confirmed", "Shipped", "Delivered", "Cancelled"];

export default function OrderStatusSelect({ orderId, status }) {
  const [current, setCurrent] = useState(status);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  async function handleChange(e) {
    const next = e.target.value;
    setCurrent(next);
    setSaving(true);
    await fetch(`/api/admin/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    setSaving(false);
    router.refresh();
  }

  return (
    <select
      value={current}
      onChange={handleChange}
      disabled={saving}
      className="border border-ink rounded-sm px-4 py-2.5 font-mono text-xs uppercase tracking-wider bg-paper disabled:opacity-50"
    >
      {STATUSES.map((s) => (
        <option key={s}>{s}</option>
      ))}
    </select>
  );
}
