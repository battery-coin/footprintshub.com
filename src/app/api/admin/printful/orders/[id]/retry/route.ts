import { NextResponse } from "next/server";
import { requireRequestPermission } from "@/lib/auth/require-permission";
import { getPrisma } from "@/lib/db/prisma";
import { submitPrintfulOrderForPaidOrder } from "@/workflows/fulfillment/submit-printful-order";

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const allowed = await requireRequestPermission(request, "canManagePrintful");
  if (!allowed.ok) return allowed.response;

  const { id } = await context.params;
  const record = await getPrisma().printfulOrder.findUnique({ where: { id } });

  if (!record) {
    return NextResponse.json({ ok: false, reason: "Printful record not found." }, { status: 404 });
  }

  const result = await submitPrintfulOrderForPaidOrder(record.orderId, { forceRetry: true });
  return NextResponse.json(result, { status: result.ok ? 200 : 400 });
}
