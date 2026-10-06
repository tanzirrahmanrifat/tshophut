"use client";

import { useEffect, useState } from "react";

export default function AdminRestockAlertsPage() {
  const [requests, setRequests] = useState(null);

  useEffect(() => {
    fetch("/api/admin/stock-notify")
      .then((r) => {
        if (r.status === 401) {
          window.location.href = "/admin";
          return { requests: [] };
        }
        return r.json();
      })
      .then((data) => setRequests(data.requests || []));
  }, []);

  if (requests === null) {
    return <main className="px-5 sm:px-8 py-10 max-w-[1400px] mx-auto">Loading…</main>;
  }

  return (
    <main className="px-5 sm:px-8 py-10 max-w-[1400px] mx-auto">
      <div className="mb-8">
        <span className="eyebrow">Admin</span>
        <h1 className="font-display text-3xl sm:text-4xl mt-1">Restock alerts</h1>
        <p className="text-ink/60 text-sm mt-2 max-w-[60ch]">
          Customers asking to be notified when a sold-out size comes back. Reach out once you've
          restocked — there's no automatic email/SMS sender wired up yet.
        </p>
      </div>

      {requests.length === 0 ? (
        <p className="font-mono text-sm text-ink/50">No restock requests yet.</p>
      ) : (
        <div className="space-y-2.5">
          {requests.map((r) => (
            <div key={r.id} className="flex items-center justify-between border border-line bg-paper p-4">
              <div>
                <p className="text-sm font-semibold">
                  {r.productName} <span className="font-mono text-xs text-ink/50">({r.size})</span>
                </p>
                <p className="font-mono text-xs text-ink/50">{new Date(r.createdAt).toLocaleString()}</p>
              </div>
              <span className="font-mono text-sm">{r.contact}</span>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
