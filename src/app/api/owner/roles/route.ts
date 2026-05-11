import { NextResponse } from "next/server";
import { requireOwnerRequest } from "@/lib/auth/require-permission";
import { appRoles } from "@/lib/auth/permissions";
import { getPrisma, hasDatabaseUrl } from "@/lib/db/prisma";

export async function GET(request: Request) {
  const allowed = await requireOwnerRequest(request);
  if (!allowed.ok) {
    return allowed.response;
  }

  if (!hasDatabaseUrl()) {
    return NextResponse.json({ users: [], roles: appRoles, unavailable: true });
  }

  const users = await getPrisma().user.findMany({
    orderBy: [{ updatedAt: "desc" }],
    take: 100,
    select: {
      id: true,
      email: true,
      name: true,
      appRoles: {
        where: { revokedAt: null },
        select: { role: true, shopId: true, assignedAt: true, notes: true },
      },
    },
  });

  return NextResponse.json({ users: users.map((user) => ({ ...user, roles: user.appRoles })), roles: appRoles });
}
