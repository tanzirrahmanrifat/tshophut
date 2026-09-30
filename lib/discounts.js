// A handful of starter promo codes. Add/edit here — both the checkout
// preview and the server-side order total use this same list, so there's
// no way for a client to fake a discount.
const CODES = {
  WELCOME10: { type: "percent", value: 10, label: "10% off" },
  FREESHIP: { type: "freeship", value: 0, label: "Free shipping" },
  FLAT100: { type: "flat", value: 100, label: "৳100 off" },
};

export function validateDiscount(code, subtotal) {
  const key = (code || "").trim().toUpperCase();
  const discount = CODES[key];
  if (!discount) return { valid: false, error: "That code isn't valid." };
  if (discount.type === "percent") {
    return { valid: true, code: key, label: discount.label, amount: Math.round(subtotal * (discount.value / 100)), freeShipping: false };
  }
  if (discount.type === "flat") {
    return { valid: true, code: key, label: discount.label, amount: Math.min(discount.value, subtotal), freeShipping: false };
  }
  if (discount.type === "freeship") {
    return { valid: true, code: key, label: discount.label, amount: 0, freeShipping: true };
  }
  return { valid: false, error: "That code isn't valid." };
}
