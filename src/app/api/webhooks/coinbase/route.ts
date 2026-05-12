import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import {
  mapCoinbaseStatusToInternalStatus,
  normalizeCoinbaseEvent,
  verifyCoinbaseWebhook,
} from "@/lib/coinbase/coinbase-business-client";
import { getPrisma, hasDatabaseUrl } from "@/lib/db/prisma";
import { markWebhookFailed, markWebhookProcessed, recordWebhookReceived } from "@/lib/webhooks/webhook-events";
import { completePaidOrder } from "@/workflows/orders/complete-paid-order";

export async function POST(request: Request) {
  if (!process.env.COINBASE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Coinbase webhook secret is not configured." }, { status: 503 });
  }

  const body = await request.text();
  const signature =
    request.headers.get("x-cc-webhook-signature") ??
    request.headers.get("coinbase-signature") ??
    request.headers.get("x-coinbase-signature");

  if (!verifyCoinbaseWebhook(body, signature)) {
    return NextResponse.json({ error: "Invalid Coinbase webhook signature." }, { status: 400 });
  }

  const rawPayload = JSON.parse(body) as unknown;
  const event = normalizeCoinbaseEvent(rawPayload);
  const orderId = event.metadata.orderId;
  const shopId = event.metadata.shopId;

  const recorded = await recordWebhookReceived({
    provider: "coinbase",
    eventId: event.id,
    eventType: event.type,
    payload: body,
    shopId,
    orderId,
  });

  if (recorded.duplicate) {
    return NextResponse.json({ received: true, duplicate: true });
  }

  try {
    if (hasDatabaseUrl()) {
      await handleCoinbaseCheckoutEvent({
        checkoutId: event.checkoutId,
        status: event.status,
        orderId,
        paymentSessionId: event.metadata.paymentSessionId,
        payload: event.data,
      });
    }

    await markWebhookProcessed("coinbase", event.id);
    return NextResponse.json({ received: true });
  } catch (error) {
    await markWebhookFailed("coinbase", event.id, error);
    return NextResponse.json({ error: "Coinbase webhook handler failed." }, { status: 500 });
  }
}

async function handleCoinbaseCheckoutEvent({
  checkoutId,
  status,
  orderId,
  paymentSessionId,
  payload,
}: {
  checkoutId?: string;
  status?: ReturnType<typeof mapCoinbaseStatusToInternalStatus>;
  orderId?: string;
  paymentSessionId?: string;
  payload?: Record<string, unknown>;
}) {
  if (!checkoutId && !paymentSessionId && !orderId) {
    return;
  }

  const prisma = getPrisma();
  const resolvedSession = paymentSessionId
    ? await prisma.paymentSession.findUnique({ where: { id: paymentSessionId } })
    : checkoutId
      ? await prisma.paymentSession.findFirst({ where: { provider: "coinbase_crypto", providerSessionId: checkoutId } })
      : null;
  const resolvedOrderId = orderId ?? resolvedSession?.orderId ?? undefined;
  if (!resolvedOrderId) {
    return;
  }

  const internalStatus = status ?? mapCoinbaseStatusToInternalStatus(typeof payload?.status === "string" ? payload.status : undefined);
  const order = await prisma.order.findUnique({ where: { id: resolvedOrderId }, select: { id: true, shopId: true, totalCents: true, currency: true } });
  if (!order) {
    return;
  }

  await prisma.$transaction(async (tx) => {
    if (resolvedSession) {
      await tx.paymentSession.update({
        where: { id: resolvedSession.id },
        data: {
          status: mapPaymentSessionStatus(internalStatus),
          providerPaymentIntentId: typeof payload?.transactionHash === "string" ? payload.transactionHash : resolvedSession.providerPaymentIntentId,
          metadata: {
            ...(resolvedSession.metadata as Prisma.JsonObject | null),
            coinbaseStatus: typeof payload?.status === "string" ? payload.status : internalStatus,
            lastWebhookAt: new Date().toISOString(),
          },
        },
      });
    }

    if (checkoutId) {
      await tx.cryptoPayment.upsert({
        where: { provider_providerCheckoutId: { provider: "coinbase", providerCheckoutId: checkoutId } },
        update: {
          status: typeof payload?.status === "string" ? payload.status : internalStatus,
          transactionHash: typeof payload?.transactionHash === "string" ? payload.transactionHash : undefined,
          rawStatusPayload: payload as Prisma.InputJsonObject | undefined,
        },
        create: {
          shopId: order.shopId,
          orderId: order.id,
          paymentSessionId: resolvedSession?.id,
          providerCheckoutId: checkoutId,
          hostedUrl: typeof payload?.url === "string" ? payload.url : "",
          status: typeof payload?.status === "string" ? payload.status : internalStatus,
          amountCents: order.totalCents,
          currency: order.currency,
          cryptoCurrency: typeof payload?.currency === "string" ? payload.currency : null,
          network: typeof payload?.network === "string" ? payload.network : null,
          transactionHash: typeof payload?.transactionHash === "string" ? payload.transactionHash : null,
          walletAddress: typeof payload?.address === "string" ? payload.address : null,
          rawStatusPayload: payload as Prisma.InputJsonObject | undefined,
        },
      });
    }

    if (internalStatus === "paid") {
      await tx.order.update({
        where: { id: order.id },
        data: {
          status: "paid",
          paymentStatus: "paid",
          paymentProvider: "coinbase",
          cryptoPaymentStatus: typeof payload?.status === "string" ? payload.status : "COMPLETED",
          paidAt: new Date(),
        },
      });
      await tx.payment.upsert({
        where: { idempotencyKey: `coinbase:checkout.completed:${checkoutId ?? resolvedSession?.id ?? order.id}` },
        update: { status: "paid" },
        create: {
          shopId: order.shopId,
          orderId: order.id,
          provider: "coinbase",
          paymentPart: "full",
          mode: "payment",
          status: "paid",
          amountCents: order.totalCents,
          currency: order.currency,
          idempotencyKey: `coinbase:checkout.completed:${checkoutId ?? resolvedSession?.id ?? order.id}`,
          metadata: payload as Prisma.InputJsonObject | undefined,
        },
      });
    } else if (["failed", "expired", "cancelled"].includes(internalStatus)) {
      await tx.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: internalStatus === "cancelled" ? "cancelled" : "failed",
          cryptoPaymentStatus: typeof payload?.status === "string" ? payload.status : internalStatus,
        },
      });
    } else if (internalStatus === "refunded" || internalStatus === "partially_refunded") {
      await tx.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: internalStatus === "refunded" ? "refunded" : "partially_refunded",
          cryptoPaymentStatus: typeof payload?.status === "string" ? payload.status : internalStatus,
        },
      });
    }
  });

  if (internalStatus === "paid") {
    await completePaidOrder(order.id);
  }
}

function mapPaymentSessionStatus(status: ReturnType<typeof mapCoinbaseStatusToInternalStatus>) {
  if (status === "paid") return "paid";
  if (status === "expired") return "expired";
  if (status === "cancelled") return "cancelled";
  if (status === "failed") return "failed";
  if (status === "refunded" || status === "partially_refunded") return "refunded";
  return "pending";
}
