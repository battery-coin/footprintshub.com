import { NextResponse } from "next/server";
import { z } from "zod";
import { logRoleAssigned } from "@/lib/audit/audit-log";
import { requireOwnerRequest } from "@/lib/auth/require-permission";
import { appRoles } from "@/lib/auth/permissions";
import { getPrisma, hasDatabaseUrl } from "@/lib/db/prisma";

const schema = z.object({
  userId: z.string().min(1),
  role: z.enum(appRoles),
  shopId: z.string().min(1).optional().nullable(),
  notes: z.string().max(500).optional().nullable(),
});

async function readPayload(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return request.json().catch(() => ({}));
  }

  const form = await request.formData();
  return Object.fromEntries(form.entries());
}

export async function POST(request: Request) {
  const allowed = await requireOwnerRequest(request);
  if (!allowed.ok) {
    return allowed.response;
  }

  const parsed = schema.safeParse(await readPayload(request));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid role assignment.", issues: parsed.error.issues }, { status: 400 });
  }

  if (!hasDatabaseUrl()) {
    return NextResponse.json({ error: "DATABASE_URL is required to assign roles." }, { status: 503 });
  }

  const prisma = getPrisma();
  const existing = await prisma.userAppRole.findFirst({
    where: { userId: parsed.data.userId, role: parsed.data.role, shopId: parsed.data.shopId ?? null },
  });

  const role = existing
    ? await prisma.userAppRole.update({
        where: { id: existing.id },
        data: { revokedAt: null, notes: parsed.data.notes ?? null, assignedBy: allowed.user?.id ?? null },
      })
    : await prisma.userAppRole.create({
        data: {
          userId: parsed.data.userId,
          role: parsed.data.role,
          shopId: parsed.data.shopId ?? null,
          notes: parsed.data.notes ?? null,
          assignedBy: allowed.user?.id ?? null,
        },
      });

  await logRoleAssigned({
    actorId: allowed.user?.id,
    targetUserId: parsed.data.userId,
    targetType: "user",
    targetId: parsed.data.userId,
    metadata: { role: parsed.data.role, shopId: parsed.data.shopId ?? null, roleId: role.id },
  });

  if ((request.headers.get("content-type") ?? "").includes("application/x-www-form-urlencoded") || (request.headers.get("content-type") ?? "").includes("multipart/form-data")) {
    return NextResponse.redirect(new URL("/owner/roles", request.url));
  }

  return NextResponse.json({ ok: true, role });
}
