import { NextResponse } from "next/server";
import { z } from "zod";
import { logAffiliatePlanChanged } from "@/lib/audit/audit-log";
import { requireRequestPermission } from "@/lib/auth/require-permission";
import { createPlanFromTemplate } from "@/lib/affiliate/plan-builder";

const schema = z.object({ templateKey: z.string().min(2) });

export async function POST(request: Request) {
  const allowed = await requireRequestPermission(request, "canManageAffiliatePlans");
  if (!allowed.ok) {
    return allowed.response;
  }

  const parsed = schema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid structure template payload." }, { status: 400 });
  }

  const result = await createPlanFromTemplate(parsed.data.templateKey);

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  await logAffiliatePlanChanged({
    actorId: allowed.user?.id,
    targetType: "affiliate_plan",
    targetId: result.planId,
    metadata: { templateKey: parsed.data.templateKey },
  });

  return NextResponse.json(result);
}
