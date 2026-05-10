import { NextResponse, type NextRequest } from "next/server";
import { REFERRAL_COOKIE, SESSION_COOKIE, VISITOR_COOKIE } from "@/lib/affiliate/attribution";
import { recordAffiliateClick } from "@/lib/affiliate/db";

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ code: string }>;
  },
) {
  const { code } = await params;
  const click = await recordAffiliateClick({ referralCode: code, request });

  const url = new URL("/", request.url);
  url.searchParams.set("ref", code);

  const response = NextResponse.redirect(url);
  response.cookies.set(REFERRAL_COOKIE, code, { maxAge: 60 * 60 * 24 * 30, sameSite: "lax", path: "/" });
  response.cookies.set(SESSION_COOKIE, click.sessionId, { maxAge: 60 * 60 * 24, sameSite: "lax", path: "/" });
  response.cookies.set(VISITOR_COOKIE, click.visitorId, { maxAge: 60 * 60 * 24 * 365, sameSite: "lax", path: "/" });

  return response;
}
