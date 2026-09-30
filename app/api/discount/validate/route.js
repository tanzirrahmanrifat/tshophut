import { NextResponse } from "next/server";
import { validateDiscount } from "@/lib/discounts";

export async function POST(request) {
  const { code, subtotal } = await request.json();
  const result = validateDiscount(code, Number(subtotal) || 0);
  if (!result.valid) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  return NextResponse.json(result);
}
