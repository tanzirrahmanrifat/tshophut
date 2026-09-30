import { NextResponse } from "next/server";
import { updateOrderStatus } from "@/lib/db";
import { requireAdmin } from "@/lib/adminAuth";

export async function PATCH(request, { params }) {
  const unauthorized = requireAdmin();
  if (unauthorized) return unauthorized;

  const { status } = await request.json();
  const order = updateOrderStatus(params.id, status);
  return NextResponse.json({ order });
}
