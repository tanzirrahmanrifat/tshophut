import { NextResponse } from "next/server";
import { getCustomerByContact, publicCustomer } from "@/lib/customers";
import { verifyPassword, createSessionToken, SESSION_COOKIE, SESSION_MAX_AGE } from "@/lib/auth";

export async function POST(request) {
  const { contact, password } = await request.json();
  const customer = getCustomerByContact(contact || "");

  if (!customer || !verifyPassword(password || "", customer.passwordHash)) {
    return NextResponse.json({ error: "Wrong phone/email or password." }, { status: 401 });
  }

  const res = NextResponse.json({ customer: publicCustomer(customer) });
  res.cookies.set(SESSION_COOKIE, createSessionToken(customer.id), {
    httpOnly: true,
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });
  return res;
}
