import { NextResponse } from "next/server";
import { z } from "zod";
import { writeAuditLog } from "@/lib/audit/audit-log";
import { requireRequestPermission } from "@/lib/auth/require-permission";
import { getActiveGlobalPaymentPolicy, saveGlobalPaymentPolicy } from "@/lib/payments/payment-policy";

const schema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional().nullable(),
  status: z.enum(["draft", "active", "archived"]).default("active"),
  compositionMode: z.enum(["fiat_only", "token_only", "mixed_ratio", "owner_defined", "product_override", "subscription_override"]),
  fiatCurrency: z.string().default("USD"),
  fiatPercentageBps: z.coerce.number().int().min(0).max(10000),
  tokenPercentageBps: z.coerce.number().int().min(0).max(10000),
  tokenAssetId: z.string().optional().nullable(),
  appliesTo: z.enum(["global", "product", "category", "collection", "subscription", "ad", "affiliate_payout", "manual"]).default("global"),
  requireExactRatio: z.boolean().default(true),
  roundingMode: z.enum(["nearest_cent", "round_up_fiat", "round_up_token"]).default("nearest_cent"),
});

export async function GET(request: Request) {
  const allowed = await requireRequestPermission(request, "canViewFunds");
  if (!allowed.ok) return allowed.response;

  return NextResponse.json({ policy: await getActiveGlobalPaymentPolicy() });
}

export async function PUT(request: Request) {
  const allowed = await requireRequestPermission(request, "canManageFunds");
  if (!allowed.ok) return allowed.response;

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payment policy.", issues: parsed.error.issues }, { status: 400 });
  }

  const result = await saveGlobalPaymentPolicy(parsed.data);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  await writeAuditLog({
    actorId: allowed.user?.id,
    action: "payment_policy.updated",
    targetType: "payment_policy",
    targetId: result.policy.id,
    category: "payments",
    severity: "high",
    metadata: {
      compositionMode: parsed.data.compositionMode,
      fiatPercentageBps: parsed.data.fiatPercentageBps,
      tokenPercentageBps: parsed.data.tokenPercentageBps,
    },
  });

  return NextResponse.json(result);
}
