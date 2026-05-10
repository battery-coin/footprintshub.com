import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminSecretFromRequest, isAdminSecretValid } from "@/lib/admin/auth";
import { getAdminAffiliatePlan } from "@/lib/affiliate/plan-builder";
import { hasDatabaseUrl, getPrisma } from "@/lib/db/prisma";

const updateSchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().optional(),
  maxActiveLevels: z.coerce.number().int().min(0).max(7).optional(),
  maxCommissionPoolBps: z.coerce.number().int().min(0).max(10000).optional(),
  holdDays: z.coerce.number().int().min(0).max(365).optional(),
});

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  if (!isAdminSecretValid(getAdminSecretFromRequest(request))) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await context.params;
  const plan = await getAdminAffiliatePlan(id);

  return plan ? NextResponse.json({ plan }) : NextResponse.json({ error: "Plan not found." }, { status: 404 });
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  if (!isAdminSecretValid(getAdminSecretFromRequest(request))) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const parsed = updateSchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid affiliate plan update payload." }, { status: 400 });
  }

  if (!hasDatabaseUrl()) {
    return NextResponse.json({ accepted: true, stored: false });
  }

  const { id } = await context.params;
  const plan = await getPrisma().affiliatePlan.update({ where: { id }, data: parsed.data });
  return NextResponse.json({ accepted: true, stored: true, planId: plan.id });
}
