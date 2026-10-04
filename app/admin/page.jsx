import Link from "next/link";
import { getProducts, getOrders } from "@/lib/db";
import MiniBarChart from "@/components/MiniBarChart";

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function AdminHome() {
  const products = getProducts();
  const orders = getOrders();

  const lowStock = products.filter((p) => p.variants.some((v) => v.stock > 0 && v.stock <= 5));
  const outOfStock = products.filter((p) => p.variants.every((v) => v.stock === 0));
  const revenue = orders.reduce((sum, o) => sum + o.total, 0);
  const avgOrderValue = orders.length ? Math.round(revenue / orders.length) : 0;

  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    d.setHours(0, 0, 0, 0);
    const next = new Date(d);
    next.setDate(next.getDate() + 1);
    const dayOrders = orders.filter((o) => {
      const created = new Date(o.createdAt);
      return created >= d && created < next;
    });
    return { label: DAY_LABELS[d.getDay()], value: dayOrders.reduce((s, o) => s + o.total, 0) };
  });

  const statusCounts = orders.reduce((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {});
  const STATUS_ORDER = ["Processing", "Confirmed", "Shipped", "Delivered", "Cancelled"];

  const recentOrders = orders.slice(0, 5);

  return (
    <main className="px-5 sm:px-8 py-10 max-w-[1400px] mx-auto">
      <div className="mb-8">
        <span className="eyebrow">Overview</span>
        <h1 className="font-display text-3xl sm:text-4xl mt-1">Dashboard</h1>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Stat label="Total orders" value={orders.length} />
        <Stat label="Revenue (COD)" value={`৳${revenue.toLocaleString()}`} />
        <Stat label="Avg. order value" value={`৳${avgOrderValue.toLocaleString()}`} />
        <Stat label="Low / out of stock" value={`${lowStock.length} / ${outOfStock.length}`} tone={lowStock.length ? "warn" : undefined} />
      </div>

      <div className="grid lg:grid-cols-[1.3fr_1fr] gap-5 mb-8">
        <div className="border border-line bg-paper p-6">
          <span className="eyebrow block mb-4">Revenue — last 7 days</span>
          <MiniBarChart data={last7} />
        </div>
        <div className="border border-line bg-paper p-6">
          <span className="eyebrow block mb-4">Orders by status</span>
          <div className="space-y-3">
            {STATUS_ORDER.map((s) => {
              const count = statusCounts[s] || 0;
              const pct = orders.length ? Math.round((count / orders.length) * 100) : 0;
              return (
                <div key={s}>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span>{s}</span>
                    <span className="text-ink/50">{count}</span>
                  </div>
                  <div className="h-1.5 bg-canvas-dim rounded-full overflow-hidden">
                    <div className="h-full bg-cobalt" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
            {orders.length === 0 && <p className="font-mono text-xs text-ink/45">No orders yet.</p>}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-5 mb-8">
        <div className="border border-line bg-paper p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="eyebrow">Recent orders</span>
            <Link href="/admin/orders" className="font-mono text-[11px] uppercase tracking-wider underline">
              View all
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <p className="font-mono text-xs text-ink/45">No orders yet.</p>
          ) : (
            <div className="space-y-2.5">
              {recentOrders.map((o) => (
                <Link
                  key={o.id}
                  href={`/admin/orders/${o.id}`}
                  className="flex items-center justify-between text-sm border-b border-dashed border-line pb-2.5 last:border-0"
                >
                  <div>
                    <p className="font-mono font-semibold text-xs">{o.id}</p>
                    <p className="font-mono text-[11px] text-ink/45">{o.shipping.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-xs">৳{o.total.toLocaleString()}</p>
                    <p className="font-mono text-[11px] text-ink/45">{o.status}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="border border-line bg-paper p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="eyebrow">Low stock</span>
            <Link href="/admin/products" className="font-mono text-[11px] uppercase tracking-wider underline">
              Manage
            </Link>
          </div>
          {lowStock.length === 0 ? (
            <p className="font-mono text-xs text-ink/45">Nothing low on stock right now.</p>
          ) : (
            <div className="space-y-2.5">
              {lowStock.slice(0, 6).map((p) => (
                <div key={p.id} className="flex items-center justify-between text-sm border-b border-dashed border-line pb-2.5 last:border-0">
                  <div className="flex items-center gap-2.5">
                    <span className="w-3 h-3 rounded-full flex-none" style={{ background: p.hex }} />
                    <span className="font-semibold text-xs">{p.name}</span>
                  </div>
                  <span className="font-mono text-[11px] text-stamp">
                    {p.variants.filter((v) => v.stock > 0 && v.stock <= 5).map((v) => `${v.size}: ${v.stock}`).join(", ")}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-5">
        <Link href="/admin/products" className="border border-line p-6 hover:border-cobalt transition-colors bg-paper">
          <h2 className="font-display text-lg mb-2">Manage products</h2>
          <p className="text-ink/60 text-sm">Add, edit, or remove products, stock, and Print on Demand access.</p>
        </Link>
        <Link href="/admin/orders" className="border border-line p-6 hover:border-cobalt transition-colors bg-paper">
          <h2 className="font-display text-lg mb-2">Manage orders</h2>
          <p className="text-ink/60 text-sm">Search, filter, export, and update fulfillment status.</p>
        </Link>
        <Link href="/admin/discounts" className="border border-line p-6 hover:border-cobalt transition-colors bg-paper">
          <h2 className="font-display text-lg mb-2">Manage discounts</h2>
          <p className="text-ink/60 text-sm">Create and edit the promo codes customers can apply at checkout.</p>
        </Link>
      </div>
    </main>
  );
}

function Stat({ label, value, tone }) {
  return (
    <div className="border border-line bg-paper p-5">
      <span className="eyebrow block mb-2">{label}</span>
      <b className={`font-display text-2xl sm:text-3xl ${tone === "warn" ? "text-stamp" : ""}`}>{value}</b>
    </div>
  );
}
