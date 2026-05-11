import { NextResponse } from "next/server";
import { getAdminSecretFromRequest, isAdminSecretValid } from "@/lib/admin/auth";
import { getPrisma, hasDatabaseUrl } from "@/lib/db/prisma";

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  },
) {
  if (!isAdminSecretValid(getAdminSecretFromRequest(request))) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await params;

  if (!hasDatabaseUrl()) {
    return NextResponse.json({ job: null, rows: [] });
  }

  const job = await getPrisma().importJob.findUnique({
    where: { id },
    include: { rows: { orderBy: { rowNumber: "asc" } } },
  });

  if (!job) {
    return NextResponse.json({ error: "Import job not found." }, { status: 404 });
  }

  return NextResponse.json({ job });
}
