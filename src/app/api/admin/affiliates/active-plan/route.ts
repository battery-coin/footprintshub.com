import { NextResponse } from "next/server";
import { getAdminSecretFromRequest, isAdminSecretValid } from "@/lib/admin/auth";
import { getActiveAdminAffiliatePlan } from "@/lib/affiliate/plan-builder";

export async function GET(request: Request) {
  if (!isAdminSecretValid(getAdminSecretFromRequest(request))) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const plan = await getActiveAdminAffiliatePlan();

  return NextResponse.json({ plan });
}
