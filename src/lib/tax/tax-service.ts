export type TaxEstimateInput = {
  taxable?: boolean;
  taxBps?: number;
};

export function estimateTax({
  subtotalCents,
  discountCents,
  shippingCents,
  taxable = false,
  taxBps = 0,
}: {
  subtotalCents: number;
  discountCents: number;
  shippingCents: number;
  taxable?: boolean;
  taxBps?: number;
}) {
  if (!taxable || taxBps <= 0) {
    return { taxCents: 0, taxBps: 0 };
  }

  const taxableBase = Math.max(0, subtotalCents - discountCents + shippingCents);

  return {
    taxCents: Math.floor((taxableBase * taxBps) / 10000),
    taxBps,
  };
}
