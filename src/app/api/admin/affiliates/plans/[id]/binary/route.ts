import { NextResponse } from "next/server";
import { getAdminSecretFromRequest, isAdminSecretValid } from "@/lib/admin/auth";
import { updateStructureConfig } from "@/lib/affiliate/plan-builder";

export async function GET(request: Request) {
  if (!isAdminSecretValid(getAdminSecretFromRequest(request))) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  return NextResponse.json({ structureType: "binary", engineStatus: "scaffolded" });
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  if (!isAdminSecretValid(getAdminSecretFromRequest(request))) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  const { id } = await context.params;
  const result = await updateStructureConfig(id, "binary", await request.json().catch(() => ({})));
  return result.ok ? NextResponse.json({ accepted: true, ...result }) : NextResponse.json({ error: result.error }, { status: result.status });
}
