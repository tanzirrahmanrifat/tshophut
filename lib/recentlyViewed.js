const KEY = "tshophut_recently_viewed_v1";
const MAX = 8;

export function pushRecentlyViewed(handle) {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(KEY);
    let list = raw ? JSON.parse(raw) : [];
    list = [handle, ...list.filter((h) => h !== handle)].slice(0, MAX);
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    // storage unavailable — recently viewed is a nice-to-have, fail quietly
  }
}

export function getRecentlyViewed() {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
