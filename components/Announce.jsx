const MESSAGES = [
  "FREE DELIVERY OVER ৳2,000",
  "NEW DROP EVERY FRIDAY, 6PM",
  "240 GSM HEAVYWEIGHT COTTON",
  "DHAKA-MADE, SMALL BATCH",
];

export default function Announce() {
  const track = [...MESSAGES, ...MESSAGES];
  return (
    <div className="bg-ink text-canvas overflow-hidden whitespace-nowrap">
      <div className="inline-flex gap-14 py-2 marquee-track font-mono text-xs tracking-widest uppercase">
        {track.map((m, i) => (
          <span key={i} className="inline-flex items-center gap-14 after:content-['—'] after:text-cobalt">
            {m}
          </span>
        ))}
      </div>
    </div>
  );
}
