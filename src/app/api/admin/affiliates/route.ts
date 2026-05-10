import { NextResponse } from "next/server";
import { getAdminSecretFromRequest, isAdminSecretValid } from "@/lib/admin/auth";
import { hasDatabaseUrl, getPrisma } from "@/lib/db/prisma";

export async function GET(request: Request) {
  if (!isAdminSecretValid(getAdminSecretFromRequest(request))) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  if (!hasDatabaseUrl()) {
    return NextResponse.json({
      affiliates: [],
      stored: false,
      message: "Configure DATABASE_URL to read affiliate applications and commission records.",
    });
  }

  const affiliates = await getPrisma().affiliate.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return NextResponse.json({ affiliates, stored: true });
}

