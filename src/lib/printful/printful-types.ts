export type PrintfulRecipient = {
  name: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state_code?: string;
  country_code: string;
  zip: string;
  phone?: string;
  email?: string;
};

export type PrintfulOrderItem = {
  external_id?: string;
  name?: string;
  quantity: number;
  retail_price?: string;
  variant_id?: number;
  sync_variant_id?: number;
};

export type PrintfulOrderPayload = {
  external_id: string;
  shipping?: string;
  recipient: PrintfulRecipient;
  items: PrintfulOrderItem[];
};

export type PrintfulApiEnvelope<T> = {
  code?: number;
  result?: T;
  error?: {
    reason?: string;
    message?: string;
  };
};

export type PrintfulOrderResponse = {
  id?: number;
  external_id?: string;
  status?: string;
  shipping?: string;
  recipient?: PrintfulRecipient;
  items?: Array<Record<string, unknown>>;
  shipments?: Array<Record<string, unknown>>;
};

export type PrintfulShippingRate = {
  id: string;
  name: string;
  rate: string;
  currency: string;
  minDeliveryDays?: number;
  maxDeliveryDays?: number;
};

export type PrintfulWebhookPayload = {
  type?: string;
  created?: number;
  retries?: number;
  store?: number;
  data?: Record<string, unknown>;
};
