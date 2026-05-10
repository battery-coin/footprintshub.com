import { NextResponse, type NextRequest } from "next/server";
import { REFERRAL_COOKIE, SESSION_COOKIE, VISITOR_COOKIE } from "@/lib/affiliate/attribution";

export function proxy(request: NextRequest) {
  const response = NextResponse.next();
  const referralCode = request.nextUrl.searchParams.get("ref");

  if (!request.cookies.get(SESSION_COOKIE)) {
    response.cookies.set(SESSION_COOKIE, crypto.randomUUID(), { maxAge: 60 * 60 * 24, sameSite: "lax", path: "/" });
  }

  if (!request.cookies.get(VISITOR_COOKIE)) {
    response.cookies.set(VISITOR_COOKIE, crypto.randomUUID(), { maxAge: 60 * 60 * 24 * 365, sameSite: "lax", path: "/" });
  }

  if (referralCode) {
    response.cookies.set(REFERRAL_COOKIE, referralCode, { maxAge: 60 * 60 * 24 * 30, sameSite: "lax", path: "/" });
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/webhooks/stripe).*)"],
};
