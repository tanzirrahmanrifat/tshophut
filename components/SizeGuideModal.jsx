"use client";

import { useState } from "react";

const ROWS = [
  { size: "S", chest: "36–38", length: "26.5", shoulder: "17" },
  { size: "M", chest: "39–41", length: "27.5", shoulder: "18" },
  { size: "L", chest: "42–44", length: "28.5", shoulder: "19" },
  { size: "XL", chest: "45–47", length: "29.5", shoulder: "20" },
  { size: "XXL", chest: "48–50", length: "30.5", shoulder: "21" },
];

export default function SizeGuideModal() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="font-mono text-[11px] uppercase tracking-wider underline text-ink/60 hover:text-cobalt"
      >
        Size guide
      </button>

      {open && (
        <div className="fixed inset-0 z-[65] flex items-center justify-center p-4">
          <div onClick={() => setOpen(false)} className="absolute inset-0 bg-ink/50 backdrop-blur-[1px]" />
          <div className="relative bg-paper w-full max-w-md rounded-sm shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-5 border-b border-line">
              <div>
                <span className="eyebrow">Fit guide</span>
                <h3 className="font-display text-xl mt-0.5">Size chart (inches)</h3>
              </div>
              <button onClick={() => setOpen(false)} aria-label="Close" className="text-2xl leading-none text-ink/40 hover:text-ink">
                &times;
              </button>
            </div>
            <div className="p-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="font-mono text-[11px] uppercase tracking-wider text-ink/50 text-left">
                    <th className="pb-2">Size</th>
                    <th className="pb-2">Chest</th>
                    <th className="pb-2">Length</th>
                    <th className="pb-2">Shoulder</th>
                  </tr>
                </thead>
                <tbody>
                  {ROWS.map((r) => (
                    <tr key={r.size} className="border-t border-dashed border-line">
                      <td className="py-2.5 font-bold">{r.size}</td>
                      <td className="py-2.5 font-mono">{r.chest}</td>
                      <td className="py-2.5 font-mono">{r.length}</td>
                      <td className="py-2.5 font-mono">{r.shoulder}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="font-mono text-[11px] text-ink/45 mt-4">
                Measured flat, garment laid out. Between sizes? We run a true-to-size regular fit —
                size up for the oversized cut.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
