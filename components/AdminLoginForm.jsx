"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginForm() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (!res.ok) {
      setError("Wrong password.");
      return;
    }
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto py-24 space-y-4">
      <span className="eyebrow">Admin</span>
      <h1 className="font-display text-3xl mb-2">Sign in</h1>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Admin password"
        className="w-full border border-line rounded-sm px-3.5 py-2.5 text-sm outline-none focus:border-cobalt"
      />
      {error && <p className="text-stamp font-mono text-xs">{error}</p>}
      <button className="w-full bg-ink text-canvas py-3 font-mono text-xs uppercase tracking-wider rounded-sm hover:bg-cobalt transition-colors">
        Sign in
      </button>
      <p className="font-mono text-[11px] text-ink/45">
        Default password: <code>tshophut2026</code> (set ADMIN_PASSWORD in .env to change it)
      </p>
    </form>
  );
}
