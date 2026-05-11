export type ScheduledDiscountInput = {
  active: boolean;
  startsAt: Date;
  endsAt: Date;
  type: "percentage" | "fixed" | "sale_price";
  percentageBps?: number | null;
  fixedCents?: number | null;
  salePriceCents?: number | null;
};

export function getDiscountScheduleStatus(discount: Pick<ScheduledDiscountInput, "active" | "startsAt" | "endsAt">, now = new Date()) {
  if (!discount.active) {
    return "inactive" as const;
  }

  if (now < discount.startsAt) {
    return "scheduled" as const;
  }

  if (now > discount.endsAt) {
    return "expired" as const;
  }

  return "active" as const;
}

export function calculateScheduledDiscountPrice(priceCents: number, discount: ScheduledDiscountInput, now = new Date()) {
  if (getDiscountScheduleStatus(discount, now) !== "active") {
    return priceCents;
  }

  if (discount.type === "percentage") {
    return Math.max(0, Math.round(priceCents - (priceCents * Math.max(0, discount.percentageBps ?? 0)) / 10_000));
  }

  if (discount.type === "fixed") {
    return Math.max(0, priceCents - Math.max(0, discount.fixedCents ?? 0));
  }

  return Math.max(0, discount.salePriceCents ?? priceCents);
}
