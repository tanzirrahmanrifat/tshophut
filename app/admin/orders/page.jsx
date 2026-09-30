"use client";

import { useEffect, useState } from "react";

const STATUSES = ["Processing", "Confirmed", "Shipped", "Delivered", "Cancelled"];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState(null);

  function load() {
    fetch("/api/admin/orders")
      .then((r) => {
        if (r.status === 401) {
          window.location.href = "/admin";
          return { orders: [] };
        }
        return r.json();
      })
      .then((data) => setOrders(data.orders || []));
  }

  useEffect(load, []);

  async function setStatus(id, status) {
    await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    load();
  }

  if (orders === null) {
    return <main className="max-w-[1220px] mx-auto px-5 sm:px-7 py-14">Loading…</main>;
  }

  return (
    <main className="max-w-[1220px] mx-auto px-5 sm:px-7 py-14">
      <span className="eyebrow">Admin</span>
      <h1 className="font-display text-3xl sm:text-4xl mt-1 mb-10">Orders</h1>

      {orders.length === 0 ? (
        <p className="font-mono text-sm text-ink/50">No orders yet.</p>
      ) : (
        <div className="space-y-3">
          {orders.map((o) => (
            <div key={o.id} className="border border-line p-5">
              <div className="flex items-center justify-between flex-wrap gap-3 mb-3">
                <div>
                  <p className="font-mono font-bold">{o.id}</p>
                  <p className="font-mono text-xs text-ink/50">
                    {new Date(o.createdAt).toLocaleString()} · {o.shipping.name} · {o.shipping.phone}
                  </p>
                </div>
                <select
                  value={o.status}
                  onChange={(e) => setStatus(o.id, e.target.value)}
                  className="border border-line rounded-sm px-3 py-1.5 font-mono text-xs uppercase tracking-wider"
                >
                  {STATUSES.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="text-sm text-ink/70 mb-2">
                {o.items.map((i) => `${i.name} (${i.size}) × ${i.qty}`).join(", ")}
              </div>
              <div className="flex justify-between font-mono text-sm">
                <span>{o.shipping.address}, {o.shipping.city}</span>
                <span className="font-bold">৳{o.total.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
