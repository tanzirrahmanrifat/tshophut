"use client";

import { useEffect, useState } from "react";

function nextDropClose() {
  const now = new Date();
  const target = new Date(now);
  const day = now.getDay(); // 0 = Sun ... 5 = Fri
  let daysUntilFriday = (5 - day + 7) % 7;
  target.setHours(18, 0, 0, 0);
  if (daysUntilFriday === 0 && now >= target) daysUntilFriday = 7;
  target.setDate(now.getDate() + daysUntilFriday);
  return target;
}

function formatRemaining(ms) {
  if (ms <= 0) return { d: 0, h: 0, m: 0, s: 0 };
  const totalSeconds = Math.floor(ms / 1000);
  return {
    d: Math.floor(totalSeconds / 86400),
    h: Math.floor((totalSeconds % 86400) / 3600),
    m: Math.floor((totalSeconds % 3600) / 60),
    s: totalSeconds % 60,
  };
}

export default function DropCountdown({ className = "" }) {
  const [remaining, setRemaining] = useState(null);

  useEffect(() => {
    const target = nextDropClose();
    function tick() {
      setRemaining(formatRemaining(target - new Date()));
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  if (!remaining) return <span className={className}>closes Fri 6PM</span>;

  return (
    <span className={className}>
      closes in {remaining.d > 0 ? `${remaining.d}d ` : ""}
      {String(remaining.h).padStart(2, "0")}:{String(remaining.m).padStart(2, "0")}:{String(remaining.s).padStart(2, "0")}
    </span>
  );
}
