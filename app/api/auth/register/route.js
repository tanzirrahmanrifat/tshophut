import { NextResponse } from "next/server";
import { getCustomerByContact, createCustomer, publicCustomer } from "@/lib/customers";
import { hashPassword, createSessionToken, SESSION_COOKIE, SESSION_MAX_AGE } from "@/lib/auth";

export async function POST(request) {
  const { name, contact, password } = await request.json();

  if (!name?.trim() || !contact?.trim() || !password || password.length < 6) {
    return NextResponse.json(
      { error: "Name, phone/email, and a password of at least 6 characters are required." },
      { status: 400 }
    );
  }

  if (getCustomerByContact(contact)) {
    return NextResponse.json({ error: "An account with that phone/email already exists — try logging in." }, { status: 409 });
  }

  const customer = {
    id: `cust_${Date.now()}`,
    name: name.trim(),
    contact: contact.trim(),
    passwordHash: hashPassword(password),
    createdAt: new Date().toISOString(),
  };
  createCustomer(customer);

  const res = NextResponse.json({ customer: publicCustomer(customer) });
  res.cookies.set(SESSION_COOKIE, createSessionToken(customer.id), {
    httpOnly: true,
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });
  return res;
}
