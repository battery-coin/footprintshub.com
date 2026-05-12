import type { Prisma } from "@prisma/client";
import { RefundError } from "./refund-errors";
import type { CreateRefundInput } from "./refund-validation";

export type RefundableOrder = Prisma.OrderGetPayload<{
  include: {
    items: true;
    refunds: { where: { status: { in: ["requested", "approved", "processing", "succeeded", "partially_succeeded"] } } };
  };
}>;

export type RefundCalculation = {
  amountCents: number;
  refundableAmountCents: number;
  type: "full" | "partial" | "manual" | "store_credit" | "chargeback_adjustment";
  items: Array<{
    orderItemId: string;
    quantity: number;
    amountCents: number;
    restock: boolean;
    reason?: string;
  }>;
};

export function calculateRefundableAmount(order: RefundableOrder) {
  const alreadyRefunded = order.refunds.reduce((total, refund) => total + refund.amountCents, 0);
  return Math.max(0, order.totalCents - alreadyRefunded);
}

export function calculateRefund(order: RefundableOrder, input: CreateRefundInput): RefundCalculation {
  const refundableAmountCents = calculateRefundableAmount(order);
  if (refundableAmountCents <= 0) {
    throw new RefundError("This order has no remaining refundable amount.");
  }
  if (order.paymentStatus !== "paid" && order.paymentStatus !== "partially_refunded") {
    throw new RefundError("Only paid or partially refunded orders can be refunded.");
  }

  if (input.type === "full") {
    return {
      amountCents: refundableAmountCents,
      refundableAmountCents,
      type: input.type,
      items: order.items
        .filter((item) => item.quantity - item.refundedQuantity > 0)
        .map((item) => ({
          orderItemId: item.id,
          quantity: item.quantity - item.refundedQuantity,
          amountCents: Math.max(0, item.totalCents - item.refundedAmountCents),
          restock: input.restock,
          reason: input.reason,
        })),
    };
  }

  const items = input.items?.length
    ? input.items.map((requested) => {
        const orderItem = order.items.find((item) => item.id === requested.orderItemId);
        if (!orderItem) throw new RefundError("Refund item does not belong to this order.");
        const remainingQuantity = orderItem.quantity - orderItem.refundedQuantity;
        if (requested.quantity > remainingQuantity) {
          throw new RefundError(`Refund quantity exceeds refundable quantity for ${orderItem.titleSnapshot}.`);
        }
        const remainingCents = Math.max(0, orderItem.totalCents - orderItem.refundedAmountCents);
        const amountCents = Math.floor((remainingCents * requested.quantity) / Math.max(1, remainingQuantity));
        return {
          orderItemId: orderItem.id,
          quantity: requested.quantity,
          amountCents,
          restock: requested.restock ?? input.restock,
          reason: requested.reason ?? input.reason,
        };
      })
    : [];

  const itemTotal = items.reduce((total, item) => total + item.amountCents, 0);
  const amountCents = input.amountCents ?? itemTotal;

  if (amountCents <= 0) {
    throw new RefundError("Refund amount must be greater than zero.");
  }
  if (amountCents > refundableAmountCents) {
    throw new RefundError("Refund amount exceeds the remaining refundable amount.");
  }

  return {
    amountCents,
    refundableAmountCents,
    type: input.type,
    items,
  };
}
