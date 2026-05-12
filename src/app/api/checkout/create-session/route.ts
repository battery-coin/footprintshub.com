import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { z } from "zod";
import { cookies } from "next/headers";
import { priceCartLines } from "@/lib/catalog/products";
import { calculateCartTotals } from "@/lib/cart/cart-totals";
import { getDiscountForCart } from "@/lib/discounts/discount-service";
import { validateInventoryForCart } from "@/lib/inventory/inventory-service";
import { getPrisma, hasDatabaseUrl } from "@/lib/db/prisma";
import { getStripe } from "@/lib/stripe";
import { getSiteUrl } from "@/lib/url";
import { canCheckoutWithPolicy, calculatePaymentComposition } from "@/lib/payments/mixed-payment-calculator";
import { createOrderPaymentComposition } from "@/lib/payments/payment-composition";
import { getActiveGlobalPaymentPolicy } from "@/lib/payments/payment-policy";
import { REFERRAL_COOKIE, SESSION_COOKIE, VISITOR_COOKIE } from "@/lib/affiliate/attribution";

const checkoutSchema = z.object({
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

export async function POST(request: Request) {
  const parsed = checkoutSchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid checkout payload." }, { status: 400 });
  }

  const lines = await priceCartLines(parsed.data.items);

  if (!lines.length) {
    return NextResponse.json({ error: "Cart is empty or unavailable." }, { status: 400 });
  }

  const inventory = validateInventoryForCart(lines);

  if (!inventory.ok) {
    return NextResponse.json({ error: "Inventory validation failed.", details: inventory.errors }, { status: 409 });
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
  const discount = parsed.data.couponCode
    ? await getDiscountForCart({
        shopId: lines[0]?.product.shopId,
        code: parsed.data.couponCode,
        subtotalCents: lines.reduce((total, line) => total + line.totalCents, 0),
      })
    : undefined;
  const totals = calculateCartTotals({ lines, discount });
  const paymentPolicy = await getActiveGlobalPaymentPolicy();
  const checkoutPolicy = canCheckoutWithPolicy(paymentPolicy);
  const paymentComposition = calculatePaymentComposition(totals.totalCents, paymentPolicy);

  if (!checkoutPolicy.ok) {
    return NextResponse.json(
      {
        error: checkoutPolicy.reason,
        paymentPolicy: {
          compositionMode: paymentPolicy.compositionMode,
          fiatPercentageBps: paymentPolicy.fiatPercentageBps,
          tokenPercentageBps: paymentPolicy.tokenPercentageBps,
          tokenSymbol: paymentPolicy.tokenSymbol,
        },
        composition: paymentComposition.ok ? paymentComposition : null,
      },
      { status: 409 },
    );
  }

  const order = await createPendingOrderIfDatabaseReady({
    lines,
    totals,
    cartId: parsed.data.cartId,
    referralCode,
    sessionId,
    visitorId,
    couponCode: totals.appliedDiscountCode,
  });
  if (order && paymentComposition.ok) {
    await createOrderPaymentComposition({
      orderId: order.id,
      shopId: order.shopId,
      totalCents: totals.totalCents,
      policy: paymentPolicy,
    });
  }

  const stripeAmountCents = paymentComposition.ok ? paymentComposition.fiatRequiredCents : totals.totalCents;
  const stripeDiscount =
    totals.discountCents > 0
      ? await stripe.coupons.create({
          amount_off: totals.discountCents,
          currency: totals.currency.toLowerCase(),
          duration: "once",
          name: totals.appliedDiscountCode ? `FootprintsHub ${totals.appliedDiscountCode}` : "FootprintsHub discount",
        })
      : null;
  const lineItems =
    paymentPolicy.tokenPercentageBps > 0
      ? [
          {
            quantity: 1,
            price_data: {
              currency: totals.currency.toLowerCase(),
              unit_amount: stripeAmountCents,
              product_data: {
                name: "FootprintsHub USD payment portion",
                description: "USD portion of a mixed utility token payment policy.",
              },
            },
          },
        ]
      : [
          ...lines.map((line) => ({
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
          ...(totals.shippingCents > 0
            ? [
                {
                  quantity: 1,
                  price_data: {
                    currency: totals.currency.toLowerCase(),
                    unit_amount: totals.shippingCents,
                    product_data: {
                      name: "Shipping",
                    },
                  },
                },
              ]
            : []),
          ...(totals.taxCents > 0
            ? [
                {
                  quantity: 1,
                  price_data: {
                    currency: totals.currency.toLowerCase(),
                    unit_amount: totals.taxCents,
                    product_data: {
                      name: "Estimated tax",
                    },
                  },
                },
              ]
            : []),
        ];

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}/checkout/cancel`,
    ...(stripeDiscount ? { discounts: [{ coupon: stripeDiscount.id }] } : { allow_promotion_codes: true }),
    line_items: lineItems,
    metadata: {
      source: "footprintshub-commerce",
      productIds: lines.map((line) => line.product.id).join(","),
      shopId: lines[0]?.product.shopId,
      ...(parsed.data.cartId ? { cartId: parsed.data.cartId } : {}),
      ...(order ? { orderId: order.id, orderNumber: order.orderNumber } : {}),
      paymentCompositionMode: paymentPolicy.compositionMode,
      fiatRequiredCents: String(stripeAmountCents),
      tokenRequiredCents: paymentComposition.ok ? String(paymentComposition.tokenUsdReferenceCents) : "0",
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
  totals,
  cartId,
  referralCode,
  sessionId,
  visitorId,
  couponCode,
}: {
  lines: Awaited<ReturnType<typeof priceCartLines>>;
  totals: ReturnType<typeof calculateCartTotals>;
  cartId?: string;
  referralCode?: string;
  sessionId?: string;
  visitorId?: string;
  couponCode?: string;
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
        cartId,
        status: "awaiting_payment",
        paymentStatus: "unpaid",
        fulfillmentStatus: totals.requiresShipping ? "unfulfilled" : "not_required",
        subtotalCents: totals.subtotalCents,
        discountCents: totals.discountCents,
        taxCents: totals.taxCents,
        shippingCents: totals.shippingCents,
        totalCents: totals.totalCents,
        currency: totals.currency,
        metadata: {
          source: "footprintshub-commerce",
          ...(couponCode ? { couponCode } : {}),
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
        shopId: true,
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
