"use client";

import { useEffect, useState } from "react";

function timeAgo(iso) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const hours = Math.floor(diffMs / 3600000);
  if (hours < 1) return "within the last hour";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function SocialProofBadge({ handle }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`/api/social-proof?handle=${encodeURIComponent(handle)}`)
      .then((r) => r.json())
      .then(setData)
      .catch(() => {});
  }, [handle]);

  if (!data || data.count === 0) return null;

  return (
    <div className="flex items-center gap-2 font-mono text-[11px] text-ink/60 bg-canvas-dim px-3 py-2 rounded-sm w-fit">
      <span className="w-1.5 h-1.5 rounded-full bg-cobalt flex-none" />
      {data.count} ordered in the last 7 days
      {data.mostRecent && <span className="text-ink/40">· last one {timeAgo(data.mostRecent)}</span>}
    </div>
  );
}
