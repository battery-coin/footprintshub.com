import { NextResponse } from "next/server";
import { z } from "zod";
import { writeAuditLog } from "@/lib/audit/audit-log";
import { requireRequestPermission } from "@/lib/auth/require-permission";
import { listTokenAssets, upsertTokenAsset } from "@/lib/payments/payment-policy";

const schema = z.object({
  id: z.string().optional(),
  symbol: z.string().min(1).max(20),
  name: z.string().min(1).max(120),
  chain: z.string().min(1).max(120),
  contractAddress: z.string().optional().nullable(),
  decimals: z.coerce.number().int().min(0).max(36).default(18),
  enabled: z.boolean().default(false),
  utilityDescription: z.string().max(500).optional().nullable(),
});

export async function GET(request: Request) {
  const allowed = await requireRequestPermission(request, "canViewFunds");
  if (!allowed.ok) return allowed.response;

  return NextResponse.json({ assets: await listTokenAssets() });
}

export async function POST(request: Request) {
  const allowed = await requireRequestPermission(request, "canManageFunds");
  if (!allowed.ok) return allowed.response;

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid token asset.", issues: parsed.error.issues }, { status: 400 });
  }

  const result = await upsertTokenAsset(parsed.data);
  await writeAuditLog({
    actorId: allowed.user?.id,
    action: "token_asset.updated",
    targetType: "token_asset",
    targetId: result.asset.id,
    category: "payments",
    severity: "high",
    metadata: { symbol: parsed.data.symbol, enabled: parsed.data.enabled },
  });

  return NextResponse.json(result);
}
