// Vercel's serverless functions get a read-only filesystem except /tmp, and
// /tmp is NOT reliably shared between invocations — the POST /api/checkout
// request and the GET that follows it (loading the confirmation page) can
// land on different function instances, so the order "disappears" even
// though it was just created. Until this project is wired to a real
// database (see lib/db.js), we cache every order the browser just created
// in localStorage and fall back to it when the server doesn't have it.
const KEY = "tshophut_order_cache_v1";
const MAX = 20;

export function cacheOrder(order) {
  if (typeof window === "undefined" || !order?.id) return;
  try {
    const raw = localStorage.getItem(KEY);
    const list = raw ? JSON.parse(raw) : [];
    const next = [order, ...list.filter((o) => o.id !== order.id)].slice(0, MAX);
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // best-effort cache — never block checkout on storage failing
  }
}

export function getCachedOrder(id) {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    const list = raw ? JSON.parse(raw) : [];
    return list.find((o) => o.id === id) || null;
  } catch {
    return null;
  }
}

export function getCachedOrders() {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
