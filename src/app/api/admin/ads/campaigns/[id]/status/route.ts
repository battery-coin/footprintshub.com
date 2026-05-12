import { NextResponse } from "next/server";
import { z } from "zod";
import { requireRequestPermission } from "@/lib/auth/require-permission";
import { getPrisma, hasDatabaseUrl } from "@/lib/db/prisma";

const schema = z.object({
  status: z.enum(["approved", "scheduled", "live", "paused", "completed", "rejected", "cancelled"]),
  rejectionReason: z.string().trim().max(500).optional(),
  adminNotes: z.string().trim().max(1000).optional(),
});

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const permission = await requireRequestPermission(request, "canManageAds");
  if (!permission.ok) return permission.response;

  const { id } = await params;
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid ad campaign status update." }, { status: 400 });
  }
  if (!hasDatabaseUrl()) {
    return NextResponse.json({ ok: true, stored: false });
  }

  const now = new Date();
  const campaign = await getPrisma().adCampaign.update({
    where: { id },
    data: {
      status: parsed.data.status,
      rejectionReason: parsed.data.rejectionReason,
      adminNotes: parsed.data.adminNotes,
      approvedAt: parsed.data.status === "approved" ? now : undefined,
      rejectedAt: parsed.data.status === "rejected" ? now : undefined,
      pausedAt: parsed.data.status === "paused" ? now : undefined,
      completedAt: parsed.data.status === "completed" ? now : undefined,
    },
  });

  return NextResponse.json({ ok: true, campaign });
}
