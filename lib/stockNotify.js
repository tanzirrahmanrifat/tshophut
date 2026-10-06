import fs from "fs";
import path from "path";

const DATA_DIR = process.env.VERCEL
  ? path.join("/tmp", "tshophut-data")
  : path.join(process.cwd(), "data");
const FILE = path.join(DATA_DIR, "stock-notify.json");

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

export function getStockNotifyRequests() {
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

export function addStockNotifyRequest(entry) {
  const list = getStockNotifyRequests();
  list.unshift(entry);
  ensureDir();
  fs.writeFileSync(FILE, JSON.stringify(list, null, 2));
  return entry;
}
