import Link from "next/link";
import { isAdminAuthed } from "@/lib/adminAuth";
import { getProducts, getOrders } from "@/lib/db";
import AdminLoginForm from "@/components/AdminLoginForm";
import AdminSignOut from "@/components/AdminSignOut";

export default function AdminHome() {
  if (!isAdminAuthed()) {
    return (
      <main className="max-w-[1220px] mx-auto px-5 sm:px-7">
        <AdminLoginForm />
      </main>
    );
  }

  const products = getProducts();
  const orders = getOrders();
  const lowStock = products.filter((p) => p.variants.some((v) => v.stock > 0 && v.stock <= 5));
  const revenue = orders.reduce((sum, o) => sum + o.total, 0);

  return (
    <main className="max-w-[1220px] mx-auto px-5 sm:px-7 py-14">
      <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
        <div>
          <span className="eyebrow">Admin</span>
          <h1 className="font-display text-3xl sm:text-4xl mt-1">Dashboard</h1>
        </div>
        <AdminSignOut />
      </div>

      <div className="grid sm:grid-cols-3 gap-5 mb-12">
        <Stat label="Total orders" value={orders.length} />
        <Stat label="Revenue (COD)" value={`৳${revenue.toLocaleString()}`} />
        <Stat label="Products low on stock" value={lowStock.length} />
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <Link href="/admin/products" className="border border-line p-6 hover:border-cobalt transition-colors">
          <h2 className="font-display text-xl mb-2">Manage products</h2>
          <p className="text-ink/60 text-sm">Add, edit, or remove products and inventory.</p>
        </Link>
        <Link href="/admin/orders" className="border border-line p-6 hover:border-cobalt transition-colors">
          <h2 className="font-display text-xl mb-2">Manage orders</h2>
          <p className="text-ink/60 text-sm">View incoming orders and update fulfillment status.</p>
        </Link>
      </div>
    </main>
  );
}

function Stat({ label, value }) {
  return (
    <div className="border border-line p-5">
      <span className="eyebrow block mb-2">{label}</span>
      <b className="font-display text-3xl">{value}</b>
    </div>
  );
}
