export type CommerceEventType =
  | "cart.created"
  | "cart.updated"
  | "checkout.session_created"
  | "payment.authorized"
  | "payment.captured"
  | "order.created"
  | "order.paid"
  | "order.cancelled"
  | "order.refunded"
  | "fulfillment.created"
  | "fulfillment.shipped"
  | "customer.created"
  | "affiliate.commission_created"
  | "digital_unlock.granted"
  | "inventory.reserved"
  | "inventory.deducted"
  | "inventory.released";

export type CommerceEventEnvelope<TPayload extends Record<string, unknown> = Record<string, unknown>> = {
  id?: string;
  shopId?: string;
  type: CommerceEventType;
  aggregateType: string;
  aggregateId: string;
  payload: TPayload;
  idempotencyKey?: string;
  createdAt: Date;
};

export type CommerceEventSubscriber<TPayload extends Record<string, unknown> = Record<string, unknown>> = (
  event: CommerceEventEnvelope<TPayload>,
) => Promise<void> | void;

const subscribers = new Map<CommerceEventType, CommerceEventSubscriber[]>();

export function createCommerceEvent<TPayload extends Record<string, unknown>>(
  event: Omit<CommerceEventEnvelope<TPayload>, "createdAt">,
): CommerceEventEnvelope<TPayload> {
  return {
    ...event,
    createdAt: new Date(),
  };
}

export function subscribeToCommerceEvent(type: CommerceEventType, subscriber: CommerceEventSubscriber) {
  const existing = subscribers.get(type) ?? [];
  subscribers.set(type, [...existing, subscriber]);

  return () => {
    subscribers.set(
      type,
      (subscribers.get(type) ?? []).filter((entry) => entry !== subscriber),
    );
  };
}

export async function publishCommerceEvent(event: CommerceEventEnvelope) {
  const handlers = subscribers.get(event.type) ?? [];

  for (const handler of handlers) {
    await handler(event);
  }
}

export function clearCommerceEventSubscribers() {
  subscribers.clear();
}
