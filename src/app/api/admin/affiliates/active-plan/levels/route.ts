import { NextResponse } from "next/server";
import { getAdminSecretFromRequest, isAdminSecretValid } from "@/lib/admin/auth";
import { getActiveAdminAffiliatePlan, updatePlanLevels } from "@/lib/affiliate/plan-builder";
import { levelsPayloadSchema } from "@/lib/affiliate/plan-level-validation";

export async function GET(request: Request) {
  if (!isAdminSecretValid(getAdminSecretFromRequest(request))) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const plan = await getActiveAdminAffiliatePlan();

  return NextResponse.json({ planId: plan.id, levels: plan.levels });
}

export async function PUT(request: Request) {
  if (!isAdminSecretValid(getAdminSecretFromRequest(request))) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const activePlan = await getActiveAdminAffiliatePlan();
  const parsed = levelsPayloadSchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid level payload.", issues: parsed.error.issues }, { status: 400 });
  }

  const result = await updatePlanLevels(activePlan.id, parsed.data.levels);

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  return NextResponse.json(result);
}
