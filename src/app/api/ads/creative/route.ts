import { NextResponse } from "next/server";
import { submitAdCreative } from "@/lib/ads/creative-service";

export async function POST(request: Request) {
  const result = await submitAdCreative(await request.json().catch(() => null));
  if (!result.ok) {
    return NextResponse.json({ error: result.error, details: "details" in result ? result.details : undefined }, { status: result.status });
  }
  return NextResponse.json(result);
}
