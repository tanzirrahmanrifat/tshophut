"use client";

import { useEffect, useState } from "react";

export default function AdminSettingsPage() {
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => {
        if (r.status === 401) {
          window.location.href = "/admin";
          return { settings: null };
        }
        return r.json();
      })
      .then((data) => setForm(data.settings));
  }, []);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    setSaved(false);
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  if (!form) {
    return <main className="px-5 sm:px-8 py-10 max-w-[1400px] mx-auto">Loading…</main>;
  }

  return (
    <main className="px-5 sm:px-8 py-10 max-w-[1400px] mx-auto">
      <div className="mb-8">
        <span className="eyebrow">Admin</span>
        <h1 className="font-display text-3xl sm:text-4xl mt-1">Store settings</h1>
      </div>

      <form onSubmit={handleSave} className="max-w-xl space-y-5">
        <div className="border border-line bg-paper p-6 space-y-4">
          <span className="eyebrow block">Store</span>
          <Field label="Store name" value={form.storeName} onChange={(v) => update("storeName", v)} />
          <Field label="Currency symbol" value={form.currencySymbol} onChange={(v) => update("currencySymbol", v)} />
          <Field label="Support phone" value={form.supportPhone} onChange={(v) => update("supportPhone", v)} />
          <Field label="Support email" value={form.supportEmail} onChange={(v) => update("supportEmail", v)} />
        </div>

        <div className="border border-line bg-paper p-6 space-y-4">
          <span className="eyebrow block">Shipping</span>
          <div className="grid grid-cols-2 gap-4">
            <Field
              label="Free shipping over (৳)"
              value={form.freeShippingThreshold}
              onChange={(v) => update("freeShippingThreshold", v)}
              type="number"
            />
            <Field
              label="Standard shipping fee (৳)"
              value={form.standardShippingFee}
              onChange={(v) => update("standardShippingFee", v)}
              type="number"
            />
          </div>
        </div>

        <div className="border border-line bg-paper p-6">
          <label className="flex items-center gap-2 font-mono text-xs">
            <input type="checkbox" checked={form.codEnabled} onChange={(e) => update("codEnabled", e.target.checked)} />
            Cash on Delivery available at checkout
          </label>
          <p className="font-mono text-[11px] text-ink/45 mt-2">
            Turning this off with no other payment method live will block checkout entirely — only disable it once a
            real payment gateway (bKash/card) is wired up.
          </p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-ink text-canvas px-6 py-3 font-mono text-xs uppercase tracking-wider rounded-sm hover:bg-cobalt transition-colors disabled:opacity-50"
        >
          {saving ? "Saving…" : saved ? "Saved ✓" : "Save settings"}
        </button>
      </form>
    </main>
  );
}

function Field({ label, value, onChange, type = "text" }) {
  return (
    <label className="block">
      <span className="font-mono text-[11px] uppercase tracking-wider text-ink/50 block mb-1">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-line rounded-sm px-3 py-2 bg-canvas text-sm outline-none focus:border-cobalt"
      />
    </label>
  );
}
