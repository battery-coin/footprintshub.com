import { getPrisma, hasDatabaseUrl } from "@/lib/db/prisma";

export async function recordAdClick(campaignId: string, targetUrl: string, context?: { visitorId?: string; sessionId?: string; userAgent?: string; referrer?: string }) {
  if (!hasDatabaseUrl()) return { stored: false as const };

  const prisma = getPrisma();
  const campaign = await prisma.adCampaign.findUnique({ where: { id: campaignId } });
  if (!campaign) return { stored: false as const };

  await prisma.adClick.create({
    data: {
      shopId: campaign.shopId,
      adCampaignId: campaign.id,
      adPlacementId: campaign.adPlacementId,
      visitorId: context?.visitorId,
      sessionId: context?.sessionId,
      userAgent: context?.userAgent,
      referrer: context?.referrer,
      targetUrl,
    },
  });

  const day = new Date();
  day.setUTCHours(0, 0, 0, 0);
  await prisma.adMetric.upsert({
    where: { adCampaignId_date: { adCampaignId: campaign.id, date: day } },
    update: { clicks: { increment: 1 } },
    create: { shopId: campaign.shopId, adCampaignId: campaign.id, adPlacementId: campaign.adPlacementId, date: day, clicks: 1 },
  });

  return { stored: true as const };
}
