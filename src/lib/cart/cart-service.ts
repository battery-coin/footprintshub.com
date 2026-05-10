import { z } from "zod";
import { priceCartLines } from "@/lib/catalog/products";
import { getDiscountForCart } from "@/lib/discounts/discount-service";
import { validateInventoryForCart } from "@/lib/inventory/inventory-service";
import { calculateCartTotals } from "./cart-totals";

export const cartPayloadSchema = z.object({
  shopId: z.string().optional(),
  cartId: z.string().optional(),
  couponCode: z.string().trim().min(1).max(80).optional(),
  items: z.array(
    z.object({
      productId: z.string().min(1),
      variantId: z.string().optional(),
      quantity: z.coerce.number().int().min(1).max(99),
    }),
  ),
});

export async function validateAndPriceCart(payload: z.infer<typeof cartPayloadSchema>) {
  const lines = await priceCartLines(payload.items);
  const inventory = validateInventoryForCart(lines);
  const subtotalCents = lines.reduce((total, line) => total + line.totalCents, 0);
  const discount = payload.couponCode
    ? await getDiscountForCart({
        shopId: payload.shopId ?? lines[0]?.product.shopId,
        code: payload.couponCode,
        subtotalCents,
      })
    : undefined;
  const totals = calculateCartTotals({ lines, discount });

  return {
    lines,
    totals,
    inventory,
    couponCode: payload.couponCode,
  };
}
