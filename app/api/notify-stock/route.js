import { NextResponse } from "next/server";
import { addStockNotifyRequest } from "@/lib/stockNotify";

export async function POST(request) {
  const body = await request.json();
  if (!body.contact || !body.handle || !body.size) {
    return NextResponse.json({ error: "Missing details" }, { status: 400 });
  }
  addStockNotifyRequest({
    id: `n_${Date.now()}`,
    handle: body.handle,
    productName: body.productName || body.handle,
    size: body.size,
    contact: body.contact.trim(),
    createdAt: new Date().toISOString(),
  });
  return NextResponse.json({ ok: true });
}
