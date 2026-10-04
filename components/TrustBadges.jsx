const BADGES = [
  {
    label: "240 GSM Cotton",
    sub: "Heavyweight, not the mall stuff",
    icon: (
      <path d="M4 12h16M12 4v16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    ),
  },
  {
    label: "Cash on Delivery",
    sub: "Pay when it arrives, nationwide",
    icon: (
      <path d="M3 8h18M3 8v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8M7 12h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    ),
  },
  {
    label: "7-Day Easy Returns",
    sub: "Wrong size? Swap it, no hassle",
    icon: (
      <path d="M4 4v6h6M20 20v-6h-6M5 15a7 7 0 0 0 12.9 3M19 9A7 7 0 0 0 6.1 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    ),
  },
  {
    label: "Small-Batch Drops",
    sub: "Printed to order, not overstocked",
    icon: (
      <path d="M12 3v6l4 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    ),
  },
];

export default function TrustBadges() {
  return (
    <div className="border-y border-line">
      <div className="max-w-[1220px] mx-auto px-5 sm:px-7 grid grid-cols-2 md:grid-cols-4">
        {BADGES.map((b, i) => (
          <div
            key={b.label}
            className={`flex items-center gap-3.5 py-6 px-4 border-line ${i % 2 === 1 ? "border-l" : ""} md:border-l-0 ${
              i > 0 ? "md:border-l" : ""
            }`}
          >
            <svg viewBox="0 0 24 24" className="w-7 h-7 text-cobalt flex-none" fill="none">
              {b.icon}
              {b.label === "7-Day Easy Returns" && <circle cx="12" cy="12" r="9.5" stroke="none" />}
            </svg>
            <div>
              <p className="text-sm font-bold leading-tight">{b.label}</p>
              <p className="font-mono text-[11px] text-ink/50 mt-0.5">{b.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
