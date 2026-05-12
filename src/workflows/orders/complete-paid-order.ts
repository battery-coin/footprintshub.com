import type { Prisma } from "@prisma/client";
import { calculateCommissionsForOrder } from "@/lib/affiliate/order-commission";
import { createAdCampaignsFromOrder } from "@/lib/ads/ad-order-service";
import { getPrisma, hasDatabaseUrl } from "@/lib/db/prisma";
import { deductInventoryForPaidOrder } from "@/lib/inventory/inventory-service";
import { submitPrintfulOrderForPaidOrder } from "@/workflows/fulfillment/submit-printful-order";

const digitalTypes = new Set(["digital", "digital_download"]);
const serviceTypes = new Set(["service", "appointment", "event_access"]);
const subscriptionTypes = new Set(["subscription", "membership"]);
const nftTypes = new Set(["nft", "nft_linked_physical"]);

export async function completePaidOrder(orderId: string) {
  if (!hasDatabaseUrl()) {
    return { completed: false, reason: "DATABASE_URL is not configured." };
  }

  const prisma = getPrisma();
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });

  if (!order) {
    return { completed: false, reason: "Order not found." };
  }

  const metadata = normalizeMetadata(order.metadata);
  if (metadata.productTypeCompletionAt) {
    return { completed: true, skipped: true };
  }

  await prisma.$transaction(async (tx) => {
    for (const item of order.items) {
      const productType = item.productTypeSnapshot ?? "physical";
      const itemMetadata = normalizeMetadata(item.metadata);

      if ((digitalTypes.has(productType) || item.fulfillmentTypeSnapshot === "digital_download") && item.digitalAssetId) {
        const asset = await tx.downloadAsset.findUnique({ where: { id: item.digitalAssetId } });
        if (asset) {
          const existing = await tx.downloadEntitlement.findFirst({ where: { orderItemId: item.id, downloadAssetId: asset.id } });
          if (!existing) {
            await tx.downloadEntitlement.create({
              data: {
                shopId: order.shopId,
                customerId: order.customerId,
                orderId: order.id,
                orderItemId: item.id,
                downloadAssetId: asset.id,
                remainingDownloads: asset.maxDownloads,
                expiresAt: asset.expiresAfterDays ? new Date(Date.now() + asset.expiresAfterDays * 24 * 60 * 60 * 1000) : null,
              },
            });
          }
        }
      }

      if (serviceTypes.has(productType) || item.fulfillmentTypeSnapshot === "service_delivery") {
        await tx.serviceOrder.upsert({
          where: { orderItemId: item.id },
          update: {},
          create: {
            shopId: order.shopId,
            orderId: order.id,
            orderItemId: item.id,
            productId: item.productId,
            customerId: order.customerId,
            status: itemMetadata.requiresCustomerBrief ? "pending_brief" : "scheduled",
            customerBrief: typeof itemMetadata.customerBrief === "string" ? itemMetadata.customerBrief : null,
          },
        });
      }

      if (subscriptionTypes.has(productType) || item.paymentModeSnapshot === "recurring") {
        const existingPlan = item.subscriptionPlanId
          ? await tx.subscriptionPlan.findUnique({ where: { id: item.subscriptionPlanId } })
          : null;
        const plan =
          existingPlan ??
          (await tx.subscriptionPlan.create({
            data: {
              shopId: order.shopId,
              productId: item.productId,
              variantId: item.variantId,
              name: item.titleSnapshot,
              description: "Auto-created from a paid recurring checkout.",
              interval:
                typeof itemMetadata.recurringInterval === "string" && ["day", "week", "month", "year"].includes(itemMetadata.recurringInterval)
                  ? (itemMetadata.recurringInterval as "day" | "week" | "month" | "year")
                  : "month",
              intervalCount: typeof itemMetadata.recurringIntervalCount === "number" ? Math.max(1, Math.floor(itemMetadata.recurringIntervalCount)) : 1,
              trialPeriodDays: typeof itemMetadata.trialPeriodDays === "number" ? Math.max(0, Math.floor(itemMetadata.trialPeriodDays)) : null,
              amountCents: item.unitPriceCents,
              currency: order.currency,
              accessType: productType === "membership" ? "membership" : "digital_access",
            },
          }));
        const existingSubscription = await tx.customerSubscription.findFirst({ where: { orderId: order.id, productId: item.productId } });
        const subscription =
          existingSubscription ??
          (await tx.customerSubscription.create({
            data: {
              shopId: order.shopId,
              customerId: order.customerId,
              orderId: order.id,
              productId: item.productId,
              variantId: item.variantId,
              subscriptionPlanId: plan.id,
              status: "active",
              currentPeriodStart: new Date(),
              currentPeriodEnd: itemMetadata.accessDurationDays
                ? new Date(Date.now() + Number(itemMetadata.accessDurationDays) * 24 * 60 * 60 * 1000)
                : null,
              metadata: itemMetadata as Prisma.InputJsonObject,
            },
          }));

        const existingEntitlement = await tx.subscriptionEntitlement.findFirst({ where: { orderItemId: item.id } });
        if (!existingEntitlement) {
          await tx.subscriptionEntitlement.create({
            data: {
              shopId: order.shopId,
              customerId: order.customerId,
              customerSubscriptionId: subscription.id,
              orderItemId: item.id,
              entitlementType: "membership_access",
              startsAt: new Date(),
              endsAt: subscription.currentPeriodEnd,
              metadata: itemMetadata as Prisma.InputJsonObject,
            },
          });
        }
      }

      if (nftTypes.has(productType) || item.fulfillmentTypeSnapshot === "nft_delivery") {
        const nftProduct = item.nftProductId ? await tx.nFTProduct.findUnique({ where: { id: item.nftProductId } }) : null;
        if (nftProduct) {
          await tx.nFTEntitlement.upsert({
            where: { orderItemId: item.id },
            update: {},
            create: {
              shopId: order.shopId,
              customerId: order.customerId,
              orderId: order.id,
              orderItemId: item.id,
              productId: item.productId,
              nftProductId: nftProduct.id,
              walletAddress: typeof itemMetadata.walletAddress === "string" ? itemMetadata.walletAddress : null,
              claimCode: typeof itemMetadata.claimCode === "string" ? itemMetadata.claimCode : null,
              claimUrl: typeof itemMetadata.claimUrl === "string" ? itemMetadata.claimUrl : null,
              chain: nftProduct.chain,
              tokenId: nftProduct.tokenId,
              status: nftProduct.claimRequired ? "pending_claim" : "manual",
            },
          });
        }
      }
    }

    await tx.order.update({
      where: { id: order.id },
      data: {
        metadata: {
          ...metadata,
          productTypeCompletionAt: new Date().toISOString(),
        },
      },
    });
  });

  await createAdCampaignsFromOrder(order);
  await submitPrintfulOrderForPaidOrder(orderId);
  await deductInventoryForPaidOrder(orderId);
  await calculateCommissionsForOrder(orderId);

  return { completed: true };
}

function normalizeMetadata(value: Prisma.JsonValue | null | undefined): Record<string, unknown> {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return {};
}
