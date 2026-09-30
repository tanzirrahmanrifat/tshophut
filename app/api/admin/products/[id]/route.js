import { NextResponse } from "next/server";
import { getProducts, upsertProduct, deleteProduct } from "@/lib/db";
import { requireAdmin } from "@/lib/adminAuth";

export async function PUT(request, { params }) {
  const unauthorized = requireAdmin();
  if (unauthorized) return unauthorized;

  const existing = getProducts().find((p) => p.id === params.id);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await request.json();
  const updated = { ...existing, ...body, id: existing.id };
  upsertProduct(updated);
  return NextResponse.json({ product: updated });
}

export async function DELETE(_request, { params }) {
  const unauthorized = requireAdmin();
  if (unauthorized) return unauthorized;

  deleteProduct(params.id);
  return NextResponse.json({ ok: true });
}
