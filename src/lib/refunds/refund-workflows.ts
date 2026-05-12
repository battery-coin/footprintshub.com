import type { Prisma } from "@prisma/client";
import { reverseCommissionsForRefund } from "@/lib/affiliate/refund-reversal";

export async function applyRefundSideEffects(tx: Prisma.TransactionClient, refundId: string) {
  const refund = await tx.refund.findUnique({
    where: { id: refundId },
    include: {
      order: { include: { items: { include: { product: true } }, printfulOrders: true } },
      items: true,
    },
  });
  if (!refund) return;

  for (const refundItem of refund.items) {
    const orderItem = refund.order.items.find((item) => item.id === refundItem.orderItemId);
    if (!orderItem) continue;
    const refundedQuantity = Math.min(orderItem.quantity, orderItem.refundedQuantity + refundItem.quantity);
    const refundedAmountCents = Math.min(orderItem.totalCents, orderItem.refundedAmountCents + refundItem.amountCents);

    await tx.orderItem.update({
      where: { id: orderItem.id },
      data: {
        refundedQuantity,
        refundedAmountCents,
        refundStatus: refundedQuantity >= orderItem.quantity ? "refunded" : "partially_refunded",
      },
    });

    if (refundItem.restock && orderItem.product.trackInventory) {
      const idempotencyKey = `inventory:refund-restock:${refund.id}:${orderItem.id}`;
      const existing = await tx.inventoryLedger.findUnique({ where: { idempotencyKey } });
      if (!existing) {
        await tx.inventoryLedger.create({
          data: {
            shopId: refund.shopId,
            productId: orderItem.productId,
            variantId: orderItem.variantId,
            orderId: refund.orderId,
            orderItemId: orderItem.id,
            type: "refund_restock",
            quantityDelta: refundItem.quantity,
            reason: `Restocked from refund ${refund.id}.`,
            idempotencyKey,
          },
        });
        await tx.product.update({
          where: { id: orderItem.productId },
          data: { inventoryQuantity: { increment: refundItem.quantity } },
        });
      }
    }
  }

  const totalRefunded = await tx.refund.aggregate({
    where: { orderId: refund.orderId, status: { in: ["succeeded", "partially_succeeded"] } },
    _sum: { amountCents: true },
  });
  const refundedAmountCents = Math.min(refund.order.totalCents, totalRefunded._sum.amountCents ?? refund.amountCents);
  const fullyRefunded = refundedAmountCents >= refund.order.totalCents;

  await tx.order.update({
    where: { id: refund.orderId },
    data: {
      status: fullyRefunded ? "refunded" : "partially_refunded",
      paymentStatus: fullyRefunded ? "refunded" : "partially_refunded",
      refundStatus: fullyRefunded ? "refunded" : "partially_refunded",
      refundedAmountCents,
      refundableAmountCents: Math.max(0, refund.order.totalCents - refundedAmountCents),
      refundedAt: fullyRefunded ? new Date() : undefined,
      metadata: {
        ...toRecord(refund.order.metadata),
        ...(refund.order.printfulOrders.some((printfulOrder) => ["submitted", "accepted", "inprocess", "fulfilled", "shipped", "delivered"].includes(printfulOrder.status))
          ? { printfulRefundReviewRequired: true }
          : {}),
      },
    },
  });

  await reverseCommissionsForRefund(tx, refund.id);
}

export async function markDigitalUnlocksForRefundReview(tx: Prisma.TransactionClient, refundId: string) {
  const refund = await tx.refund.findUnique({ where: { id: refundId }, include: { items: true } });
  if (!refund) return;
  const orderItemIds = refund.items.map((item) => item.orderItemId);
  await tx.downloadEntitlement.updateMany({
    where: { orderId: refund.orderId, orderItemId: { in: orderItemIds } },
    data: {
      metadata: {
        refundReviewRequired: true,
        refundId,
        policy: "manual_review",
      },
    },
  });
}

function toRecord(value: Prisma.JsonValue | null | undefined): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}
