import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { z } from "zod";
import { cookies } from "next/headers";
import { priceCartLines } from "@/lib/catalog/products";
import { calculateCartTotals } from "@/lib/cart/cart-totals";
import { resolveCheckoutMode } from "@/lib/checkout/checkout-mode-resolver";
import { createCoinbaseCheckout, CoinbaseConfigError, getCoinbaseConfigStatus } from "@/lib/coinbase/coinbase-business-client";
import { getDiscountForCart } from "@/lib/discounts/discount-service";
import { getPrisma, hasDatabaseUrl } from "@/lib/db/prisma";
import { validateInventoryForCart } from "@/lib/inventory/inventory-service";
import { buildAbsoluteUrl } from "@/lib/url/site-url";
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
  if (!hasDatabaseUrl()) {
    return NextResponse.json({ error: "Crypto checkout requires DATABASE_URL so payment webhooks can update orders." }, { status: 503 });
  }

  const config = getCoinbaseConfigStatus();
  if (!config.enabled || !config.keyConfigured || !config.secretConfigured) {
    return NextResponse.json(
      {
        error: "Coinbase crypto checkout is not configured yet.",
        configured: config,
      },
      { status: 503 },
    );
  }

  const lines = await priceCartLines(parsed.data.items);
  if (!lines.length) {
    return NextResponse.json({ error: "Cart is empty or unavailable." }, { status: 400 });
  }

  const checkoutMode = resolveCheckoutMode(lines);
  if (!checkoutMode.ok) {
    return NextResponse.json({ error: checkoutMode.reason }, { status: 409 });
  }
  if (checkoutMode.mode !== "payment") {
    return NextResponse.json({ error: "Crypto checkout currently supports one-time orders only. Please checkout subscriptions separately with card billing." }, { status: 409 });
  }

  const inventory = validateInventoryForCart(lines);
  if (!inventory.ok) {
    return NextResponse.json({ error: "Inventory validation failed.", details: inventory.errors }, { status: 409 });
  }

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
  const order = await createPendingCryptoOrder({
    lines,
    totals,
    cartId: parsed.data.cartId,
    referralCode,
    sessionId,
    visitorId,
    couponCode: totals.appliedDiscountCode,
  });

  const prisma = getPrisma();
  const providerIdempotencyKey = crypto.randomUUID();
  const paymentSession = await prisma.paymentSession.create({
    data: {
      shopId: order.shopId,
      cartId: parsed.data.cartId,
      orderId: order.id,
      provider: "coinbase_crypto",
      status: "created",
      amountCents: totals.totalCents,
      currency: totals.currency,
      idempotencyKey: `coinbase:checkout:create:${order.id}`,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      metadata: {
        orderNumber: order.orderNumber,
        providerIdempotencyKey,
        referralCode,
        sessionId,
        visitorId,
      },
    },
  });

  try {
    const checkout = await createCoinbaseCheckout(
      {
        amount: formatCentsForCoinbase(totals.totalCents),
        currency: totals.currency,
        description: `FootprintsHub order ${order.orderNumber}`,
        metadata: {
          orderId: order.id,
          orderNumber: order.orderNumber,
          shopId: order.shopId,
          paymentSessionId: paymentSession.id,
          source: "footprintshub-commerce",
        },
        successRedirectUrl: process.env.COINBASE_CHECKOUT_SUCCESS_URL || buildAbsoluteUrl(`/checkout/crypto/success?paymentSessionId=${paymentSession.id}`),
        failRedirectUrl: process.env.COINBASE_CHECKOUT_CANCEL_URL || buildAbsoluteUrl(`/checkout/crypto/cancel?paymentSessionId=${paymentSession.id}`),
        expiresAt: paymentSession.expiresAt?.toISOString(),
      },
      providerIdempotencyKey,
    );

    await prisma.$transaction([
      prisma.paymentSession.update({
        where: { id: paymentSession.id },
        data: {
          providerSessionId: checkout.id,
          providerHostedUrl: checkout.url,
          status: "created",
          metadata: {
            ...(paymentSession.metadata as Prisma.JsonObject),
            coinbaseStatus: checkout.status,
            network: checkout.network,
          },
        },
      }),
      prisma.cryptoPayment.create({
        data: {
          shopId: order.shopId,
          orderId: order.id,
          paymentSessionId: paymentSession.id,
          providerCheckoutId: checkout.id,
          hostedUrl: checkout.url,
          status: checkout.status,
          amountCents: totals.totalCents,
          currency: totals.currency,
          cryptoCurrency: checkout.currency,
          network: checkout.network,
          walletAddress: checkout.address,
          rawStatusPayload: checkout as Prisma.InputJsonObject,
        },
      }),
      prisma.order.update({
        where: { id: order.id },
        data: {
          paymentProvider: "coinbase",
          cryptoPaymentStatus: checkout.status,
          paymentSessionId: paymentSession.id,
        },
      }),
    ]);

    return NextResponse.json({ url: checkout.url, paymentSessionId: paymentSession.id, orderId: order.id });
  } catch (error) {
    await prisma.paymentSession.update({
      where: { id: paymentSession.id },
      data: { status: "failed", metadata: { error: error instanceof Error ? error.message : "Coinbase checkout failed." } },
    });
    const message = error instanceof CoinbaseConfigError ? error.message : "Coinbase checkout could not be created.";
    return NextResponse.json({ error: message }, { status: error instanceof CoinbaseConfigError ? 503 : 502 });
  }
}

async function createPendingCryptoOrder({
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
  const prisma = getPrisma();
  const shopId = lines[0]?.product.shopId;
  if (!shopId) {
    throw new Error("Cart shop could not be resolved.");
  }

  return prisma.order.create({
    data: {
      shopId,
      orderNumber: makeOrderNumber(),
      cartId,
      status: "awaiting_payment",
      paymentStatus: "unpaid",
      paymentProvider: "coinbase",
      fulfillmentStatus: totals.requiresShipping ? "unfulfilled" : "not_required",
      subtotalCents: totals.subtotalCents,
      discountCents: totals.discountCents,
      taxCents: totals.taxCents,
      shippingCents: totals.shippingCents,
      totalCents: totals.totalCents,
      currency: totals.currency,
      metadata: {
        source: "footprintshub-commerce",
        checkoutProvider: "coinbase_crypto",
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
          productTypeSnapshot: line.product.productType,
          paymentModeSnapshot: line.product.paymentMode ?? "one_time",
          fulfillmentTypeSnapshot:
            line.product.fulfillmentType === "printful" || line.product.printfulEnabled || line.product.productType === "print_on_demand"
              ? "printful"
              : line.product.deliveryMode === "download"
                ? "digital_download"
                : line.product.deliveryMode === "service_scheduled"
                  ? "service_delivery"
                  : line.product.deliveryMode === "subscription_access"
                    ? "subscription_access"
                    : line.product.deliveryMode === "nft_claim"
                      ? "nft_delivery"
                      : line.product.deliveryMode === "ad_review_and_schedule" ||
                          line.product.deliveryMode === "ad_auto_schedule" ||
                          line.product.deliveryMode === "campaign_boost" ||
                          line.product.deliveryMode === "featured_listing"
                        ? "ad_delivery"
                        : line.product.deliveryMode === "sponsor_placement"
                          ? "sponsorship_delivery"
                          : "manual",
          fulfillmentProvider:
            line.product.fulfillmentType === "printful" || line.product.printfulEnabled || line.product.productType === "print_on_demand"
              ? "printful"
              : undefined,
          digitalAssetId: typeof line.product.metadata?.digitalAssetId === "string" ? line.product.metadata.digitalAssetId : undefined,
          subscriptionPlanId: typeof line.product.metadata?.subscriptionPlanId === "string" ? line.product.metadata.subscriptionPlanId : undefined,
          nftProductId: typeof line.product.metadata?.nftProductId === "string" ? line.product.metadata.nftProductId : undefined,
          serviceProductId: typeof line.product.metadata?.serviceProductId === "string" ? line.product.metadata.serviceProductId : undefined,
          metadata: line.product.metadata as Prisma.InputJsonValue | undefined,
        })),
      },
    },
    select: { id: true, shopId: true, orderNumber: true },
  });
}

function formatCentsForCoinbase(cents: number) {
  return (cents / 100).toFixed(2);
}

function makeOrderNumber() {
  return `FH-${Date.now().toString(36).toUpperCase()}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
}
