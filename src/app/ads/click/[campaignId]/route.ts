import { NextResponse } from "next/server";
import { recordAdClick } from "@/lib/ads/ad-metrics";
import { validateSafeAdTargetUrl } from "@/lib/ads/creative-validation";

export async function GET(request: Request, { params }: { params: Promise<{ campaignId: string }> }) {
  const { campaignId } = await params;
  const url = new URL(request.url);
  const targetUrl = url.searchParams.get("to") ?? "/ads";

  if (!validateSafeAdTargetUrl(targetUrl)) {
    return NextResponse.redirect(new URL("/ads", request.url));
  }

  await recordAdClick(campaignId, targetUrl, {
    userAgent: request.headers.get("user-agent") ?? undefined,
    referrer: request.headers.get("referer") ?? undefined,
  });

  return NextResponse.redirect(targetUrl);
}
