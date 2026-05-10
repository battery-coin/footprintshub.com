import type { PricedCartLine } from "@/lib/catalog/types";
import type { DiscountForTotals } from "@/lib/discounts/discount-service";
import type { ShippingEstimateInput } from "@/lib/shipping/shipping-service";
import type { TaxEstimateInput } from "@/lib/tax/tax-service";
import { calculateTotalsPipeline } from "@/lib/totals/totals-pipeline";

export type CartTotalsInput = {
  lines: PricedCartLine[];
  discount?: DiscountForTotals;
  shipping?: ShippingEstimateInput;
  tax?: TaxEstimateInput;
};

export type CartTotals = {
  subtotalCents: number;
  discountCents: number;
  taxCents: number;
  shippingCents: number;
  totalCents: number;
  currency: string;
  requiresShipping: boolean;
  appliedDiscountCode?: string;
  discountMessage?: string;
};

export function calculateCartTotals({ lines, discount, shipping, tax }: CartTotalsInput): CartTotals {
  const totals = calculateTotalsPipeline({ lines, discount, shipping, tax });

  return {
    subtotalCents: totals.subtotalCents,
    discountCents: totals.discountCents,
    taxCents: totals.taxCents,
    shippingCents: totals.shippingCents,
    totalCents: totals.totalCents,
    currency: totals.currency,
    requiresShipping: totals.requiresShipping,
    appliedDiscountCode: totals.appliedDiscountCode,
    discountMessage: totals.discountMessage,
  };
}
