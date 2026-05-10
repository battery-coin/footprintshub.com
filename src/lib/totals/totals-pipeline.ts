import type { PricedCartLine } from "@/lib/catalog/types";
import { applyDiscount, type DiscountForTotals } from "@/lib/discounts/discount-service";
import { estimateShipping, type ShippingEstimateInput } from "@/lib/shipping/shipping-service";
import { estimateTax, type TaxEstimateInput } from "@/lib/tax/tax-service";

export type TotalLineCode =
  | "subtotal"
  | "discount"
  | "coupon"
  | "gift_voucher"
  | "store_credit"
  | "loyalty_points"
  | "shipping"
  | "tax"
  | "grand_total";

export type TotalLine = {
  code: TotalLineCode;
  title: string;
  amountCents: number;
  sortOrder: number;
  metadata?: Record<string, unknown>;
};

export type TotalsPipelineInput = {
  lines: PricedCartLine[];
  discount?: DiscountForTotals;
  giftVoucherCents?: number;
  storeCreditCents?: number;
  loyaltyPointsCents?: number;
  shipping?: ShippingEstimateInput;
  tax?: TaxEstimateInput;
};

export type TotalsPipelineResult = {
  lines: TotalLine[];
  subtotalCents: number;
  discountCents: number;
  giftVoucherCents: number;
  storeCreditCents: number;
  loyaltyPointsCents: number;
  shippingCents: number;
  taxCents: number;
  totalCents: number;
  currency: string;
  requiresShipping: boolean;
  appliedDiscountCode?: string;
  discountMessage?: string;
};

export function calculateTotalsPipeline(input: TotalsPipelineInput): TotalsPipelineResult {
  const subtotalCents = input.lines.reduce((total, line) => total + line.totalCents, 0);
  const currency = input.lines[0]?.product.currency ?? "USD";
  const requiresShipping = input.lines.some((line) => line.product.requiresShipping !== false);
  const discountResult = input.discount
    ? applyDiscount({ discount: input.discount, subtotalCents, lines: input.lines, now: new Date() })
    : { discountCents: 0, applied: false, message: undefined };
  const giftVoucherCents = clampCredit(input.giftVoucherCents ?? 0, subtotalCents - discountResult.discountCents);
  const storeCreditCents = clampCredit(input.storeCreditCents ?? 0, subtotalCents - discountResult.discountCents - giftVoucherCents);
  const loyaltyPointsCents = clampCredit(
    input.loyaltyPointsCents ?? 0,
    subtotalCents - discountResult.discountCents - giftVoucherCents - storeCreditCents,
  );
  const shippingCents = requiresShipping
    ? estimateShipping({
        subtotalCents,
        discountCents: discountResult.discountCents + giftVoucherCents + storeCreditCents + loyaltyPointsCents,
        method: input.shipping?.method,
      }).shippingCents
    : 0;
  const taxCents = estimateTax({
    subtotalCents,
    discountCents: discountResult.discountCents,
    shippingCents,
    taxable: input.tax?.taxable,
    taxBps: input.tax?.taxBps,
  }).taxCents;
  const totalCents = Math.max(
    0,
    subtotalCents -
      discountResult.discountCents -
      giftVoucherCents -
      storeCreditCents -
      loyaltyPointsCents +
      shippingCents +
      taxCents,
  );

  const lines: TotalLine[] = [
    { code: "subtotal", title: "Subtotal", amountCents: subtotalCents, sortOrder: 10 },
    { code: "discount", title: "Discount", amountCents: -discountResult.discountCents, sortOrder: 20 },
    { code: "gift_voucher", title: "Gift voucher", amountCents: -giftVoucherCents, sortOrder: 30 },
    { code: "store_credit", title: "Store credit", amountCents: -storeCreditCents, sortOrder: 40 },
    { code: "loyalty_points", title: "Loyalty points", amountCents: -loyaltyPointsCents, sortOrder: 50 },
    { code: "shipping", title: "Shipping", amountCents: shippingCents, sortOrder: 60 },
    { code: "tax", title: "Tax", amountCents: taxCents, sortOrder: 70 },
    { code: "grand_total", title: "Total", amountCents: totalCents, sortOrder: 100 },
  ];

  return {
    lines,
    subtotalCents,
    discountCents: discountResult.discountCents,
    giftVoucherCents,
    storeCreditCents,
    loyaltyPointsCents,
    shippingCents,
    taxCents,
    totalCents,
    currency,
    requiresShipping,
    appliedDiscountCode: discountResult.applied ? input.discount?.code : undefined,
    discountMessage: discountResult.message,
  };
}

function clampCredit(value: number, maxAvailableCents: number) {
  return Math.max(0, Math.min(Math.floor(value), Math.max(0, maxAvailableCents)));
}
