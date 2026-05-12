import { NextResponse } from "next/server";
import { requireRequestPermission } from "@/lib/auth/require-permission";
import { refreshPrintfulOrderStatus } from "@/workflows/fulfillment/submit-printful-order";

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const allowed = await requireRequestPermission(request, "canManagePrintful");
  if (!allowed.ok) return allowed.response;

  const { id } = await context.params;
  const result = await refreshPrintfulOrderStatus(id).catch((error) => ({
    ok: false,
    reason: error instanceof Error ? error.message : "Refresh failed.",
  }));

  return NextResponse.json(result, { status: result.ok ? 200 : 400 });
}
