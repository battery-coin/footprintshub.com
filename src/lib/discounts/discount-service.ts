import type { PricedCartLine } from "@/lib/catalog/types";
import { getPrisma, hasDatabaseUrl } from "@/lib/db/prisma";

export type DiscountForTotals = {
  code: string;
  type: "percent" | "fixed" | "free_shipping";
  value: number;
  active: boolean;
  startsAt?: Date | null;
  endsAt?: Date | null;
  minSubtotalCents?: number | null;
  maxDiscountCents?: number | null;
  productId?: string | null;
  categoryId?: string | null;
  collectionId?: string | null;
};

export function applyDiscount({
  discount,
  subtotalCents,
  lines,
  now,
}: {
  discount: DiscountForTotals;
  subtotalCents: number;
  lines: PricedCartLine[];
  now: Date;
}) {
  const validation = validateDiscount({ discount, subtotalCents, lines, now });

  if (!validation.ok) {
    return { discountCents: 0, applied: false, message: validation.reason };
  }

  let discountCents = 0;

  if (discount.type === "percent") {
    discountCents = Math.floor((subtotalCents * discount.value) / 10000);
  } else if (discount.type === "fixed") {
    discountCents = discount.value;
  }

  if (discount.maxDiscountCents !== undefined && discount.maxDiscountCents !== null) {
    discountCents = Math.min(discountCents, discount.maxDiscountCents);
  }

  return {
    discountCents: Math.max(0, Math.min(subtotalCents, discountCents)),
    applied: true,
    message: discount.type === "free_shipping" ? "Free shipping discount is reserved for checkout shipping totals." : undefined,
  };
}

export function validateDiscount({
  discount,
  subtotalCents,
  lines,
  now,
}: {
  discount: DiscountForTotals;
  subtotalCents: number;
  lines: PricedCartLine[];
  now: Date;
}) {
  if (!discount.active) {
    return { ok: false as const, reason: "Discount code is inactive." };
  }

  if (discount.startsAt && discount.startsAt > now) {
    return { ok: false as const, reason: "Discount code is not active yet." };
  }

  if (discount.endsAt && discount.endsAt < now) {
    return { ok: false as const, reason: "Discount code has expired." };
  }

  if (discount.minSubtotalCents && subtotalCents < discount.minSubtotalCents) {
    return { ok: false as const, reason: "Cart subtotal is below the discount minimum." };
  }

  if (discount.productId && !lines.some((line) => line.product.id === discount.productId)) {
    return { ok: false as const, reason: "Discount does not apply to these products." };
  }

  return { ok: true as const };
}

export async function getDiscountForCart({
  shopId,
  code,
}: {
  shopId?: string;
  code: string;
  subtotalCents: number;
}): Promise<DiscountForTotals | undefined> {
  if (!shopId || !hasDatabaseUrl()) {
    return undefined;
  }

  const discount = await getPrisma().discountCode.findFirst({
    where: {
      shopId,
      code: code.toUpperCase(),
      active: true,
    },
  });

  if (!discount) {
    return undefined;
  }

  return {
    code: discount.code,
    type: discount.type,
    value: discount.value,
    active: discount.active,
    startsAt: discount.startsAt,
    endsAt: discount.endsAt,
    minSubtotalCents: discount.minSubtotalCents,
    maxDiscountCents: discount.maxDiscountCents,
    productId: discount.productId,
    categoryId: discount.categoryId,
    collectionId: discount.collectionId,
  };
}
