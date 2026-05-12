import type { Order, OrderItem, Prisma } from "@prisma/client";
import { getPrisma, hasDatabaseUrl } from "@/lib/db/prisma";
import { adProductTypes } from "./ad-products";

export async function createAdCampaignsFromOrder(order: Order & { items: OrderItem[] }) {
  if (!hasDatabaseUrl()) {
    return [];
  }

  const prisma = getPrisma();
  const created: string[] = [];

  for (const item of order.items) {
    const productType = item.productTypeSnapshot ?? "physical";
    if (!adProductTypes.has(productType)) continue;

    const existing = await prisma.adCampaign.findFirst({ where: { orderItemId: item.id } });
    if (existing) {
      created.push(existing.id);
      continue;
    }

    const itemMetadata = normalizeMetadata(item.metadata);
    const product = await prisma.product.findUnique({ where: { id: item.productId }, include: { adProductConfig: true } });
    const durationDays =
      product?.adProductConfig?.durationDays ??
      (typeof itemMetadata.durationDays === "number" ? Math.max(1, Math.floor(itemMetadata.durationDays)) : 30);
    const startsAfterReview = itemMetadata.startAt ? new Date(String(itemMetadata.startAt)) : null;
    const startAt = startsAfterReview && !Number.isNaN(startsAfterReview.getTime()) ? startsAfterReview : null;
    const endAt = startAt ? new Date(startAt.getTime() + durationDays * 24 * 60 * 60 * 1000) : null;

    const campaign = await prisma.adCampaign.create({
      data: {
        shopId: order.shopId,
        advertiserCustomerId: order.customerId,
        advertiserEmail: order.customerEmail ?? "advertiser-email-required@example.invalid",
        advertiserName: typeof itemMetadata.advertiserName === "string" ? itemMetadata.advertiserName : null,
        orderId: order.id,
        orderItemId: item.id,
        productId: item.productId,
        adPlacementId: product?.adProductConfig?.adPlacementId ?? null,
        title: item.titleSnapshot,
        status: product?.adProductConfig?.requiresCreativeUpload === false ? "pending_review" : "pending_creative",
        targetUrl: typeof itemMetadata.targetUrl === "string" ? itemMetadata.targetUrl : null,
        startAt,
        endAt,
        customerNotes: typeof itemMetadata.advertiserNotes === "string" ? itemMetadata.advertiserNotes : null,
      },
    });

    await prisma.orderItem.update({
      where: { id: item.id },
      data: { adCampaignId: campaign.id },
    });

    created.push(campaign.id);
  }

  return created;
}

function normalizeMetadata(value: Prisma.JsonValue | null | undefined): Record<string, unknown> {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return {};
}
