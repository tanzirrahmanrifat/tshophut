import { cookies } from "next/headers";

export const ADMIN_COOKIE = "tshophut_admin";

export function isAdminAuthed() {
  return cookies().get(ADMIN_COOKIE)?.value === "1";
}

export function requireAdmin() {
  if (!isAdminAuthed()) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
  return null;
}
