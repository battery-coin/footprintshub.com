import { NextResponse } from "next/server";
import { z } from "zod";
import { recordAffiliateClick } from "@/lib/affiliate/db";

const clickSchema = z.object({
  referralCode: z.string().min(2).max(64),
  productId: z.string().optional(),
  campaignId: z.string().optional(),
});

export async function POST(request: Request) {
  const parsed = clickSchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid referral click payload." }, { status: 400 });
  }

  const result = await recordAffiliateClick({
    referralCode: parsed.data.referralCode,
    productId: parsed.data.productId,
    campaignId: parsed.data.campaignId,
    request,
  });

  return NextResponse.json(result, { status: result.stored ? 201 : 202 });
}
