import { NextResponse } from "next/server";
import { getOrders } from "@/lib/db";

// Honest social proof: counts only come from real orders in data/orders.json.
// No fabricated names or invented purchase events — if there's no real
// activity, the endpoint says so and the UI shows nothing rather than make
// something up.
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const handle = searchParams.get("handle");
  if (!handle) return NextResponse.json({ error: "handle required" }, { status: 400 });

  const orders = getOrders();
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

  const matching = orders.filter(
    (o) => new Date(o.createdAt).getTime() >= sevenDaysAgo && o.items.some((i) => i.handle === handle)
  );

  const count = matching.reduce((sum, o) => sum + o.items.filter((i) => i.handle === handle).reduce((s, i) => s + i.qty, 0), 0);
  const mostRecent = matching[0]?.createdAt || null;

  return NextResponse.json({ count, mostRecent });
}
