import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminSecretFromRequest, isAdminSecretValid } from "@/lib/admin/auth";
import { hasDatabaseUrl, getPrisma } from "@/lib/db/prisma";

const statusSchema = z.object({
  affiliateId: z.string(),
  status: z.enum(["pending", "approved", "rejected", "suspended"]),
  note: z.string().optional(),
});

export async function POST(request: Request) {
  if (!isAdminSecretValid(getAdminSecretFromRequest(request))) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const parsed = statusSchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid affiliate status payload." }, { status: 400 });
  }

  if (!hasDatabaseUrl()) {
    return NextResponse.json({ accepted: true, stored: false });
  }

  const prisma = getPrisma();
  const previous = await prisma.affiliate.findUnique({ where: { id: parsed.data.affiliateId } });

  if (!previous) {
    return NextResponse.json({ error: "Affiliate not found." }, { status: 404 });
  }

  const now = new Date();
  const affiliate = await prisma.affiliate.update({
    where: { id: parsed.data.affiliateId },
    data: {
      status: parsed.data.status,
      notes: parsed.data.note,
      approvedAt: parsed.data.status === "approved" ? now : undefined,
      rejectedAt: parsed.data.status === "rejected" ? now : undefined,
      suspendedAt: parsed.data.status === "suspended" ? now : undefined,
    },
  });

  await prisma.affiliateAuditLog.create({
    data: {
      shopId: affiliate.shopId,
      affiliateId: affiliate.id,
      action: "affiliate_status_update",
      entityType: "Affiliate",
      entityId: affiliate.id,
      before: { status: previous.status },
      after: { status: affiliate.status, note: parsed.data.note },
    },
  });

  return NextResponse.json({ accepted: true, stored: true, affiliateId: affiliate.id });
}
