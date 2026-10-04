import { NextResponse } from "next/server";
import { getSettings } from "@/lib/settings";

export async function GET() {
  // Public, read-only — the storefront needs shipping thresholds/fees to
  // render the free-shipping bar and checkout totals correctly.
  const settings = getSettings();
  return NextResponse.json({ settings });
}
