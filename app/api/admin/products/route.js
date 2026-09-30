import { NextResponse } from "next/server";
import { getProducts, upsertProduct } from "@/lib/db";
import { requireAdmin } from "@/lib/adminAuth";

export async function GET() {
  const unauthorized = requireAdmin();
  if (unauthorized) return unauthorized;
  return NextResponse.json({ products: getProducts() });
}

export async function POST(request) {
  const unauthorized = requireAdmin();
  if (unauthorized) return unauthorized;

  const body = await request.json();
  if (!body.name || !body.handle) {
    return NextResponse.json({ error: "name and handle are required" }, { status: 400 });
  }

  const product = {
    id: body.id || `p_${Date.now()}`,
    handle: body.handle,
    name: body.name,
    category: body.category || "tees",
    fit: body.fit || "Regular Fit",
    color: body.color || "Ink Black",
    hex: body.hex || "#17140F",
    price: Number(body.price) || 0,
    compareAtPrice: body.compareAtPrice ? Number(body.compareAtPrice) : null,
    description: body.description || "",
    featured: !!body.featured,
    isNew: !!body.isNew,
    podEnabled: !!body.podEnabled,
    rating: body.rating || 4.5,
    reviewCount: body.reviewCount || 0,
    variants: body.variants || [{ size: "M", stock: 10 }],
  };

  upsertProduct(product);
  return NextResponse.json({ product });
}
