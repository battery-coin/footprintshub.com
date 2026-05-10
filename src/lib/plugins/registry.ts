import { z } from "zod";
import type { CommercePlugin } from "./types";

export const commercePlugins: CommercePlugin[] = [
  {
    id: "stripe-checkout",
    name: "Stripe Checkout",
    type: "paymentProvider",
    enabled: true,
    shopScope: "both",
    configSchema: z.object({
      publishableKeyConfigured: z.boolean(),
      webhookSecretConfigured: z.boolean(),
    }),
    handlers: {},
  },
  {
    id: "flat-rate-shipping",
    name: "Flat Rate Shipping",
    type: "shippingProvider",
    enabled: true,
    shopScope: "shop",
    configSchema: z.object({
      priceCents: z.number().int().nonnegative(),
      freeShippingThresholdCents: z.number().int().nonnegative().optional(),
    }),
    handlers: {},
  },
];

export function getEnabledPlugins(type?: CommercePlugin["type"]) {
  return commercePlugins.filter((plugin) => plugin.enabled && (!type || plugin.type === type));
}
