import { NextResponse } from "next/server";
import { getOrders } from "@/lib/db";
import { requireAdmin } from "@/lib/adminAuth";

export async function GET() {
  const unauthorized = requireAdmin();
  if (unauthorized) return unauthorized;
  return NextResponse.json({ orders: getOrders() });
}
