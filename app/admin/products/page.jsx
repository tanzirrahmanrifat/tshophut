"use client";

import { useEffect, useState } from "react";

const BLANK = {
  name: "",
  handle: "",
  category: "tees",
  fit: "Regular Fit",
  color: "Ink Black",
  hex: "#17140F",
  price: 850,
  compareAtPrice: "",
  description: "",
  featured: false,
  isNew: true,
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState(null);
  const [form, setForm] = useState(BLANK);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  function load() {
    fetch("/api/admin/products")
      .then((r) => {
        if (r.status === 401) {
          window.location.href = "/admin";
          return { products: [] };
        }
        return r.json();
      })
      .then((data) => setProducts(data.products || []));
  }

  useEffect(load, []);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function startEdit(p) {
    setEditingId(p.id);
    setForm({
      name: p.name,
      handle: p.handle,
      category: p.category,
      fit: p.fit,
      color: p.color,
      hex: p.hex,
      price: p.price,
      compareAtPrice: p.compareAtPrice || "",
      description: p.description,
      featured: p.featured,
      isNew: p.isNew,
      variants: p.variants,
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(BLANK);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const payload = {
      ...form,
      price: Number(form.price),
      compareAtPrice: form.compareAtPrice ? Number(form.compareAtPrice) : null,
    };
    const url = editingId ? `/api/admin/products/${editingId}` : "/api/admin/products";
    const method = editingId ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Something went wrong");
      return;
    }
    cancelEdit();
    load();
  }

  async function handleDelete(id) {
    if (!confirm("Delete this product?")) return;
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    load();
  }

  if (products === null) {
    return <main className="max-w-[1220px] mx-auto px-5 sm:px-7 py-14">Loading…</main>;
  }

  return (
    <main className="max-w-[1220px] mx-auto px-5 sm:px-7 py-14">
      <span className="eyebrow">Admin</span>
      <h1 className="font-display text-3xl sm:text-4xl mt-1 mb-10">Products</h1>

      <div className="grid lg:grid-cols-[1fr_1.3fr] gap-10">
        <form onSubmit={handleSubmit} className="space-y-3 bg-paper border border-line p-6 h-fit">
          <span className="eyebrow">{editingId ? "Edit product" : "New product"}</span>
          <Field label="Name" value={form.name} onChange={(v) => update("name", v)} required />
          <Field label="Handle (URL slug)" value={form.handle} onChange={(v) => update("handle", v)} required />
          <div className="grid grid-cols-2 gap-3">
            <SelectField label="Category" value={form.category} onChange={(v) => update("category", v)} options={["tees", "caps", "custom"]} />
            <Field label="Fit" value={form.fit} onChange={(v) => update("fit", v)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Colour name" value={form.color} onChange={(v) => update("color", v)} />
            <Field label="Colour hex" value={form.hex} onChange={(v) => update("hex", v)} type="color" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Price (৳)" value={form.price} onChange={(v) => update("price", v)} type="number" />
            <Field label="Compare-at price (optional)" value={form.compareAtPrice} onChange={(v) => update("compareAtPrice", v)} type="number" />
          </div>
          <Field label="Description" value={form.description} onChange={(v) => update("description", v)} textarea />
          <div className="flex gap-5 font-mono text-xs">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={form.featured} onChange={(e) => update("featured", e.target.checked)} />
              Featured on homepage
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={form.isNew} onChange={(e) => update("isNew", e.target.checked)} />
              Mark as new
            </label>
          </div>
          {error && <p className="text-stamp font-mono text-xs">{error}</p>}
          <div className="flex gap-3 pt-2">
            <button className="flex-1 bg-ink text-canvas py-2.5 font-mono text-xs uppercase tracking-wider rounded-sm">
              {editingId ? "Save changes" : "Add product"}
            </button>
            {editingId && (
              <button type="button" onClick={cancelEdit} className="px-4 border border-line font-mono text-xs uppercase tracking-wider rounded-sm">
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className="space-y-3">
          {products.map((p) => (
            <div key={p.id} className="flex items-center gap-4 border border-line p-4">
              <div className="w-10 h-10 rounded-full flex-none" style={{ background: p.hex }} />
              <div className="flex-1">
                <p className="font-semibold text-sm">{p.name}</p>
                <p className="font-mono text-xs text-ink/50">
                  {p.category} · ৳{p.price} · stock {p.variants.reduce((s, v) => s + v.stock, 0)}
                </p>
              </div>
              <button onClick={() => startEdit(p)} className="font-mono text-xs underline">
                Edit
              </button>
              <button onClick={() => handleDelete(p.id)} className="font-mono text-xs text-stamp underline">
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

function Field({ label, value, onChange, required, type = "text", textarea }) {
  const Tag = textarea ? "textarea" : "input";
  return (
    <label className="block">
      <span className="font-mono text-[11px] uppercase tracking-wider text-ink/50 block mb-1">{label}</span>
      <Tag
        type={textarea ? undefined : type}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        rows={textarea ? 3 : undefined}
        className="w-full border border-line rounded-sm px-3 py-2 bg-canvas text-sm outline-none focus:border-cobalt"
      />
    </label>
  );
}

function SelectField({ label, value, onChange, options }) {
  return (
    <label className="block">
      <span className="font-mono text-[11px] uppercase tracking-wider text-ink/50 block mb-1">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full border border-line rounded-sm px-3 py-2 bg-canvas text-sm">
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}
