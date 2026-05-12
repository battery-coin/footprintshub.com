import { NextResponse } from "next/server";
import { getSecureDownloadByToken } from "@/lib/digital/secure-download";

export async function GET(_request: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const result = await getSecureDownloadByToken(token);

  if (!result.ok) {
    return NextResponse.json({ error: result.reason }, { status: result.status });
  }

  return NextResponse.redirect(result.url);
}
