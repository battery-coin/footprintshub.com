import type { PricedCartLine } from "@/lib/catalog/types";
import { applyDiscount, type DiscountForTotals } from "@/lib/discounts/discount-service";
import { estimateShipping, type ShippingEstimateInput } from "@/lib/shipping/shipping-service";
import { estimateTax, type TaxEstimateInput } from "@/lib/tax/tax-service";

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
  const subtotalCents = lines.reduce((total, line) => total + line.totalCents, 0);
  const currency = lines[0]?.product.currency ?? "USD";
  const requiresShipping = lines.some((line) => line.product.requiresShipping !== false);
  const discountResult = discount
    ? applyDiscount({ discount, subtotalCents, lines, now: new Date() })
    : { discountCents: 0, applied: false, message: undefined };
  const shippingCents = requiresShipping
    ? estimateShipping({
        subtotalCents,
        discountCents: discountResult.discountCents,
        method: shipping?.method,
      }).shippingCents
    : 0;
  const taxCents = estimateTax({
    subtotalCents,
    discountCents: discountResult.discountCents,
    shippingCents,
    taxable: tax?.taxable,
    taxBps: tax?.taxBps,
  }).taxCents;
  const totalCents = Math.max(0, subtotalCents - discountResult.discountCents + shippingCents + taxCents);

  return {
    subtotalCents,
    discountCents: discountResult.discountCents,
    taxCents,
    shippingCents,
    totalCents,
    currency,
    requiresShipping,
    appliedDiscountCode: discountResult.applied ? discount?.code : undefined,
    discountMessage: discountResult.message,
  };
}
