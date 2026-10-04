"use client";

import { useEffect, useState } from "react";

const BLANK = { code: "", type: "percent", value: 10, active: true };

export default function AdminDiscountsPage() {
  const [discounts, setDiscounts] = useState(null);
  const [form, setForm] = useState(BLANK);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  function load() {
    fetch("/api/admin/discounts")
      .then((r) => {
        if (r.status === 401) {
          window.location.href = "/admin";
          return { discounts: [] };
        }
        return r.json();
      })
      .then((data) => setDiscounts(data.discounts || []));
  }

  useEffect(load, []);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function startEdit(d) {
    setEditingId(d.id);
    setForm({ code: d.code, type: d.type, value: d.value, active: d.active });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(BLANK);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const url = editingId ? `/api/admin/discounts/${editingId}` : "/api/admin/discounts";
    const method = editingId ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
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
    if (!confirm("Delete this discount code?")) return;
    await fetch(`/api/admin/discounts/${id}`, { method: "DELETE" });
    load();
  }

  async function toggleActive(d) {
    setDiscounts((prev) => prev.map((x) => (x.id === d.id ? { ...x, active: !x.active } : x)));
    await fetch(`/api/admin/discounts/${d.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !d.active }),
    });
  }

  if (discounts === null) {
    return <main className="px-5 sm:px-8 py-10 max-w-[1400px] mx-auto">Loading…</main>;
  }

  return (
    <main className="px-5 sm:px-8 py-10 max-w-[1400px] mx-auto">
      <div className="mb-8">
        <span className="eyebrow">Admin</span>
        <h1 className="font-display text-3xl sm:text-4xl mt-1">Discount codes</h1>
      </div>

      <div className="grid lg:grid-cols-[380px_1fr] gap-8">
        <form onSubmit={handleSubmit} className="space-y-3 border border-line bg-paper p-6 h-fit">
          <span className="eyebrow">{editingId ? "Edit code" : "New code"}</span>
          <Field label="Code" value={form.code} onChange={(v) => update("code", v)} required placeholder="e.g. SAVE10" />
          <label className="block">
            <span className="font-mono text-[11px] uppercase tracking-wider text-ink/50 block mb-1">Type</span>
            <select
              value={form.type}
              onChange={(e) => update("type", e.target.value)}
              className="w-full border border-line rounded-sm px-3 py-2 bg-canvas text-sm"
            >
              <option value="percent">Percent off</option>
              <option value="flat">Flat amount off</option>
              <option value="freeship">Free shipping</option>
            </select>
          </label>
          {form.type !== "freeship" && (
            <Field
              label={form.type === "percent" ? "Percent off (%)" : "Amount off (৳)"}
              value={form.value}
              onChange={(v) => update("value", v)}
              type="number"
            />
          )}
          <label className="flex items-center gap-2 font-mono text-xs pt-1">
            <input type="checkbox" checked={form.active} onChange={(e) => update("active", e.target.checked)} />
            Active
          </label>
          {error && <p className="text-stamp font-mono text-xs">{error}</p>}
          <div className="flex gap-3 pt-2">
            <button className="flex-1 bg-ink text-canvas py-2.5 font-mono text-xs uppercase tracking-wider rounded-sm">
              {editingId ? "Save changes" : "Create code"}
            </button>
            {editingId && (
              <button type="button" onClick={cancelEdit} className="px-4 border border-line font-mono text-xs uppercase tracking-wider rounded-sm">
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className="space-y-3">
          {discounts.length === 0 && <p className="font-mono text-sm text-ink/50">No discount codes yet.</p>}
          {discounts.map((d) => (
            <div key={d.id} className="flex items-center gap-4 border border-line bg-paper p-4">
              <div className="flex-1">
                <p className="font-mono font-bold">{d.code}</p>
                <p className="font-mono text-xs text-ink/50">
                  {d.type === "percent" && `${d.value}% off`}
                  {d.type === "flat" && `৳${d.value} off`}
                  {d.type === "freeship" && "Free shipping"}
                </p>
              </div>
              <button
                onClick={() => toggleActive(d)}
                className={`relative w-11 h-6 rounded-full flex-none transition-colors ${d.active ? "bg-cobalt" : "bg-ink/15"}`}
              >
                <span
                  className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    d.active ? "translate-x-[22px]" : "translate-x-0.5"
                  }`}
                />
              </button>
              <button onClick={() => startEdit(d)} className="font-mono text-xs underline">
                Edit
              </button>
              <button onClick={() => handleDelete(d.id)} className="font-mono text-xs text-stamp underline">
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

function Field({ label, value, onChange, required, type = "text", placeholder }) {
  return (
    <label className="block">
      <span className="font-mono text-[11px] uppercase tracking-wider text-ink/50 block mb-1">{label}</span>
      <input
        type={type}
        value={value}
        required={required}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-line rounded-sm px-3 py-2 bg-canvas text-sm outline-none focus:border-cobalt"
      />
    </label>
  );
}
