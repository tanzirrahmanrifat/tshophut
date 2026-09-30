"use client";

import { useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/context/CartContext";

const PRICES = { tee: 850, cap: 550 };
const PRINT_FEE = 150;
const NAMES = {
  front: "Front",
  back: "Back",
  neck: "Neck Label",
  sleeveL: "Left Sleeve",
  sleeveR: "Right Sleeve",
  panel: "Front Panel",
};
const ZONES = {
  tee: {
    front: { left: "33%", top: "28%", width: "34%", height: "34%" },
    back: { left: "30%", top: "20%", width: "40%", height: "30%" },
    neck: { left: "43%", top: "13%", width: "14%", height: "9%" },
    sleeveL: { left: "15%", top: "24%", width: "16%", height: "16%" },
    sleeveR: { left: "69%", top: "24%", width: "16%", height: "16%" },
  },
  cap: {
    panel: { left: "38%", top: "40%", width: "24%", height: "22%" },
  },
};
const COLORS = [
  { hex: "#17140F", label: "Ink Black" },
  { hex: "#2C46E0", label: "Cobalt" },
  { hex: "#C1432E", label: "Stamp Red" },
  { hex: "#8A8370", label: "Khaki" },
  { hex: "#F0EEE6", label: "Canvas White" },
];
const SIZES = ["S", "M", "L", "XL", "XXL"];

function money(n) {
  return "৳ " + n.toLocaleString("en-US");
}

export default function CustomDesigner() {
  const { addItem } = useCart();
  const searchParams = useSearchParams();
  const fileRef = useRef(null);
  const stageRef = useRef(null);
  const draggingRef = useRef(false);

  const initialProduct = searchParams.get("type") === "cap" ? "cap" : "tee";
  const initialColorHex = searchParams.get("color");
  const initialColor =
    COLORS.find((c) => c.hex.toLowerCase() === (initialColorHex || "").toLowerCase()) || COLORS[0];

  const [product, setProduct] = useState(initialProduct);
  const [placement, setPlacement] = useState(initialProduct === "cap" ? "panel" : "front");
  const [color, setColor] = useState(initialColor);
  const [designs, setDesigns] = useState({}); // key: "tee:front" -> {src,x,y,scale}
  const [size, setSize] = useState("M");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const dKey = `${product}:${placement}`;
  const current = designs[dKey] || { src: null, x: 50, y: 50, scale: 90 };

  const placementsUsed = useMemo(
    () => Object.keys(designs).filter((k) => k.startsWith(product + ":") && designs[k].src).length,
    [designs, product]
  );
  const base = PRICES[product];
  const total = (base + placementsUsed * PRINT_FEE) * qty;

  function setCurrent(patch) {
    setDesigns((prev) => ({ ...prev, [dKey]: { ...current, ...patch } }));
  }

  function handleProductChange(next) {
    setProduct(next);
    setPlacement(next === "cap" ? "panel" : "front");
  }

  function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setCurrent({ src: ev.target.result });
    reader.readAsDataURL(file);
  }

  function pointerPos(e) {
    const rect = stageRef.current.getBoundingClientRect();
    const touch = e.touches?.[0];
    const cx = touch ? touch.clientX : e.clientX;
    const cy = touch ? touch.clientY : e.clientY;
    return {
      x: Math.min(100, Math.max(0, ((cx - rect.left) / rect.width) * 100)),
      y: Math.min(100, Math.max(0, ((cy - rect.top) / rect.height) * 100)),
    };
  }

  function startDrag(e) {
    if (!current.src) return;
    draggingRef.current = true;
    move(e);
  }
  function move(e) {
    if (!draggingRef.current) return;
    const p = pointerPos(e);
    setCurrent({ x: p.x, y: p.y });
  }
  function endDrag() {
    draggingRef.current = false;
  }

  function handleAdd() {
    const signature = JSON.stringify(designs);
    addItem({
      handle: product === "cap" ? "custom-print-cap" : "custom-print-tee",
      name: `Custom ${product === "cap" ? "Cap" : "Tee"} (${placementsUsed} placement${placementsUsed === 1 ? "" : "s"})`,
      price: base + placementsUsed * PRINT_FEE,
      hex: color.hex,
      size: product === "cap" ? "One Size" : size,
      qty,
      customSignature: signature,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  }

  const zone = ZONES[product][placement];
  const placementKeys = Object.keys(ZONES[product]);

  return (
    <div className="grid md:grid-cols-[.95fr_1.05fr] gap-12 bg-paper border border-line p-6 sm:p-9">
      {/* preview */}
      <div className="flex flex-col gap-3">
        <div className="flex gap-2">
          {["tee", "cap"].map((p) => (
            <button
              key={p}
              onClick={() => handleProductChange(p)}
              className={`flex-1 py-2.5 border-[1.5px] border-ink rounded-sm font-mono text-xs uppercase tracking-wider
              ${product === p ? "bg-ink text-canvas" : ""}`}
            >
              {p === "tee" ? "T-Shirt" : "Cap"}
            </button>
          ))}
        </div>

        {product === "tee" && (
          <div className="flex flex-wrap gap-1.5">
            {placementKeys.map((p) => (
              <button
                key={p}
                onClick={() => setPlacement(p)}
                className={`px-2.5 py-1.5 rounded-full border font-mono text-[11px] uppercase tracking-wider
                ${placement === p ? "bg-cobalt border-cobalt text-white" : "bg-canvas-dim border-line text-ink/70"}`}
              >
                {NAMES[p]}
              </button>
            ))}
          </div>
        )}

        <div
          ref={stageRef}
          onMouseDown={startDrag}
          onMouseMove={move}
          onMouseUp={endDrag}
          onMouseLeave={endDrag}
          onTouchStart={startDrag}
          onTouchMove={move}
          onTouchEnd={endDrag}
          className="relative bg-canvas-dim border border-dashed border-ink/15 aspect-square flex items-center justify-center overflow-hidden select-none"
        >
          <span className="absolute top-3 left-3 z-[2] font-mono text-[11px] uppercase tracking-wider text-canvas/60">
            {product === "cap" ? `Cap — ${NAMES[placement]}` : NAMES[placement]}
          </span>

          {product === "tee" ? (
            <svg viewBox="0 0 220 240" className="w-[68%]" fill="none">
              <path
                d="M60 20 L20 45 L35 75 L55 65 L55 220 L165 220 L165 65 L185 75 L200 45 L160 20 L140 35 Q110 55 80 35 Z"
                fill={color.hex}
                stroke="#F0EEE6"
                strokeWidth="3"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <svg viewBox="0 0 220 240" className="w-[60%]" fill="none">
              <path d="M40 140 Q40 60 110 55 Q180 60 180 140 Z" fill={color.hex} stroke="#F0EEE6" strokeWidth="3" strokeLinejoin="round" />
              <path d="M35 140 L195 140 Q205 150 195 158 L40 158 Q28 150 35 140 Z" fill={color.hex} stroke="#F0EEE6" strokeWidth="3" strokeLinejoin="round" />
              <circle cx="110" cy="60" r="5" fill="#F0EEE6" />
            </svg>
          )}

          <div
            className="absolute flex items-center justify-center cursor-grab active:cursor-grabbing"
            style={{ left: zone.left, top: zone.top, width: zone.width, height: zone.height }}
          >
            {current.src ? (
              <img
                src={current.src}
                alt="Your uploaded artwork"
                draggable={false}
                className="absolute pointer-events-none rounded-sm"
                style={{
                  width: current.scale,
                  left: `${current.x}%`,
                  top: `${current.y}%`,
                  transform: "translate(-50%, -50%)",
                  boxShadow: "0 0 0 1px rgba(240,238,230,.25)",
                }}
              />
            ) : (
              <span className="font-mono text-[11px] text-center leading-tight text-canvas/55">
                Upload artwork
                <br />
                to preview here
              </span>
            )}
          </div>
        </div>
        <p className="font-mono text-[11.5px] text-ink/45 text-center">
          Drag the artwork to reposition · use the slider to resize · each placement keeps its own design
        </p>
      </div>

      {/* controls */}
      <div className="flex flex-col gap-6">
        <div>
          <span className="eyebrow block mb-3">1. Colour</span>
          <div className="flex gap-2.5">
            {COLORS.map((c) => (
              <button
                key={c.hex}
                onClick={() => setColor(c)}
                aria-label={c.label}
                className="w-7 h-7 rounded-full border"
                style={{
                  background: c.hex,
                  borderColor: c.hex === "#F0EEE6" ? "rgba(23,20,15,.12)" : "transparent",
                  boxShadow: color.hex === c.hex ? "0 0 0 2px #fff, 0 0 0 3.5px #2C46E0" : "none",
                }}
              />
            ))}
          </div>
        </div>

        <div>
          <span className="eyebrow block mb-3">
            2. Artwork for <em className="text-ink not-italic font-semibold">{NAMES[placement]}</em>
          </span>
          <label className="flex items-center gap-2.5 border-[1.5px] border-dashed border-ink/15 px-4 py-3.5 font-mono text-xs cursor-pointer hover:border-cobalt transition-colors">
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-cobalt flex-none" fill="none">
              <path d="M12 16V4M12 4l-5 5M12 4l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            {current.src ? `Design added for ${NAMES[placement]}` : "Choose an image (PNG, JPG, SVG)"}
            <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleFile} />
          </label>
          <div className="flex items-center gap-3.5 mt-3">
            <span className="eyebrow">Size</span>
            <input
              type="range"
              min="20"
              max="160"
              value={current.scale}
              onChange={(e) => setCurrent({ scale: Number(e.target.value) })}
              className="flex-1 accent-cobalt"
            />
          </div>
        </div>

        <div>
          <span className="eyebrow block mb-3">3. Size &amp; quantity</span>
          <div className="flex gap-3.5">
            {product === "tee" ? (
              <select
                value={size}
                onChange={(e) => setSize(e.target.value)}
                className="flex-1 px-3.5 py-3 border-[1.5px] border-ink rounded-sm font-mono text-sm bg-paper"
              >
                {SIZES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            ) : (
              <div className="flex-1 px-3.5 py-3 border-[1.5px] border-ink rounded-sm font-mono text-sm bg-canvas-dim">
                One Size
              </div>
            )}
            <div className="flex items-center border-[1.5px] border-ink rounded-sm">
              <button className="w-9 h-full font-mono" onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
              <span className="w-8 text-center font-mono text-sm">{qty}</span>
              <button className="w-9 h-full font-mono" onClick={() => setQty((q) => q + 1)}>+</button>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 text-sm text-ink/70">
          <span className="flex justify-between">
            Base <span className="eyebrow">৳{base}</span>
          </span>
          <span className="flex justify-between">
            Print placements used <span className="eyebrow">{placementsUsed} × ৳{PRINT_FEE}</span>
          </span>
          <hr className="border-line my-1" />
          <span className="flex justify-between text-base text-ink font-bold">
            Total <b className="font-mono text-lg">{money(total)}</b>
          </span>
        </div>

        <button
          onClick={handleAdd}
          className={`py-3.5 font-mono text-xs uppercase tracking-wider rounded-sm transition-colors
          ${added ? "bg-cobalt text-white" : "bg-ink text-canvas hover:bg-cobalt"}`}
        >
          {added ? "Added ✓" : "Add custom design to cart"}
        </button>
        <p className="font-mono text-[11px] text-ink/45 text-center">
          Printed and shipped in 3–5 days · artwork stays private to your order
        </p>
      </div>
    </div>
  );
}
