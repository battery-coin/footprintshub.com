import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminSecretFromRequest, isAdminSecretValid } from "@/lib/admin/auth";
import { getAdminAffiliatePlan, updatePlanLevels } from "@/lib/affiliate/plan-builder";

const levelSchema = z.object({
  levelDepth: z.coerce.number().int().min(0).max(20),
  label: z.string().min(1).max(80),
  enabled: z.boolean(),
  commissionType: z.enum(["percentage", "fixed", "percentage_plus_fixed", "store_credit"]),
  percentageBps: z.coerce.number().int().min(0).max(10000).optional(),
  fixedCents: z.coerce.number().int().min(0).optional(),
  commissionBase: z.enum(["order_subtotal", "product_subtotal", "item_subtotal", "direct_commission", "leg_volume", "weaker_leg_volume", "matrix_level_volume", "gross_margin"]),
  maxPerOrderCents: z.coerce.number().int().min(0).optional(),
  maxPerMonthCents: z.coerce.number().int().min(0).optional(),
  sortOrder: z.coerce.number().int().default(0),
});

const schema = z.object({ levels: z.array(levelSchema).min(1).max(25) });

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

  const parsed = schema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid level editor payload." }, { status: 400 });
  }

  const { id } = await context.params;
  const result = await updatePlanLevels(id, parsed.data.levels);
  return result.ok ? NextResponse.json({ accepted: true, ...result }) : NextResponse.json({ error: result.error }, { status: result.status });
}
