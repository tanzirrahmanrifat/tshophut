import fs from "fs";
import path from "path";

const DATA_DIR = process.env.VERCEL
  ? path.join("/tmp", "tshophut-data")
  : path.join(process.cwd(), "data");
const DISCOUNTS_FILE = path.join(DATA_DIR, "discounts.json");

const SEED_DISCOUNTS = [
  { id: "d1", code: "WELCOME10", type: "percent", value: 10, active: true },
  { id: "d2", code: "FREESHIP", type: "freeship", value: 0, active: true },
  { id: "d3", code: "FLAT100", type: "flat", value: 100, active: true },
];

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

export function getDiscounts() {
  ensureDir();
  if (!fs.existsSync(DISCOUNTS_FILE)) {
    fs.writeFileSync(DISCOUNTS_FILE, JSON.stringify(SEED_DISCOUNTS, null, 2));
    return SEED_DISCOUNTS;
  }
  try {
    return JSON.parse(fs.readFileSync(DISCOUNTS_FILE, "utf-8"));
  } catch {
    return SEED_DISCOUNTS;
  }
}

function saveDiscounts(discounts) {
  ensureDir();
  fs.writeFileSync(DISCOUNTS_FILE, JSON.stringify(discounts, null, 2));
}

export function upsertDiscount(discount) {
  const discounts = getDiscounts();
  const idx = discounts.findIndex((d) => d.id === discount.id);
  if (idx >= 0) discounts[idx] = discount;
  else discounts.push(discount);
  saveDiscounts(discounts);
  return discount;
}

export function deleteDiscount(id) {
  saveDiscounts(getDiscounts().filter((d) => d.id !== id));
}

// Single source of truth for whether a code is usable — called both by the
// checkout-preview endpoint and by the real checkout route, so nothing a
// client sends is ever trusted directly.
export function validateDiscount(code, subtotal) {
  const key = (code || "").trim().toUpperCase();
  const discount = getDiscounts().find((d) => d.code === key && d.active);
  if (!discount) return { valid: false, error: "That code isn't valid." };

  if (discount.type === "percent") {
    return {
      valid: true,
      code: key,
      label: `${discount.value}% off`,
      amount: Math.round(subtotal * (discount.value / 100)),
      freeShipping: false,
    };
  }
  if (discount.type === "flat") {
    return {
      valid: true,
      code: key,
      label: `৳${discount.value} off`,
      amount: Math.min(discount.value, subtotal),
      freeShipping: false,
    };
  }
  if (discount.type === "freeship") {
    return { valid: true, code: key, label: "Free shipping", amount: 0, freeShipping: true };
  }
  return { valid: false, error: "That code isn't valid." };
}
