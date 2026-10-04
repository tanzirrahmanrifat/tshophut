"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

const STATUSES = ["Processing", "Confirmed", "Shipped", "Delivered", "Cancelled"];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

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
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
  }

  const filtered = useMemo(() => {
    if (!orders) return [];
    return orders.filter((o) => {
      const matchesStatus = statusFilter === "All" || o.status === statusFilter;
      const q = query.toLowerCase();
      const matchesQuery =
        !q || o.id.toLowerCase().includes(q) || o.shipping.phone.includes(q) || o.shipping.name.toLowerCase().includes(q);
      return matchesStatus && matchesQuery;
    });
  }, [orders, query, statusFilter]);

  function exportCsv() {
    const rows = [
      ["Order ID", "Date", "Status", "Customer", "Phone", "City", "Items", "Subtotal", "Discount", "Shipping", "Total"],
      ...filtered.map((o) => [
        o.id,
        new Date(o.createdAt).toISOString(),
        o.status,
        o.shipping.name,
        o.shipping.phone,
        o.shipping.city,
        o.items.map((i) => `${i.name} (${i.size}) x${i.qty}`).join(" | "),
        o.subtotal,
        o.discountAmount || 0,
        o.shippingFee,
        o.total,
      ]),
    ];
    const csv = rows.map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tshophut-orders-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (orders === null) {
    return <main className="px-5 sm:px-8 py-10 max-w-[1400px] mx-auto">Loading…</main>;
  }

  return (
    <main className="px-5 sm:px-8 py-10 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
        <div>
          <span className="eyebrow">Admin</span>
          <h1 className="font-display text-3xl sm:text-4xl mt-1">Orders</h1>
        </div>
        <button
          onClick={exportCsv}
          disabled={filtered.length === 0}
          className="border border-ink px-4 py-2 font-mono text-xs uppercase tracking-wider rounded-sm hover:bg-ink hover:text-canvas transition-colors disabled:opacity-40"
        >
          Export CSV
        </button>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search order ID, name, or phone…"
          className="flex-1 min-w-[220px] border border-line rounded-sm px-3.5 py-2 text-sm font-mono outline-none focus:border-cobalt bg-paper"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-line rounded-sm px-3 py-2 font-mono text-xs uppercase tracking-wider bg-paper"
        >
          <option>All</option>
          {STATUSES.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className="font-mono text-sm text-ink/50">No orders match.</p>
      ) : (
        <div className="space-y-3">
          {filtered.map((o) => (
            <div key={o.id} className="border border-line bg-paper p-5">
              <div className="flex items-center justify-between flex-wrap gap-3 mb-3">
                <div>
                  <Link href={`/admin/orders/${o.id}`} className="font-mono font-bold hover:underline">
                    {o.id}
                  </Link>
                  <p className="font-mono text-xs text-ink/50">
                    {new Date(o.createdAt).toLocaleString()} · {o.shipping.name} · {o.shipping.phone}
                  </p>
                </div>
                <select
                  value={o.status}
                  onChange={(e) => setStatus(o.id, e.target.value)}
                  className="border border-line rounded-sm px-3 py-1.5 font-mono text-xs uppercase tracking-wider bg-paper"
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
