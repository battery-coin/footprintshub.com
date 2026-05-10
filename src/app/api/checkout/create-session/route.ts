import { NextResponse } from "next/server";
import { z } from "zod";
import { priceCartLines } from "@/lib/catalog/products";
import { getStripe } from "@/lib/stripe";
import { getSiteUrl } from "@/lib/url";

const checkoutSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string().min(1),
      variantId: z.string().optional(),
      quantity: z.coerce.number().int().min(1).max(99),
    }),
  ),
});

export async function POST(request: Request) {
  const parsed = checkoutSchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid checkout payload." }, { status: 400 });
  }

  const lines = await priceCartLines(parsed.data.items);

  if (!lines.length) {
    return NextResponse.json({ error: "Cart is empty or unavailable." }, { status: 400 });
  }

  let stripe;
  try {
    stripe = getStripe();
  } catch {
    return NextResponse.json(
      {
        error: "Stripe is not configured. Add STRIPE_SECRET_KEY and NEXT_PUBLIC_SITE_URL.",
      },
      { status: 503 },
    );
  }

  const siteUrl = getSiteUrl();
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}/checkout/cancel`,
    allow_promotion_codes: true,
    line_items: lines.map((line) => ({
      quantity: line.quantity,
      price_data: {
        currency: line.product.currency.toLowerCase(),
        unit_amount: line.unitPriceCents,
        product_data: {
          name: line.product.title,
          description: line.product.shortDescription,
          metadata: {
            productId: line.product.id,
            shopId: line.product.shopId,
            slug: line.product.slug,
          },
        },
      },
    })),
    metadata: {
      source: "footprintshub-commerce",
      productIds: lines.map((line) => line.product.id).join(","),
    },
  });

  return NextResponse.json({ url: session.url });
}
