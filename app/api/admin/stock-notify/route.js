import { NextResponse } from "next/server";
import { getStockNotifyRequests } from "@/lib/stockNotify";
import { requireAdmin } from "@/lib/adminAuth";

export async function GET() {
  const unauthorized = requireAdmin();
  if (unauthorized) return unauthorized;
  return NextResponse.json({ requests: getStockNotifyRequests() });
}
