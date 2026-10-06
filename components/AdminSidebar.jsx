"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import AdminSignOut from "./AdminSignOut";

const LINKS = [
  { href: "/admin", label: "Dashboard", icon: "M4 13h6V4H4v9Zm0 7h6v-5H4v5Zm10 0h6V11h-6v9Zm0-16v5h6V4h-6Z" },
  { href: "/admin/products", label: "Products", icon: "M20 7 12 3 4 7v10l8 4 8-4V7ZM4 7l8 4m0 0 8-4m-8 4v10" },
  { href: "/admin/orders", label: "Orders", icon: "M6 2h12l1 5H5l1-5Zm-1 5h14v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7Zm4 4v3m6-3v3" },
  { href: "/admin/discounts", label: "Discounts", icon: "M20 12 12 20l-8-8V5a1 1 0 0 1 1-1h7l8 8ZM7 7h.01" },
  { href: "/admin/restock-alerts", label: "Restock alerts", icon: "M12 3v6l4 2M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" },
  { href: "/admin/settings", label: "Settings", icon: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm8-3a8 8 0 0 0-.15-1.5l2-1.5-2-3.5-2.3.9a8 8 0 0 0-2.6-1.5L14.5 2h-5l-.45 2.9a8 8 0 0 0-2.6 1.5l-2.3-.9-2 3.5 2 1.5A8 8 0 0 0 4 12c0 .5.05 1 .15 1.5l-2 1.5 2 3.5 2.3-.9a8 8 0 0 0 2.6 1.5L9.5 22h5l.45-2.9a8 8 0 0 0 2.6-1.5l2.3.9 2-3.5-2-1.5c.1-.5.15-1 .15-1.5Z" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full md:w-60 flex-none md:min-h-screen md:border-r border-line bg-paper">
      <div className="px-6 py-6 border-b border-line">
        <Link href="/" className="flex items-center gap-2.5 font-display text-lg">
          <svg viewBox="0 0 34 34" className="w-7 h-7" fill="none">
            <circle cx="17" cy="17" r="16" stroke="currentColor" strokeWidth="1.5" />
            <path d="M9 12H25M17 12V25" stroke="currentColor" strokeWidth="2.4" strokeLinecap="square" />
          </svg>
          TSHOPHUT
        </Link>
        <span className="eyebrow block mt-1">Admin</span>
      </div>

      <nav className="p-3 flex md:flex-col gap-1 overflow-x-auto md:overflow-visible">
        {LINKS.map((link) => {
          const active = link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-sm font-mono text-xs uppercase tracking-wider whitespace-nowrap transition-colors
              ${active ? "bg-ink text-canvas" : "text-ink/60 hover:bg-canvas-dim hover:text-ink"}`}
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 flex-none" fill="none">
                <path d={link.icon} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="hidden md:block px-6 py-4 mt-auto border-t border-line">
        <AdminSignOut />
      </div>
    </aside>
  );
}
