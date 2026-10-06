import crypto from "crypto";

const SECRET = process.env.AUTH_SECRET || "tshophut-dev-secret-change-me";
const SESSION_COOKIE = "tshophut_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export { SESSION_COOKIE, SESSION_MAX_AGE };

// ---------------- passwords ----------------

export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password, stored) {
  const [salt, hash] = (stored || "").split(":");
  if (!salt || !hash) return false;
  const check = crypto.scryptSync(password, salt, 64).toString("hex");
  const a = Buffer.from(hash, "hex");
  const b = Buffer.from(check, "hex");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

// ---------------- signed session tokens ----------------
// No external JWT library needed — a plain HMAC-signed token is enough
// for "is this customer ID legit" and keeps this project dependency-free.

export function createSessionToken(customerId) {
  const payload = Buffer.from(JSON.stringify({ id: customerId, iat: Date.now() })).toString("base64url");
  const sig = crypto.createHmac("sha256", SECRET).update(payload).digest("base64url");
  return `${payload}.${sig}`;
}

export function verifySessionToken(token) {
  if (!token) return null;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;
  const expected = crypto.createHmac("sha256", SECRET).update(payload).digest("base64url");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf-8"));
    if (Date.now() - data.iat > SESSION_MAX_AGE * 1000) return null;
    return data.id;
  } catch {
    return null;
  }
}
