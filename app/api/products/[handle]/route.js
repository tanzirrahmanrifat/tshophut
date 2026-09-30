import { NextResponse } from "next/server";
import { getProductByHandle } from "@/lib/db";

export async function GET(_request, { params }) {
  const product = getProductByHandle(params.handle);
  if (!product) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ product });
}
