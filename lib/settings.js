import fs from "fs";
import path from "path";

const DATA_DIR = process.env.VERCEL
  ? path.join("/tmp", "tshophut-data")
  : path.join(process.cwd(), "data");
const SETTINGS_FILE = path.join(DATA_DIR, "settings.json");

const DEFAULTS = {
  storeName: "Tshophut",
  currencySymbol: "৳",
  freeShippingThreshold: 2000,
  standardShippingFee: 80,
  codEnabled: true,
  supportPhone: "",
  supportEmail: "",
};

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

export function getSettings() {
  ensureDir();
  if (!fs.existsSync(SETTINGS_FILE)) {
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(DEFAULTS, null, 2));
    return DEFAULTS;
  }
  try {
    const stored = JSON.parse(fs.readFileSync(SETTINGS_FILE, "utf-8"));
    return { ...DEFAULTS, ...stored };
  } catch {
    return DEFAULTS;
  }
}

export function saveSettings(patch) {
  const current = getSettings();
  const next = { ...current, ...patch };
  ensureDir();
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify(next, null, 2));
  return next;
}
