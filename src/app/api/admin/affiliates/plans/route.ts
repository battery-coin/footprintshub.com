import { NextResponse } from "next/server";
import { z } from "zod";
import { logAffiliatePlanChanged } from "@/lib/audit/audit-log";
import { requireRequestPermission } from "@/lib/auth/require-permission";
import { createPlanFromTemplate, listAdminAffiliatePlans } from "@/lib/affiliate/plan-builder";

const createSchema = z.object({ templateKey: z.string().min(2).default("unilevel-7-level") });

export async function GET(request: Request) {
  const allowed = await requireRequestPermission(request, "canManageAffiliatePlans");
  if (!allowed.ok) {
    return allowed.response;
  }

  return NextResponse.json({ plans: await listAdminAffiliatePlans() });
}

export async function POST(request: Request) {
  const allowed = await requireRequestPermission(request, "canManageAffiliatePlans");
  if (!allowed.ok) {
    return allowed.response;
  }

  const parsed = createSchema.safeParse(await request.json().catch(() => ({})));

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid affiliate plan payload." }, { status: 400 });
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
