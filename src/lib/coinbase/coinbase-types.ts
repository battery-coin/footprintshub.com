export type CoinbaseCheckoutStatus =
  | "ACTIVE"
  | "PROCESSING"
  | "DEACTIVATED"
  | "EXPIRED"
  | "COMPLETED"
  | "FAILED"
  | "REFUNDED"
  | "PARTIALLY_REFUNDED";

export type CoinbaseCheckoutCreateInput = {
  amount: string;
  currency: string;
  description?: string;
  metadata?: Record<string, string>;
  successRedirectUrl?: string;
  failRedirectUrl?: string;
  expiresAt?: string;
};

export type CoinbaseCheckoutCreateResponse = {
  id: string;
  url: string;
  amount: string;
  currency: string;
  network?: string;
  address?: string;
  status: CoinbaseCheckoutStatus;
  tokenAddress?: string;
  description?: string;
  expiresAt?: string;
  metadata?: Record<string, string>;
  fiatAmount?: string;
  fiatCurrency?: string;
  transactionHash?: string;
};

export type CoinbaseWebhookEvent = {
  id?: string;
  type?: string;
  eventType?: string;
  data?: CoinbaseCheckoutCreateResponse & {
    checkoutId?: string;
    id?: string;
  };
  metadata?: Record<string, string>;
};

export type CoinbasePaymentStatus = "pending" | "paid" | "expired" | "cancelled" | "failed" | "refunded" | "partially_refunded";

export type CoinbaseErrorResponse = {
  error?: string;
  message?: string;
  details?: unknown;
};
