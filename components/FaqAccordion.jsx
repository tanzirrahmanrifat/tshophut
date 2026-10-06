"use client";

import { useState } from "react";

const FAQS = [
  {
    q: "How does the weekly drop work?",
    a: "We release a new small-batch run every Friday at 6PM. Once a size or colour sells out, it doesn't come back — that's intentional, it keeps the cotton heavier and the pricing honest instead of marking up restocks.",
  },
  {
    q: "What payment methods do you accept?",
    a: "Cash on Delivery nationwide. bKash and card payments are coming soon — they'll show up at checkout the moment they're live.",
  },
  {
    q: "How long does delivery take?",
    a: "Most orders inside Dhaka arrive in 1–3 days; other districts typically take 3–5 days. You'll get a call before delivery to confirm.",
  },
  {
    q: "Can I return or exchange a size?",
    a: "Yes — unworn items in original condition can be exchanged within 7 days of delivery. Since drops don't restock, exchanges depend on what's still left in that size.",
  },
  {
    q: "How does the Print on Demand designer work?",
    a: "Pick a tee or cap, choose a colour, then upload your own artwork to the front, back, neck label, or either sleeve. Drag to position it and resize with the slider — pricing updates live per placement you use.",
  },
];

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="max-w-[760px] mx-auto">
      {FAQS.map((item, i) => (
        <div key={i} className="border-b border-line">
          <button
            onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
            className="w-full flex items-center justify-between py-5 text-left gap-4"
          >
            <span className="font-semibold text-[15px]">{item.q}</span>
            <svg
              viewBox="0 0 24 24"
              className={`w-4 h-4 flex-none text-ink/50 transition-transform ${openIndex === i ? "rotate-45" : ""}`}
              fill="none"
            >
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
          <div className={`grid transition-all duration-300 ${openIndex === i ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
            <div className="overflow-hidden">
              <p className="text-ink/70 text-sm pb-5 max-w-[60ch]">{item.a}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
