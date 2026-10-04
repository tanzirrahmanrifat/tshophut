"use client";

import { useEffect, useRef, useState } from "react";

const STATS = [
  { target: 7, suffix: "", label: "Weekly drops so far" },
  { target: 12480, suffix: "+", label: "Tees shipped nationwide" },
  { target: 940, suffix: "+", label: "Custom designs printed" },
  { target: 64, suffix: " districts", label: "Reached across Bangladesh" },
];

function useCountUp(target, active) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return;
    const duration = 1400;
    const start = performance.now();
    let raf;
    function tick(now) {
      const progress = Math.min(1, (now - start) / duration);
      setValue(Math.floor(progress * target));
      if (progress < 1) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, target]);
  return value;
}

export default function StatsCounter() {
  const ref = useRef(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="relative bg-ink text-canvas py-14 sm:py-16 overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{ backgroundImage: "radial-gradient(circle, #F0EEE6 1px, transparent 1px)", backgroundSize: "20px 20px" }}
      />
      <div className="relative max-w-[1220px] mx-auto px-5 sm:px-7">
        <div className="text-center mb-10">
          <span className="eyebrow text-canvas/50">Small batch, real numbers</span>
          <h2 className="font-display text-2xl sm:text-3xl mt-2 max-w-[36ch] mx-auto">
            Every drop is made to actually sell out — here&apos;s the running total.
          </h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-10">
          {STATS.map((s) => (
            <StatItem key={s.label} stat={s} active={active} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StatItem({ stat, active }) {
  const value = useCountUp(stat.target, active);
  return (
    <div className="text-center">
      <b className="font-display text-3xl sm:text-4xl block">
        {value.toLocaleString()}
        {stat.suffix}
      </b>
      <span className="font-mono text-[11px] uppercase tracking-wider text-canvas/50 block mt-2">{stat.label}</span>
    </div>
  );
}
