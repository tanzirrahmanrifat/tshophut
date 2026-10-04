import { NextResponse } from "next/server";
import { createOrder, decrementStock, getProductByHandle } from "@/lib/db";
import { validateDiscount } from "@/lib/discounts";
import { getSettings } from "@/lib/settings";

function genOrderId() {
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `TSH-${Date.now().toString().slice(-6)}${rand}`;
}

export async function POST(request) {
  const body = await request.json();
  const { items, shipping, paymentMethod, discountCode } = body;

  if (!items || items.length === 0) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  }
  if (!shipping || !shipping.name || !shipping.phone || !shipping.address) {
    return NextResponse.json({ error: "Missing shipping details" }, { status: 400 });
  }
  const settings = getSettings();
  if (paymentMethod !== "cod" || !settings.codEnabled) {
    // Real bKash/card integration would go here. For now COD is the only
    // live payment path — the front end already disables the other options,
    // and the admin can switch COD off entirely from Settings.
    return NextResponse.json({ error: "That payment method isn't live yet" }, { status: 400 });
  }

  // NOTE: in production, re-price every line server-side from the product
  // catalog instead of trusting client-sent prices, to prevent tampering.
  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  // Discounts are always re-validated here — never trust a client-sent amount.
  let discount = null;
  if (discountCode) {
    const result = validateDiscount(discountCode, subtotal);
    if (result.valid) discount = result;
  }
  const discountAmount = discount ? discount.amount : 0;
  const freeShippingFromCode = discount?.freeShipping || false;
  const shippingFee =
    subtotal >= settings.freeShippingThreshold || freeShippingFromCode ? 0 : settings.standardShippingFee;
  const total = Math.max(0, subtotal - discountAmount) + shippingFee;

  const order = {
    id: genOrderId(),
    createdAt: new Date().toISOString(),
    status: "Processing",
    paymentMethod,
    items,
    shipping,
    subtotal,
    discountCode: discount?.code || null,
    discountAmount,
    shippingFee,
    total,
  };

  createOrder(order);

  items.forEach((item) => {
    const product = getProductByHandle(item.handle);
    if (product && product.category !== "custom") {
      decrementStock(item.handle, item.size, item.qty);
    }
  });

  return NextResponse.json({ order });
}
