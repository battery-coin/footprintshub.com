import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { z } from "zod";
import { cookies } from "next/headers";
import { priceCartLines } from "@/lib/catalog/products";
import { getPrisma, hasDatabaseUrl } from "@/lib/db/prisma";
import { getStripe } from "@/lib/stripe";
import { getSiteUrl } from "@/lib/url";
import { REFERRAL_COOKIE, SESSION_COOKIE, VISITOR_COOKIE } from "@/lib/affiliate/attribution";

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
  const cookieStore = await cookies();
  const referralCode = cookieStore.get(REFERRAL_COOKIE)?.value;
  const sessionId = cookieStore.get(SESSION_COOKIE)?.value;
  const visitorId = cookieStore.get(VISITOR_COOKIE)?.value;
  const subtotalCents = lines.reduce((total, line) => total + line.totalCents, 0);
  const currency = lines[0]?.product.currency ?? "USD";
  const order = await createPendingOrderIfDatabaseReady({
    lines,
    subtotalCents,
    currency,
    referralCode,
    sessionId,
    visitorId,
  });

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
      ...(order ? { orderId: order.id, orderNumber: order.orderNumber } : {}),
      ...(referralCode ? { referralCode } : {}),
      ...(sessionId ? { sessionId } : {}),
      ...(visitorId ? { visitorId } : {}),
    },
  });

  if (order && session.id) {
    await getPrisma().order.update({
      where: { id: order.id },
      data: { stripeCheckoutSessionId: session.id },
    });
  }

  return NextResponse.json({ url: session.url });
}

async function createPendingOrderIfDatabaseReady({
  lines,
  subtotalCents,
  currency,
  referralCode,
  sessionId,
  visitorId,
}: {
  lines: Awaited<ReturnType<typeof priceCartLines>>;
  subtotalCents: number;
  currency: string;
  referralCode?: string;
  sessionId?: string;
  visitorId?: string;
}) {
  if (!hasDatabaseUrl()) {
    return null;
  }

  const prisma = getPrisma();
  const shopId = lines[0]?.product.shopId;

  if (!shopId) {
    return null;
  }

  try {
    return await prisma.order.create({
      data: {
        shopId,
        orderNumber: makeOrderNumber(),
        status: "pending",
        paymentStatus: "pending",
        fulfillmentStatus: "unfulfilled",
        subtotalCents,
        totalCents: subtotalCents,
        currency,
        metadata: {
          source: "footprintshub-commerce",
          ...(referralCode ? { referralCode } : {}),
          ...(sessionId ? { sessionId } : {}),
          ...(visitorId ? { visitorId } : {}),
        },
        items: {
          create: lines.map((line) => ({
            productId: line.product.id,
            titleSnapshot: line.product.title,
            skuSnapshot: line.product.sku,
            quantity: line.quantity,
            unitPriceCents: line.unitPriceCents,
            totalCents: line.totalCents,
            metadata: line.product.metadata as Prisma.InputJsonValue | undefined,
          })),
        },
      },
      select: {
        id: true,
        orderNumber: true,
      },
    });
  } catch {
    return null;
  }
}

function makeOrderNumber() {
  return `FH-${Date.now().toString(36).toUpperCase()}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
}
