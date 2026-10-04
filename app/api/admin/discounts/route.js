import { NextResponse } from "next/server";
import { getDiscounts, upsertDiscount } from "@/lib/discounts";
import { requireAdmin } from "@/lib/adminAuth";

export async function GET() {
  const unauthorized = requireAdmin();
  if (unauthorized) return unauthorized;
  return NextResponse.json({ discounts: getDiscounts() });
}

export async function POST(request) {
  const unauthorized = requireAdmin();
  if (unauthorized) return unauthorized;

  const body = await request.json();
  if (!body.code || !body.type) {
    return NextResponse.json({ error: "code and type are required" }, { status: 400 });
  }

  const discount = {
    id: `d_${Date.now()}`,
    code: body.code.trim().toUpperCase(),
    type: body.type, // "percent" | "flat" | "freeship"
    value: Number(body.value) || 0,
    active: body.active !== false,
  };
  upsertDiscount(discount);
  return NextResponse.json({ discount });
}
