"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "tshophut_cart_v1";
const WISHLIST_KEY = "tshophut_wishlist_v1";

function lineKey(item) {
  // Two custom items with different placements/artwork are different lines.
  return [item.handle, item.size, item.customSignature || ""].join("::");
}

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
      const rawW = localStorage.getItem(WISHLIST_KEY);
      if (rawW) setWishlist(JSON.parse(rawW));
    } catch {
      // ignore corrupted storage
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  useEffect(() => {
    if (hydrated) localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
  }, [wishlist, hydrated]);

  function addItem(item) {
    setItems((prev) => {
      const key = lineKey(item);
      const existing = prev.find((p) => lineKey(p) === key);
      if (existing) {
        return prev.map((p) =>
          lineKey(p) === key ? { ...p, qty: p.qty + item.qty } : p
        );
      }
      return [...prev, item];
    });
  }

  function updateQty(item, qty) {
    setItems((prev) =>
      prev
        .map((p) => (lineKey(p) === lineKey(item) ? { ...p, qty } : p))
        .filter((p) => p.qty > 0)
    );
  }

  function removeItem(item) {
    setItems((prev) => prev.filter((p) => lineKey(p) !== lineKey(item)));
  }

  function clearCart() {
    setItems([]);
  }

  function toggleWishlist(handle) {
    setWishlist((prev) =>
      prev.includes(handle) ? prev.filter((h) => h !== handle) : [...prev, handle]
    );
  }

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.qty, 0),
    [items]
  );
  const count = useMemo(() => items.reduce((sum, i) => sum + i.qty, 0), [items]);

  const value = {
    items,
    addItem,
    updateQty,
    removeItem,
    clearCart,
    subtotal,
    count,
    wishlist,
    toggleWishlist,
    hydrated,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
