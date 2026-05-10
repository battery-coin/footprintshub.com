import { NextResponse } from "next/server";
import { cartPayloadSchema, validateAndPriceCart } from "@/lib/cart/cart-service";

export async function POST(request: Request) {
  const parsed = cartPayloadSchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid cart payload." }, { status: 400 });
  }

  const cart = await validateAndPriceCart(parsed.data);

  return NextResponse.json({
    lines: cart.lines,
    totals: cart.totals,
    inventory: cart.inventory,
  });
}
