import { NextResponse } from "next/server";
import { getProducts } from "@/lib/db";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") || "").toLowerCase();
  const category = searchParams.get("category");

  let products = getProducts();
  if (category) products = products.filter((p) => p.category === category);
  if (q) {
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.color.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }
  return NextResponse.json({ products });
}
