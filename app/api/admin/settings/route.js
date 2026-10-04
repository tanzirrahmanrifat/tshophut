import { NextResponse } from "next/server";
import { getSettings, saveSettings } from "@/lib/settings";
import { requireAdmin } from "@/lib/adminAuth";

export async function GET() {
  const unauthorized = requireAdmin();
  if (unauthorized) return unauthorized;
  return NextResponse.json({ settings: getSettings() });
}

export async function PUT(request) {
  const unauthorized = requireAdmin();
  if (unauthorized) return unauthorized;

  const body = await request.json();
  const settings = saveSettings({
    storeName: body.storeName,
    currencySymbol: body.currencySymbol,
    freeShippingThreshold: Number(body.freeShippingThreshold) || 0,
    standardShippingFee: Number(body.standardShippingFee) || 0,
    codEnabled: !!body.codEnabled,
    supportPhone: body.supportPhone || "",
    supportEmail: body.supportEmail || "",
  });
  return NextResponse.json({ settings });
}
