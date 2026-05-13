import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminSecretFromRequest, isAdminSecretValid } from "@/lib/admin/auth";
import { createPlanFromTemplate } from "@/lib/affiliate/plan-builder";
import { getAffiliateStructureTemplate } from "@/lib/affiliate/structure-templates";

const schema = z.object({
  templateKey: z.string().min(2).optional(),
  structureType: z.enum(["binary", "matrix", "unilevel"]).optional(),
});

export async function POST(request: Request) {
  if (!isAdminSecretValid(getAdminSecretFromRequest(request))) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
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

  return NextResponse.json(result);
}
