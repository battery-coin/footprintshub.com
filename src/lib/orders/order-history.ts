import type { FulfillmentStatus, OrderStatus, PaymentStatus } from "@prisma/client";

export type OrderHistoryDraft = {
  shopId: string;
  orderId: string;
  actorUserId?: string;
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  fulfillmentStatus?: FulfillmentStatus;
  comment?: string;
  customerVisible?: boolean;
  metadata?: Record<string, unknown>;
};

export function createOrderHistoryDraft(input: OrderHistoryDraft): OrderHistoryDraft {
  return {
    ...input,
    customerVisible: input.customerVisible ?? false,
  };
}

export function publicOrderHistory(history: OrderHistoryDraft[]) {
  return history.filter((entry) => entry.customerVisible);
}
