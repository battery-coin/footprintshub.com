import { calculateScheduledDiscountPrice, type ScheduledDiscountInput } from "./scheduled-discounts";

export function calculateDisplayPrice({
  priceCents,
  compareAtPriceCents,
  scheduledDiscount,
}: {
  priceCents: number;
  compareAtPriceCents?: number | null;
  scheduledDiscount?: ScheduledDiscountInput | null;
}) {
  const salePriceCents = scheduledDiscount ? calculateScheduledDiscountPrice(priceCents, scheduledDiscount) : priceCents;

  return {
    priceCents,
    salePriceCents,
    compareAtPriceCents: compareAtPriceCents ?? (salePriceCents < priceCents ? priceCents : null),
    isOnSale: salePriceCents < priceCents,
  };
}
