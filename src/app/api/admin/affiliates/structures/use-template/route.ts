import { NextResponse } from "next/server";
import { z } from "zod";
import { logAffiliatePlanChanged } from "@/lib/audit/audit-log";
import { requireRequestPermission } from "@/lib/auth/require-permission";
import { createPlanFromTemplate } from "@/lib/affiliate/plan-builder";
import { getAffiliateStructureTemplate } from "@/lib/affiliate/structure-templates";

const schema = z.object({
  templateKey: z.string().min(2).optional(),
  structureType: z.enum(["binary", "matrix", "unilevel"]).optional(),
});

export async function POST(request: Request) {
  const allowed = await requireRequestPermission(request, "canManageAffiliatePlans");
  if (!allowed.ok) {
    return allowed.response;
  }

  const parsed = schema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid structure template payload." }, { status: 400 });
  }

  const templateKey = parsed.data.templateKey ?? (parsed.data.structureType ? getAffiliateStructureTemplate(parsed.data.structureType)?.key : undefined);

  if (!templateKey) {
    return NextResponse.json({ error: "Choose Binary, Matrix, or Unilevel." }, { status: 400 });
  }

  const result = await createPlanFromTemplate(templateKey).catch((error) => ({
    ok: false as const,
    status: 500,
    error: error instanceof Error ? error.message : "Could not create affiliate structure.",
  }));

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  await logAffiliatePlanChanged({
    actorId: allowed.user?.id,
    targetType: "affiliate_plan",
    targetId: result.planId,
    metadata: { templateKey, structureType: parsed.data.structureType },
  });

  return NextResponse.json(result);
}
