import { NextResponse } from "next/server";
import { z } from "zod";
import { validatePayoutRequest } from "@/lib/affiliate/commission-engine";

const payoutSchema = z.object({
  amountCents: z.coerce.number().int().positive(),
  availableCents: z.coerce.number().int().min(0),
});

export async function POST(request: Request) {
  const parsed = payoutSchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payout request." }, { status: 400 });
  }

  const result = validatePayoutRequest({
    program: {
      minPayoutCents: 5000,
      withdrawalFeeCents: 250,
    },
    availableCents: parsed.data.availableCents,
    amountCents: parsed.data.amountCents,
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.reason }, { status: 400 });
  }

  return NextResponse.json({
    accepted: true,
    feeCents: result.feeCents,
    netAmountCents: result.netAmountCents,
  });
}
