import { NextResponse } from "next/server";
import { requireRequestPermission } from "@/lib/auth/require-permission";
import { getPrisma, hasDatabaseUrl } from "@/lib/db/prisma";
import { RefundError } from "@/lib/refunds/refund-errors";
import { createRefundRequest } from "@/lib/refunds/refund-service";
import { createRefundSchema } from "@/lib/refunds/refund-validation";

export async function GET(request: Request) {
  const allowed = await requireRequestPermission(request, "canManageRefunds");
  if (!allowed.ok) return allowed.response;

  if (!hasDatabaseUrl()) {
    return NextResponse.json({ refunds: [], stored: false });
  }

  const refunds = await getPrisma().refund.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      order: { select: { orderNumber: true, customerEmail: true, paymentStatus: true, refundStatus: true } },
      items: true,
    },
  });

  return NextResponse.json({ refunds });
}

export async function POST(request: Request) {
  const allowed = await requireRequestPermission(request, "canManageRefunds");
  if (!allowed.ok) return allowed.response;

  const parsed = createRefundSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid refund payload.", details: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const result = await createRefundRequest(parsed.data, allowed.user?.id);
    return NextResponse.json(result, { status: result.processed ? 200 : 202 });
  } catch (error) {
    const status = error instanceof RefundError ? error.status : 500;
    return NextResponse.json({ error: error instanceof Error ? error.message : "Refund request failed." }, { status });
  }
}
