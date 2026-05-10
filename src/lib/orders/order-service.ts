import type { Prisma } from "@prisma/client";
import { getPrisma, hasDatabaseUrl } from "@/lib/db/prisma";
import type { PricedCartLine } from "@/lib/catalog/types";
import type { CartTotals } from "@/lib/cart/cart-totals";

export async function createPendingOrder({
  shopId,
  lines,
  totals,
  metadata,
}: {
  shopId: string;
  lines: PricedCartLine[];
  totals: CartTotals;
  metadata?: Prisma.InputJsonValue;
}) {
  if (!hasDatabaseUrl()) {
    return null;
  }

  return getPrisma().order.create({
    data: {
      shopId,
      orderNumber: makeOrderNumber(),
      status: "awaiting_payment",
      paymentStatus: "unpaid",
      fulfillmentStatus: totals.requiresShipping ? "unfulfilled" : "not_required",
      subtotalCents: totals.subtotalCents,
      discountCents: totals.discountCents,
      taxCents: totals.taxCents,
      shippingCents: totals.shippingCents,
      totalCents: totals.totalCents,
      currency: totals.currency,
      metadata,
      items: {
        create: lines.map((line) => ({
          productId: line.product.id,
          titleSnapshot: line.product.title,
          skuSnapshot: line.product.sku,
          quantity: line.quantity,
          unitPriceCents: line.unitPriceCents,
          totalCents: line.totalCents,
          metadata: line.product.metadata as Prisma.InputJsonValue | undefined,
        })),
      },
    },
    select: {
      id: true,
      orderNumber: true,
    },
  });
}

export function makeOrderNumber() {
  return `FH-${Date.now().toString(36).toUpperCase()}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
}
