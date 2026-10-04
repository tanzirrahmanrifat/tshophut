export default function MiniBarChart({ data, height = 120 }) {
  const max = Math.max(1, ...data.map((d) => d.value));
  const barWidth = 100 / data.length;

  return (
    <div>
      <svg viewBox={`0 0 100 ${height}`} preserveAspectRatio="none" className="w-full" style={{ height }}>
        {data.map((d, i) => {
          const barHeight = (d.value / max) * (height - 20);
          return (
            <rect
              key={i}
              x={i * barWidth + barWidth * 0.2}
              y={height - 20 - barHeight}
              width={barWidth * 0.6}
              height={barHeight}
              fill="#2C46E0"
              rx="1"
            />
          );
        })}
      </svg>
      <div className="flex justify-between mt-1">
        {data.map((d, i) => (
          <span key={i} className="font-mono text-[9px] text-ink/40" style={{ width: `${barWidth}%`, textAlign: "center" }}>
            {d.label}
          </span>
        ))}
      </div>
    </div>
  );
}
