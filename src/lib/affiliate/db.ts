import { hasDatabaseUrl, getPrisma } from "@/lib/db/prisma";
import { SESSION_COOKIE, VISITOR_COOKIE } from "./attribution";
import { detectDevice, hashIpAddress } from "./fraud";

export async function getAffiliateRequestContext(request: Request) {
  const cookieHeader = request.headers.get("cookie") ?? "";
  const cookies = Object.fromEntries(
    cookieHeader
      .split(";")
      .map((cookie) => cookie.trim().split("="))
      .filter((cookie): cookie is [string, string] => cookie.length === 2)
      .map(([key, value]) => [key, decodeURIComponent(value)]),
  );
  const userAgent = request.headers.get("user-agent");

  return {
    sessionId: cookies[SESSION_COOKIE] ?? crypto.randomUUID(),
    visitorId: cookies[VISITOR_COOKIE] ?? crypto.randomUUID(),
    userAgent,
    referrer: request.headers.get("referer"),
    ipHash: hashIpAddress(request.headers.get("x-forwarded-for")?.split(",")[0] ?? null),
    landingUrl: request.url,
    device: detectDevice(userAgent),
  };
}

export async function recordAffiliateClick({
  referralCode,
  request,
  productId,
  campaignId,
}: {
  referralCode: string;
  request: Request;
  productId?: string;
  campaignId?: string;
}) {
  const context = await getAffiliateRequestContext(request);

  if (!hasDatabaseUrl()) {
    return { stored: false, reason: "DATABASE_URL is not configured.", ...context };
  }

  const prisma = getPrisma();
  const affiliate = await prisma.affiliate.findFirst({
    where: {
      referralCode,
      status: "approved",
      shop: { status: "active" },
    },
    include: {
      shop: true,
    },
  });

  if (!affiliate) {
    return { stored: false, reason: "Referral code not found.", ...context };
  }

  const program = await prisma.affiliateProgram.findFirst({
    where: {
      shopId: affiliate.shopId,
      status: "active",
    },
  });

  const expiresAt = new Date(Date.now() + (program?.cookieDays ?? 30) * 24 * 60 * 60 * 1000);

  await prisma.$transaction(async (tx) => {
    await tx.affiliateClick.create({
      data: {
        shopId: affiliate.shopId,
        affiliateId: affiliate.id,
        referralCode,
        landingUrl: context.landingUrl,
        productId,
        campaignId,
        sessionId: context.sessionId,
        visitorId: context.visitorId,
        ipHash: context.ipHash,
        userAgent: context.userAgent,
        device: context.device,
        referrer: context.referrer,
      },
    });

    const existingFirstTouch =
      program?.attributionModel === "first_touch"
        ? await tx.affiliateAttribution.findFirst({
            where: {
              shopId: affiliate.shopId,
              visitorId: context.visitorId,
              attributionType: "first_touch",
              expiresAt: { gt: new Date() },
            },
          })
        : null;

    if (existingFirstTouch) {
      return;
    }

    await tx.affiliateAttribution.create({
      data: {
        shopId: affiliate.shopId,
        affiliateId: affiliate.id,
        sessionId: context.sessionId,
        visitorId: context.visitorId,
        attributionType: program?.attributionModel === "first_touch" ? "first_touch" : "last_touch",
        referralCode,
        expiresAt,
      },
    });
  });

  return { stored: true, affiliateId: affiliate.id, shopId: affiliate.shopId, expiresAt, ...context };
}
