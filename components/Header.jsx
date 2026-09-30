"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import CartDrawer from "./CartDrawer";

const NAV = [
  { href: "/collections/tees", label: "All Tees" },
  { href: "/collections/caps", label: "Caps" },
  { href: "/custom", label: "Print on Demand" },
  { href: "/#story", label: "Our Story" },
];

export default function Header() {
  const { count, wishlist } = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  function submitSearch(e) {
    e.preventDefault();
    if (query.trim()) router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  }

  return (
    <header className="sticky top-0 z-40 bg-canvas border-b border-line">
      <div className="flex items-center justify-between gap-6 px-5 sm:px-7 py-4 max-w-[1220px] mx-auto">
        <Link href="/" className="flex items-center gap-2.5 font-display text-xl shrink-0">
          <svg viewBox="0 0 34 34" className="w-8 h-8" fill="none">
            <circle cx="17" cy="17" r="16" stroke="currentColor" strokeWidth="1.5" />
            <path d="M9 12H25M17 12V25" stroke="currentColor" strokeWidth="2.4" strokeLinecap="square" />
          </svg>
          TSHOPHUT
        </Link>

        <nav className="hidden md:flex items-center gap-8 font-mono text-xs tracking-wider uppercase text-ink/70">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="hover:text-ink transition-colors">
              {n.label}
            </Link>
          ))}
        </nav>

        <form onSubmit={submitSearch} className="hidden lg:flex items-center border border-line rounded-sm px-3 py-1.5 gap-2 w-56">
          <svg viewBox="0 0 24 24" className="w-4 h-4 text-ink/50" fill="none">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
            <path d="M21 21L16.5 16.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tees, caps…"
            className="bg-transparent outline-none text-sm w-full font-body"
          />
        </form>

        <div className="flex items-center gap-4">
          <Link href="/account" aria-label="Account" className="w-8 h-8 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
              <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.8" />
              <path d="M4.5 20c1.6-3.6 4.6-5.5 7.5-5.5s5.9 1.9 7.5 5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </Link>
          <Link href="/account?tab=wishlist" aria-label="Wishlist" className="relative w-8 h-8 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
              <path d="M12 20s-7-4.4-9.3-8.8C1.2 8 2.7 5 6 5c1.9 0 3.4 1 4 2.4C10.6 6 12.1 5 14 5c3.3 0 4.8 3 3.3 6.2C15 15.6 12 20 12 20Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
            </svg>
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-stamp text-white text-[10px] font-mono w-4 h-4 rounded-full flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </Link>
          <button
            onClick={() => setCartOpen(true)}
            aria-label="Cart"
            className="relative w-8 h-8 flex items-center justify-center"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
              <path d="M6 8h12l-1 12H7L6 8Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
              <path d="M9 8V6a3 3 0 0 1 6 0v2" stroke="currentColor" strokeWidth="1.8" />
            </svg>
            {count > 0 && (
              <span className="absolute -top-1 -right-1 bg-cobalt text-white text-[10px] font-mono w-4 h-4 rounded-full flex items-center justify-center">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </header>
  );
}
