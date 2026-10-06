import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getCustomerById, publicCustomer } from "@/lib/customers";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/auth";

export async function GET() {
  const token = cookies().get(SESSION_COOKIE)?.value;
  const customerId = verifySessionToken(token);
  if (!customerId) return NextResponse.json({ customer: null });

  const customer = getCustomerById(customerId);
  return NextResponse.json({ customer: publicCustomer(customer) });
}
