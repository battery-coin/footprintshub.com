import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminSecretFromRequest, isAdminSecretValid } from "@/lib/admin/auth";

const refundSchema = z.object({
  orderId: z.string().min(1),
  amountCents: z.coerce.number().int().positive(),
  reason: z.string().min(3).max(500).optional(),
  restock: z.boolean().optional(),
});

export async function GET(request: Request) {
  if (!isAdminSecretValid(getAdminSecretFromRequest(request))) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  return NextResponse.json({ refunds: [] });
}

export async function POST(request: Request) {
  if (!isAdminSecretValid(getAdminSecretFromRequest(request))) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const parsed = refundSchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid refund payload." }, { status: 400 });
  }

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

