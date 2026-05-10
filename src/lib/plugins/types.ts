import type { z } from "zod";

export type CommercePluginType =
  | "paymentProvider"
  | "shippingProvider"
  | "taxProvider"
  | "discountProvider"
  | "fulfillmentProvider"
  | "digitalUnlockProvider"
  | "affiliateProvider"
  | "notificationProvider"
  | "analyticsProvider";

export type CommercePlugin<TConfig extends z.ZodType = z.ZodType> = {
  id: string;
  name: string;
  type: CommercePluginType;
  enabled: boolean;
  shopScope: "platform" | "shop" | "both";
  configSchema: TConfig;
  handlers: Record<string, unknown>;
};
