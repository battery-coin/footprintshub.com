export type ShippingMethodForEstimate = {
  code: string;
  name: string;
  priceCents: number;
  freeShippingThresholdCents?: number | null;
};

export type ShippingEstimateInput = {
  method?: ShippingMethodForEstimate;
};

export function estimateShipping({
  subtotalCents,
  discountCents,
  method,
}: {
  subtotalCents: number;
  discountCents: number;
  method?: ShippingMethodForEstimate;
}) {
  const netSubtotal = Math.max(0, subtotalCents - discountCents);
  const selected = method ?? {
    code: "flat_rate",
    name: "Flat rate shipping",
    priceCents: 799,
    freeShippingThresholdCents: 10000,
  };
  const freeByThreshold =
    selected.freeShippingThresholdCents !== undefined &&
    selected.freeShippingThresholdCents !== null &&
    netSubtotal >= selected.freeShippingThresholdCents;

  return {
    method: selected,
    shippingCents: freeByThreshold ? 0 : selected.priceCents,
    freeByThreshold,
  };
}

export function requiresShipping(productTypes: string[]) {
  return productTypes.some((type) => !["digital", "digital_unlock", "service"].includes(type));
}
