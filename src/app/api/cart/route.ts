import { NextResponse } from "next/server";
import { z } from "zod";
import { priceCartLines } from "@/lib/catalog/products";

const cartSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string().min(1),
      variantId: z.string().optional(),
      quantity: z.coerce.number().int().min(1).max(99),
    }),
  ),
});

export async function POST(request: Request) {
  const parsed = cartSchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid cart payload." }, { status: 400 });
  }

  const lines = await priceCartLines(parsed.data.items);
  const subtotalCents = lines.reduce((total, line) => total + line.totalCents, 0);

  return NextResponse.json({
    lines,
    subtotalCents,
    currency: lines[0]?.product.currency ?? "USD",
  });
}
