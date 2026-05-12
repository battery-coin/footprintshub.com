import { getPrisma, hasDatabaseUrl } from "@/lib/db/prisma";

export async function listCustomerDownloadEntitlements(customerId: string) {
  if (!hasDatabaseUrl()) return [];

  return getPrisma().downloadEntitlement.findMany({
    where: { customerId },
    include: { downloadAsset: true, order: true },
    orderBy: { createdAt: "desc" },
  });
}
