import fs from "fs";
import path from "path";

const DATA_DIR = process.env.VERCEL
  ? path.join("/tmp", "tshophut-data")
  : path.join(process.cwd(), "data");
const FILE = path.join(DATA_DIR, "customers.json");

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

export function getCustomers() {
  ensureDir();
  if (!fs.existsSync(FILE)) {
    fs.writeFileSync(FILE, "[]");
    return [];
  }
  try {
    return JSON.parse(fs.readFileSync(FILE, "utf-8"));
  } catch {
    return [];
  }
}

function saveCustomers(list) {
  ensureDir();
  fs.writeFileSync(FILE, JSON.stringify(list, null, 2));
}

export function getCustomerByContact(contact) {
  const key = (contact || "").trim().toLowerCase();
  return getCustomers().find((c) => c.contact.toLowerCase() === key) || null;
}

export function getCustomerById(id) {
  return getCustomers().find((c) => c.id === id) || null;
}

export function createCustomer(customer) {
  const list = getCustomers();
  list.push(customer);
  saveCustomers(list);
  return customer;
}

export function updateCustomer(id, patch) {
  const list = getCustomers();
  const idx = list.findIndex((c) => c.id === id);
  if (idx === -1) return null;
  list[idx] = { ...list[idx], ...patch };
  saveCustomers(list);
  return list[idx];
}

// Never send the password hash to the client.
export function publicCustomer(customer) {
  if (!customer) return null;
  const { passwordHash, ...rest } = customer;
  return rest;
}
