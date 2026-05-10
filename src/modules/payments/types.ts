export type PaymentProviderCode =
  | "stripe_checkout"
  | "manual"
  | "paypal_placeholder"
  | "battery_coin_placeholder";

export type CreatePaymentSessionLineItem = {
  name: string;
  quantity: number;
  unitAmountCents: number;
  currency: string;
};

export type CreatePaymentSessionInput = {
  shopId: string;
  cartId?: string;
  orderId?: string;
  amountCents: number;
  currency: string;
  successUrl: string;
  cancelUrl: string;
  lineItems: CreatePaymentSessionLineItem[];
  metadata?: Record<string, string>;
  idempotencyKey?: string;
};

export type PaymentSessionResult = {
  provider: PaymentProviderCode;
  providerSessionId: string;
  providerPaymentIntentId?: string;
  status: "pending" | "authorized" | "captured" | "failed" | "cancelled" | "refunded";
  redirectUrl?: string;
  metadata?: Record<string, unknown>;
};

export type NormalizedPaymentEvent = {
  provider: PaymentProviderCode;
  eventId: string;
  eventType: string;
  status: PaymentSessionResult["status"];
  orderId?: string;
  cartId?: string;
  shopId?: string;
  providerSessionId?: string;
  providerPaymentIntentId?: string;
  rawType: string;
};

export type PaymentProviderAdapter = {
  code: PaymentProviderCode;
  createSession: (input: CreatePaymentSessionInput) => Promise<PaymentSessionResult>;
  retrieveSession: (providerSessionId: string) => Promise<PaymentSessionResult>;
  capturePayment: (input: { providerPaymentIntentId: string; amountCents?: number }) => Promise<PaymentSessionResult>;
  refundPayment: (input: {
    providerPaymentIntentId: string;
    amountCents?: number;
    reason?: string;
  }) => Promise<PaymentSessionResult>;
  handleWebhook: (rawBody: string | Buffer, signature: string) => NormalizedPaymentEvent;
};
