import { NextResponse } from "next/server";
import { z } from "zod";
import { writeAuditLog } from "@/lib/audit/audit-log";
import { requireRequestPermission } from "@/lib/auth/require-permission";
import { getPrisma, hasDatabaseUrl } from "@/lib/db/prisma";

const schema = z.object({
  tokenPaymentIntentId: z.string().min(1),
  transactionHash: z.string().min(6).max(200).optional(),
  paidUnits: z.coerce.number().positive(),
  note: z.string().max(500).optional(),
});

export async function POST(request: Request) {
  const allowed = await requireRequestPermission(request, "canManageFunds");
  if (!allowed.ok) return allowed.response;

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid manual token verification.", issues: parsed.error.issues }, { status: 400 });
  }

  if (!hasDatabaseUrl()) {
    return NextResponse.json({ ok: true, stored: false, message: "Manual token verification accepted as scaffold until DATABASE_URL is configured." });
  }

  const prisma = getPrisma();
  const intent = await prisma.tokenPaymentIntent.update({
    where: { id: parsed.data.tokenPaymentIntentId },
    data: { status: "confirmed", paidUnits: parsed.data.paidUnits, transactionHash: parsed.data.transactionHash ?? null },
  });

  await writeAuditLog({
    actorId: allowed.user?.id,
    action: "token_payment.manual_verified",
    targetType: "token_payment_intent",
    targetId: intent.id,
    category: "payments",
    severity: "critical",
    metadata: { transactionHash: parsed.data.transactionHash, note: parsed.data.note },
  });

  return NextResponse.json({ ok: true, stored: true, intent });
}
