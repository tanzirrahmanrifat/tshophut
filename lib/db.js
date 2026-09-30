// Minimal JSON-file "database". No external DB needed to run this project.
// Good enough for a small store; swap for Postgres/MySQL/Shopify's own API
// later without touching the route handlers much (they only call these
// functions).
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const PRODUCTS_FILE = path.join(DATA_DIR, "products.json");
const ORDERS_FILE = path.join(DATA_DIR, "orders.json");
const SEED_FILE = path.join(DATA_DIR, "seed-products.json");

function ensureFile(file, fallback) {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, JSON.stringify(fallback, null, 2));
  }
}

function readJSON(file, fallback) {
  ensureFile(file, fallback);
  try {
    return JSON.parse(fs.readFileSync(file, "utf-8"));
  } catch {
    return fallback;
  }
}

function writeJSON(file, data) {
  ensureFile(file, []);
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// ---------------- products ----------------

export function getProducts() {
  ensureFile(PRODUCTS_FILE, null);
  if (!fs.existsSync(PRODUCTS_FILE) || fs.readFileSync(PRODUCTS_FILE, "utf-8").trim() === "null") {
    const seed = readJSON(SEED_FILE, []);
    writeJSON(PRODUCTS_FILE, seed);
    return seed;
  }
  return readJSON(PRODUCTS_FILE, []);
}

export function getProductByHandle(handle) {
  return getProducts().find((p) => p.handle === handle) || null;
}

export function saveProducts(products) {
  writeJSON(PRODUCTS_FILE, products);
}

export function upsertProduct(product) {
  const products = getProducts();
  const idx = products.findIndex((p) => p.id === product.id);
  if (idx >= 0) {
    products[idx] = product;
  } else {
    products.push(product);
  }
  saveProducts(products);
  return product;
}

export function deleteProduct(id) {
  const products = getProducts().filter((p) => p.id !== id);
  saveProducts(products);
}

export function decrementStock(handle, size, qty) {
  const products = getProducts();
  const product = products.find((p) => p.handle === handle);
  if (!product) return;
  const variant = product.variants.find((v) => v.size === size);
  if (variant) variant.stock = Math.max(0, variant.stock - qty);
  saveProducts(products);
}

// ---------------- orders ----------------

export function getOrders() {
  return readJSON(ORDERS_FILE, []);
}

export function getOrderById(id) {
  return getOrders().find((o) => o.id === id) || null;
}

export function createOrder(order) {
  const orders = getOrders();
  orders.unshift(order);
  writeJSON(ORDERS_FILE, orders);
  return order;
}

export function updateOrderStatus(id, status) {
  const orders = getOrders();
  const order = orders.find((o) => o.id === id);
  if (order) order.status = status;
  writeJSON(ORDERS_FILE, orders);
  return order;
}
