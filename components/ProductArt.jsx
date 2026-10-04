// Illustrated line-art stand-ins for product photography. Swap the <img>
// in ProductCard/ProductGallery for real photos once you have them —
// nothing else needs to change since both accept the same "hex" prop shape.
// All original line art — no real garment photography or third-party marks.

function shadeOf(hex) {
  // Very rough darken for a subtle shaded second tone, used to fake a fold/seam highlight.
  const n = parseInt(hex.replace("#", ""), 16);
  if (Number.isNaN(n)) return hex;
  const r = Math.max(0, (n >> 16) - 24);
  const g = Math.max(0, ((n >> 8) & 0xff) - 24);
  const b = Math.max(0, (n & 0xff) - 24);
  return `rgb(${r},${g},${b})`;
}

export function TeeArt({ hex = "#17140F", className = "" }) {
  const uid = hex.replace("#", "");
  const dark = shadeOf(hex);
  return (
    <svg viewBox="0 0 160 180" fill="none" className={className}>
      <defs>
        <linearGradient id={`tee-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={hex} />
          <stop offset="100%" stopColor={dark} />
        </linearGradient>
        <filter id={`shadow-${uid}`} x="-20%" y="-10%" width="140%" height="130%">
          <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#000" floodOpacity="0.16" />
        </filter>
      </defs>

      <g filter={`url(#shadow-${uid})`}>
        {/* body + sleeves */}
        <path
          d="M42 16 L16 32 L26 56 L40 48 L40 162 L120 162 L120 48 L134 56 L144 32 L118 16 L102 26
             Q80 42 58 26 Z"
          fill={`url(#tee-${uid})`}
          stroke={dark}
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        {/* collar rib */}
        <path
          d="M58 26 Q80 42 102 26 Q96 20 80 20 Q64 20 58 26 Z"
          fill="none"
          stroke={dark}
          strokeWidth="1.5"
          opacity="0.8"
        />
        {/* center fold crease */}
        <path d="M80 42 L80 160" stroke={dark} strokeWidth="1" opacity="0.25" strokeDasharray="1 5" />
        {/* side seams */}
        <path d="M40 60 L40 160" stroke={dark} strokeWidth="1" opacity="0.3" />
        <path d="M120 60 L120 160" stroke={dark} strokeWidth="1" opacity="0.3" />
        {/* hem */}
        <path d="M44 158 L116 158" stroke={dark} strokeWidth="1" opacity="0.3" />
        {/* sleeve seam hints */}
        <path d="M26 56 L40 66" stroke={dark} strokeWidth="1" opacity="0.3" />
        <path d="M134 56 L120 66" stroke={dark} strokeWidth="1" opacity="0.3" />
      </g>
    </svg>
  );
}

export function CapArt({ hex = "#17140F", className = "" }) {
  const uid = hex.replace("#", "") + "-cap";
  const dark = shadeOf(hex);
  return (
    <svg viewBox="0 0 160 180" fill="none" className={className}>
      <defs>
        <linearGradient id={`cap-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={hex} />
          <stop offset="100%" stopColor={dark} />
        </linearGradient>
        <filter id={`shadow-${uid}`} x="-20%" y="-10%" width="140%" height="130%">
          <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#000" floodOpacity="0.16" />
        </filter>
      </defs>

      <g filter={`url(#shadow-${uid})`}>
        {/* crown */}
        <path d="M30 108 Q30 40 80 36 Q130 40 130 108 Z" fill={`url(#cap-${uid})`} stroke={dark} strokeWidth="1.5" />
        {/* panel seams */}
        <path d="M80 36 L80 108" stroke={dark} strokeWidth="1" opacity="0.3" />
        <path d="M55 42 Q50 72 54 108" stroke={dark} strokeWidth="1" opacity="0.25" fill="none" />
        <path d="M105 42 Q110 72 106 108" stroke={dark} strokeWidth="1" opacity="0.25" fill="none" />
        {/* button */}
        <circle cx="80" cy="40" r="3.5" fill="#F0EEE6" opacity="0.8" />
        {/* brim */}
        <path
          d="M24 108 L136 108 Q148 118 134 128 L26 128 Q12 118 24 108 Z"
          fill={`url(#cap-${uid})`}
          stroke={dark}
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path d="M30 112 L130 112" stroke={dark} strokeWidth="1" opacity="0.25" />
      </g>
    </svg>
  );
}

export default function ProductArt({ category, hex, className }) {
  if (category === "caps") return <CapArt hex={hex} className={className} />;
  return <TeeArt hex={hex} className={className} />;
}
