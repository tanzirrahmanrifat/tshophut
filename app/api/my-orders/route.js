import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getOrders } from "@/lib/db";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/auth";

export async function GET() {
  const token = cookies().get(SESSION_COOKIE)?.value;
  const customerId = verifySessionToken(token);
  if (!customerId) return NextResponse.json({ orders: [] });

  const orders = getOrders().filter((o) => o.customerId === customerId);
  return NextResponse.json({ orders });
}
