import { z } from "zod";
import type { PricedCartLine } from "@/lib/catalog/types";

export const checkoutAddressSchema = z.object({
  name: z.string().min(1),
  line1: z.string().min(1),
  line2: z.string().optional(),
  city: z.string().min(1),
  region: z.string().optional(),
  postalCode: z.string().min(1),
  country: z.string().length(2),
  phone: z.string().optional(),
});

export const checkoutIntentSchema = z.object({
  cartId: z.string().min(1),
  customerEmail: z.email(),
  shippingAddress: checkoutAddressSchema.optional(),
  billingAddress: checkoutAddressSchema.optional(),
  sameAsShipping: z.boolean().default(true),
  shippingMethodCode: z.string().optional(),
  orderComment: z.string().max(1000).optional(),
  termsAccepted: z.boolean(),
  newsletterOptIn: z.boolean().default(false),
  preorderAcknowledged: z.boolean().default(false),
  randomizedOddsAcknowledged: z.boolean().default(false),
});

export type CheckoutIntentInput = z.infer<typeof checkoutIntentSchema>;

export function validateCheckoutReadiness({
  input,
  lines,
}: {
  input: CheckoutIntentInput;
  lines: PricedCartLine[];
}) {
  const errors: string[] = [];
  const requiresShipping = lines.some((line) => line.product.requiresShipping !== false);
  const hasPreorder = lines.some((line) => Boolean(line.product.preorderStatus));
  const hasRandomized = lines.some((line) => Boolean(line.product.isRandomized));

  if (!input.termsAccepted) {
    errors.push("Terms must be accepted before checkout.");
  }

  if (requiresShipping && !input.shippingAddress) {
    errors.push("Shipping address is required for physical products.");
  }

  if (requiresShipping && !input.shippingMethodCode) {
    errors.push("Shipping method is required for physical products.");
  }

  if (hasPreorder && !input.preorderAcknowledged) {
    errors.push("Preorder acknowledgement is required for preorder items.");
  }

  if (hasRandomized && !input.randomizedOddsAcknowledged) {
    errors.push("Blind box or booster pack odds acknowledgement is required for randomized items.");
  }

  return {
    ok: errors.length === 0,
    errors,
    requiresShipping,
    hasPreorder,
    hasRandomized,
  };
}
