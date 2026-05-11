import { NextResponse } from "next/server";
import { requireRequestPermission } from "@/lib/auth/require-permission";
import { affiliateStructureTemplates } from "@/lib/affiliate/structure-templates";

export async function GET(request: Request) {
  const allowed = await requireRequestPermission(request, "canManageAffiliatePlans");
  if (!allowed.ok) {
    return allowed.response;
  }

  return NextResponse.json({ structures: affiliateStructureTemplates });
}
