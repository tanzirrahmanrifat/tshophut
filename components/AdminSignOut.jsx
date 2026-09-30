"use client";

export default function AdminSignOut() {
  async function handleSignOut() {
    await fetch("/api/admin/login", { method: "DELETE" });
    window.location.href = "/admin";
  }

  return (
    <button onClick={handleSignOut} className="font-mono text-xs uppercase tracking-wider underline">
      Sign out
    </button>
  );
}
