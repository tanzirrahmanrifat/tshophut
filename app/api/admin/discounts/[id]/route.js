import { NextResponse } from "next/server";
import { getDiscounts, upsertDiscount, deleteDiscount } from "@/lib/discounts";
import { requireAdmin } from "@/lib/adminAuth";

export async function PUT(request, { params }) {
  const unauthorized = requireAdmin();
  if (unauthorized) return unauthorized;

  const existing = getDiscounts().find((d) => d.id === params.id);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await request.json();
  const updated = {
    ...existing,
    ...body,
    id: existing.id,
    code: body.code ? body.code.trim().toUpperCase() : existing.code,
    value: body.value !== undefined ? Number(body.value) : existing.value,
  };
  upsertDiscount(updated);
  return NextResponse.json({ discount: updated });
}

export async function DELETE(_request, { params }) {
  const unauthorized = requireAdmin();
  if (unauthorized) return unauthorized;
  deleteDiscount(params.id);
  return NextResponse.json({ ok: true });
}
