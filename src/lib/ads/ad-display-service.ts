import { getPrisma, hasDatabaseUrl } from "@/lib/db/prisma";

export async function getLiveAdsForPlacement(placementKey: string, maxItems = 1) {
  if (!hasDatabaseUrl()) return [];

  const now = new Date();
  return getPrisma().adCampaign.findMany({
    where: {
      status: { in: ["approved", "scheduled", "live"] },
      AND: [
        { OR: [{ startAt: null }, { startAt: { lte: now } }] },
        { OR: [{ endAt: null }, { endAt: { gte: now } }] },
        {
          OR: [
            { adPlacement: { locationKey: placementKey } },
            { product: { metadata: { path: ["placementKey"], equals: placementKey } } },
          ],
        },
      ],
    },
    include: { creatives: { where: { status: "approved" }, orderBy: { createdAt: "desc" }, take: 1 }, adPlacement: true },
    take: maxItems,
    orderBy: { updatedAt: "desc" },
  });
}
