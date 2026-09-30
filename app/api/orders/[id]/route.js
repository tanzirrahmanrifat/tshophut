import { NextResponse } from "next/server";
import { getOrderById } from "@/lib/db";

export async function GET(_request, { params }) {
  const order = getOrderById(params.id);
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }
  return NextResponse.json({ order });
}
