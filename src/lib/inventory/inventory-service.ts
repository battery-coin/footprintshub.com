import type { PricedCartLine } from "@/lib/catalog/types";
import { getPrisma, hasDatabaseUrl } from "@/lib/db/prisma";

export type InventoryValidationResult = {
  ok: boolean;
  errors: string[];
};

export function validateInventoryForCart(lines: PricedCartLine[]): InventoryValidationResult {
  const errors = lines.flatMap((line) => {
    if (!line.product.trackInventory) {
      return [];
    }

    if (line.product.allowBackorder) {
      return [];
    }

    if (line.quantity > line.product.inventoryQuantity) {
      return [`${line.product.title} does not have enough inventory for quantity ${line.quantity}.`];
    }

    return [];
  });

  return {
    ok: errors.length === 0,
    errors,
  };
}

export function createInventoryDeductionDrafts(lines: PricedCartLine[], orderId: string) {
  return lines
    .filter((line) => line.product.trackInventory)
    .map((line) => ({
      shopId: line.product.shopId,
      productId: line.product.id,
      orderId,
      type: "deduction" as const,
      quantityDelta: -line.quantity,
      reason: "Paid order inventory deduction.",
      idempotencyKey: `inventory:deduct:${orderId}:${line.product.id}`,
    }));
}

export async function deductInventoryForPaidOrder(orderId: string) {
  if (!hasDatabaseUrl()) {
    return { deducted: false, reason: "DATABASE_URL is not configured." };
  }

  const prisma = getPrisma();
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!order) {
    return { deducted: false, reason: "Order not found." };
  }

  await prisma.$transaction(async (tx) => {
    for (const item of order.items) {
      if (!item.product.trackInventory) {
        continue;
      }

      const idempotencyKey = `inventory:deduct:${order.id}:${item.id}`;
      const existing = await tx.inventoryLedger.findUnique({ where: { idempotencyKey } });

      if (existing) {
        continue;
      }

      await tx.inventoryLedger.create({
        data: {
          shopId: order.shopId,
          productId: item.productId,
          variantId: item.variantId,
          orderId: order.id,
          orderItemId: item.id,
          type: "deduction",
          quantityDelta: -item.quantity,
          reason: "Paid order inventory deduction.",
          idempotencyKey,
        },
      });

      await tx.product.update({
        where: { id: item.productId },
        data: {
          inventoryQuantity: {
            decrement: item.quantity,
          },
        },
      });
    }
  });

  return { deducted: true };
}
