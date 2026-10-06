"use client";

import { useEffect, useState } from "react";

export default function WhatsAppButton() {
  const [phone, setPhone] = useState(null);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => setPhone(data.settings?.supportPhone || null))
      .catch(() => {});
  }, []);

  if (!phone) return null; // no support number configured — don't show a dead button

  const digits = phone.replace(/[^\d]/g, "");
  const href = `https://wa.me/${digits}?text=${encodeURIComponent("Hi Tshophut — I have a question about an order.")}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-40 w-13 h-13 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-xl hover:scale-105 transition-transform"
      style={{ width: 52, height: 52 }}
    >
      {/* generic chat-bubble glyph — intentionally not WhatsApp's own logo mark */}
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
        <path
          d="M4 11.5c0-4.4 3.8-8 8.3-8s8.3 3.6 8.3 8-3.8 8-8.3 8c-1.1 0-2.2-.2-3.1-.6L4 20.5l1.3-4.2C4.5 15 4 13.3 4 11.5Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <circle cx="8.7" cy="11.5" r="1.1" fill="currentColor" />
        <circle cx="12.3" cy="11.5" r="1.1" fill="currentColor" />
        <circle cx="15.9" cy="11.5" r="1.1" fill="currentColor" />
      </svg>
    </a>
  );
}
