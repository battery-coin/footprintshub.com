import type { Prisma } from "@prisma/client";
import { logRefundApproved, writeAuditLog } from "@/lib/audit/audit-log";
import { getPrisma, hasDatabaseUrl } from "@/lib/db/prisma";
import { calculateRefund } from "./refund-calculator";
import { RefundConfigurationError, RefundError } from "./refund-errors";
import { processStripeRefundRequest } from "./stripe-refund-provider";
import { applyRefundSideEffects, markDigitalUnlocksForRefundReview } from "./refund-workflows";
import type { CreateRefundInput } from "./refund-validation";

export async function calculateRefundableAmount(orderId: string) {
  const order = await loadRefundableOrder(orderId);
  return calculateRefund(order, { orderId, type: "partial", provider: "manual", amountCents: 1, reason: "preview", processNow: false, restock: false }).refundableAmountCents;
}

export async function createRefundRequest(input: CreateRefundInput, actorId?: string | null) {
  if (!hasDatabaseUrl()) throw new RefundConfigurationError("DATABASE_URL is required for refunds.");
  const prisma = getPrisma();
  const order = await loadRefundableOrder(input.orderId);
  const calculation = calculateRefund(order, input);
  const payment = await prisma.payment.findFirst({
    where: {
      orderId: order.id,
      provider: input.provider === "stripe" ? "stripe" : undefined,
      status: "paid",
    },
    orderBy: { createdAt: "desc" },
  });

  if (input.provider === "stripe" && !order.stripePaymentIntentId && !payment?.stripePaymentIntentId) {
    throw new RefundError("This order does not have a Stripe payment intent available for refund.");
  }
  if (input.provider === "store_credit" && !order.customerId) {
    throw new RefundError("Store credit refunds require a customer record.");
  }

  const refund = await prisma.$transaction(async (tx) => {
    const created = await tx.refund.create({
      data: {
        shopId: order.shopId,
        orderId: order.id,
        paymentId: payment?.id,
        provider: input.provider,
        type: calculation.type,
        status: input.processNow ? "approved" : "requested",
        amountCents: calculation.amountCents,
        currency: order.currency,
        reason: input.reason,
        adminNote: input.adminNote,
        customerNote: input.customerNote,
        requestedByUserId: actorId ?? null,
        approvedByUserId: input.processNow ? (actorId ?? null) : null,
        approvedAt: input.processNow ? new Date() : null,
        stripePaymentIntentId: order.stripePaymentIntentId ?? payment?.stripePaymentIntentId,
        idempotencyKey: `refund:${order.id}:${crypto.randomUUID()}`,
        requestPayload: input as Prisma.InputJsonObject,
        metadata: {
          refundableAmountCents: calculation.refundableAmountCents,
          printfulReviewRequired: order.printfulOrders.some((printfulOrder) =>
            ["submitted", "accepted", "inprocess", "fulfilled", "shipped", "delivered"].includes(printfulOrder.status),
          ),
        },
        items: {
          create: calculation.items.map((item) => ({
            shopId: order.shopId,
            orderId: order.id,
            orderItemId: item.orderItemId,
            quantity: item.quantity,
            amountCents: item.amountCents,
            restock: item.restock,
            reason: item.reason,
          })),
        },
      },
      include: { items: true },
    });

    await tx.order.update({
      where: { id: order.id },
      data: {
        refundStatus: "refund_requested",
        refundableAmountCents: calculation.refundableAmountCents,
      },
    });

    await tx.orderItem.updateMany({
      where: { id: { in: calculation.items.map((item) => item.orderItemId) } },
      data: { refundStatus: "refund_requested" },
    });

    return created;
  });

  await logRefundApproved({
    actorId,
    targetType: "refund",
    targetId: refund.id,
    metadata: { orderId: order.id, provider: input.provider, amountCents: refund.amountCents },
  });

  if (!input.processNow) {
    return { refund, processed: false };
  }

  return { refund: await processRefund(refund.id, actorId), processed: true };
}

export async function processRefund(refundId: string, actorId?: string | null) {
  if (!hasDatabaseUrl()) throw new RefundConfigurationError("DATABASE_URL is required for refunds.");
  const prisma = getPrisma();
  const refund = await prisma.refund.findUnique({ where: { id: refundId }, include: { order: true, payment: true } });
  if (!refund) throw new RefundError("Refund not found.", 404);
  if (refund.status === "succeeded" || refund.status === "partially_succeeded") return refund;

  await prisma.refund.update({
    where: { id: refund.id },
    data: { status: "processing", processedByUserId: actorId ?? null },
  });

  try {
    if (refund.provider === "stripe") {
      const stripeRefund = await processStripeRefundRequest({
        refundId: refund.id,
        orderId: refund.orderId,
        amountCents: refund.amountCents,
        paymentIntentId: refund.stripePaymentIntentId ?? refund.order.stripePaymentIntentId ?? refund.payment?.stripePaymentIntentId,
        chargeId: refund.stripeChargeId,
        reason: refund.reason,
      });

      return markRefundSucceeded(refund.id, {
        providerRefundId: stripeRefund.id,
        stripeRefundId: stripeRefund.id,
        responsePayload: stripeRefund as unknown as Prisma.InputJsonObject,
      });
    }

    if (refund.provider === "store_credit") {
      return await prisma.$transaction(async (tx) => {
        if (!refund.order.customerId) throw new RefundError("Store credit refunds require a customer.");
        await tx.storeCreditLedger.create({
          data: {
            shopId: refund.shopId,
            customerId: refund.order.customerId,
            orderId: refund.orderId,
            refundId: refund.id,
            type: "refund",
            amountCents: refund.amountCents,
            currency: refund.currency,
            note: `Store credit refund ${refund.id}`,
          },
        });
        await tx.refund.update({ where: { id: refund.id }, data: { status: "succeeded", processedAt: new Date() } });
        await applyRefundSideEffects(tx, refund.id);
        await markDigitalUnlocksForRefundReview(tx, refund.id);
        return tx.refund.findUniqueOrThrow({ where: { id: refund.id }, include: { items: true } });
      });
    }

    return markRefundSucceeded(refund.id, {});
  } catch (error) {
    await prisma.refund.update({
      where: { id: refund.id },
      data: {
        status: "failed",
        failedAt: new Date(),
        errorPayload: { error: error instanceof Error ? error.message : "Refund processing failed." },
      },
    });
    await writeAuditLog({
      actorId,
      action: "refund.failed",
      targetType: "refund",
      targetId: refund.id,
      category: "refunds",
      severity: "high",
      metadata: { error: error instanceof Error ? error.message : "unknown" },
    });
    throw error;
  }
}

export async function markRefundSucceeded(
  refundId: string,
  patch: {
    providerRefundId?: string | null;
    stripeRefundId?: string | null;
    responsePayload?: Prisma.InputJsonObject;
  },
) {
  const prisma = getPrisma();
  return prisma.$transaction(async (tx) => {
    const refund = await tx.refund.update({
      where: { id: refundId },
      data: {
        status: "succeeded",
        providerRefundId: patch.providerRefundId ?? undefined,
        stripeRefundId: patch.stripeRefundId ?? undefined,
        responsePayload: patch.responsePayload,
        processedAt: new Date(),
      },
      include: { items: true },
    });
    await applyRefundSideEffects(tx, refund.id);
    await markDigitalUnlocksForRefundReview(tx, refund.id);
    return refund;
  });
}

export async function handleProviderRefundSucceeded(input: {
  providerRefundId: string;
  paymentIntentId?: string;
  chargeId?: string;
  amountCents: number;
  currency: string;
  payload: Prisma.InputJsonObject;
}) {
  if (!hasDatabaseUrl()) return { handled: false };
  const prisma = getPrisma();
  const existing = await prisma.refund.findFirst({
    where: {
      OR: [
        { providerRefundId: input.providerRefundId },
        { stripeRefundId: input.providerRefundId },
      ],
    },
  });
  if (existing) {
    await markRefundSucceeded(existing.id, { providerRefundId: input.providerRefundId, stripeRefundId: input.providerRefundId, responsePayload: input.payload });
    return { handled: true, refundId: existing.id };
  }

  const order = await prisma.order.findFirst({
    where: {
      OR: [
        { stripePaymentIntentId: input.paymentIntentId ?? "" },
        { payments: { some: { stripePaymentIntentId: input.paymentIntentId ?? "" } } },
      ],
    },
    include: { items: true, refunds: true },
  });
  if (!order) return { handled: false };

  const refund = await prisma.refund.create({
    data: {
      shopId: order.shopId,
      orderId: order.id,
      provider: "stripe",
      providerRefundId: input.providerRefundId,
      stripeRefundId: input.providerRefundId,
      stripePaymentIntentId: input.paymentIntentId,
      stripeChargeId: input.chargeId,
      type: input.amountCents >= order.totalCents ? "full" : "partial",
      status: "processing",
      amountCents: input.amountCents,
      currency: input.currency.toUpperCase(),
      reason: "provider_initiated",
      responsePayload: input.payload,
      metadata: { providerInitiated: true },
    },
  });
  await markRefundSucceeded(refund.id, { providerRefundId: input.providerRefundId, stripeRefundId: input.providerRefundId, responsePayload: input.payload });
  return { handled: true, refundId: refund.id };
}

async function loadRefundableOrder(orderId: string) {
  if (!hasDatabaseUrl()) throw new RefundConfigurationError("DATABASE_URL is required for refunds.");
  const order = await getPrisma().order.findUnique({
    where: { id: orderId },
    include: {
      items: true,
      refunds: { where: { status: { in: ["requested", "approved", "processing", "succeeded", "partially_succeeded"] } } },
      printfulOrders: true,
    },
  });
  if (!order) throw new RefundError("Order not found.", 404);
  return order;
}
