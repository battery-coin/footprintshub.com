import { NextResponse } from "next/server";
import { requireRequestPermission } from "@/lib/auth/require-permission";
import { getPrisma, hasDatabaseUrl } from "@/lib/db/prisma";

export async function GET(request: Request) {
  const allowed = await requireRequestPermission(request, "canViewAuditLogs");
  if (!allowed.ok) {
    return allowed.response;
  }

  if (!hasDatabaseUrl()) {
    return NextResponse.json({ logs: [], unavailable: true });
  }

  const logs = await getPrisma().auditLog.findMany({ orderBy: { createdAt: "desc" }, take: 100 });
  return NextResponse.json({ logs });
}
