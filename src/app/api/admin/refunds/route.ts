import { NextResponse } from "next/server";
import { z } from "zod";
import { logRefundApproved } from "@/lib/audit/audit-log";
import { requireRequestPermission } from "@/lib/auth/require-permission";

const refundSchema = z.object({
  orderId: z.string().min(1),
  amountCents: z.coerce.number().int().positive(),
  reason: z.string().min(3).max(500).optional(),
  restock: z.boolean().optional(),
});

export async function GET(request: Request) {
  const allowed = await requireRequestPermission(request, "canManageRefunds");
  if (!allowed.ok) {
    return allowed.response;
  }

  return NextResponse.json({ refunds: [] });
}

export async function POST(request: Request) {
  const allowed = await requireRequestPermission(request, "canManageRefunds");
  if (!allowed.ok) {
    return allowed.response;
  }

  const parsed = refundSchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid refund payload." }, { status: 400 });
  }

  await logRefundApproved({
    actorId: allowed.user?.id,
    targetType: "refund",
    targetId: parsed.data.orderId,
    metadata: parsed.data,
  });

  return NextResponse.json(
    {
      accepted: true,
      stored: false,
      message: "Refund review payload accepted. Connect Stripe refund execution and Neon persistence before production writes.",
      refund: parsed.data,
    },
    { status: 202 },
  );
}
