import { NextResponse } from "next/server";
import { getAdminSecretFromRequest, isAdminSecretValid } from "@/lib/admin/auth";
import { getAdminAffiliatePlan, updatePlanLevels } from "@/lib/affiliate/plan-builder";
import { levelsPayloadSchema } from "@/lib/affiliate/plan-level-validation";

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  if (!isAdminSecretValid(getAdminSecretFromRequest(request))) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await context.params;
  const plan = await getAdminAffiliatePlan(id);
  return plan ? NextResponse.json({ levels: plan.levels }) : NextResponse.json({ error: "Plan not found." }, { status: 404 });
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  if (!isAdminSecretValid(getAdminSecretFromRequest(request))) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const parsed = levelsPayloadSchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid level editor payload." }, { status: 400 });
  }

  const { id } = await context.params;
  const result = await updatePlanLevels(id, parsed.data.levels);
  return result.ok ? NextResponse.json({ accepted: true, ...result }) : NextResponse.json({ error: result.error }, { status: result.status });
}
