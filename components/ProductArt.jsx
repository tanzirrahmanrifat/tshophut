// Illustrated line-art stand-ins for product photography. Swap the <img>
// in ProductCard/ProductGallery for real photos once you have them —
// nothing else needs to change since both accept the same "hex" prop shape.

export function TeeArt({ hex = "#17140F", className = "" }) {
  return (
    <svg viewBox="0 0 160 170" fill="none" className={className}>
      <path
        d="M40 14 L14 30 L24 52 L38 45 L38 156 L122 156 L122 45 L136 52 L146 30 L120 14 L104 24 Q80 38 56 24 Z"
        fill={hex}
      />
    </svg>
  );
}

export function CapArt({ hex = "#17140F", className = "" }) {
  return (
    <svg viewBox="0 0 160 170" fill="none" className={className}>
      <path d="M28 100 Q28 36 80 32 Q132 36 132 100 Z" fill={hex} />
      <path
        d="M22 100 L138 100 Q148 110 138 118 L28 118 Q16 110 22 100 Z"
        fill={hex}
      />
      <circle cx="80" cy="36" r="4" fill="#F0EEE6" opacity="0.7" />
    </svg>
  );
}

export default function ProductArt({ category, hex, className }) {
  if (category === "caps") return <CapArt hex={hex} className={className} />;
  return <TeeArt hex={hex} className={className} />;
}
