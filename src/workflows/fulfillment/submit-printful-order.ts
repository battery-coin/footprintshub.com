import { createHash } from "crypto";
import type { Prisma } from "@prisma/client";
import { buildPrintfulOrderPayload, getPrintfulEligibleItems } from "@/lib/printful/build-printful-order-payload";
import { createPrintfulOrder, getPrintfulOrder } from "@/lib/printful/printful-client";
import { getSafePrintfulError } from "@/lib/printful/printful-errors";
import { getPrisma, hasDatabaseUrl } from "@/lib/db/prisma";

type SubmitPrintfulOptions = {
  forceRetry?: boolean;
};

export async function submitPrintfulOrderForPaidOrder(orderId: string, options: SubmitPrintfulOptions = {}) {
  if (!hasDatabaseUrl()) {
    return { ok: false, skipped: true, reason: "DATABASE_URL is not configured." };
  }

  const prisma = getPrisma();
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      shop: { select: { slug: true } },
      items: {
        include: {
          product: true,
          variant: true,
        },
      },
    },
  });

  if (!order) {
    return { ok: false, reason: "Order not found." };
  }

  if (order.paymentStatus !== "paid") {
    return { ok: false, skipped: true, reason: "Order is not paid." };
  }

  const printfulItems = getPrintfulEligibleItems(order);
  if (!printfulItems.length) {
    return { ok: true, skipped: true, reason: "Order has no Printful items." };
  }

  const idempotencyKey = `printful:order:${order.id}`;
  const existing = await prisma.printfulOrder.findUnique({ where: { idempotencyKey } });

  if (existing?.printfulOrderId && !options.forceRetry) {
    return { ok: true, skipped: true, printfulOrderId: existing.printfulOrderId };
  }

  try {
    const payload = buildPrintfulOrderPayload(order);
    const confirmOrder = process.env.PRINTFUL_CONFIRM_ORDERS === "true";
    const requestHash = hashJson(payload);
    const existingFulfillment = existing?.fulfillmentId
      ? await prisma.fulfillment.findUnique({ where: { id: existing.fulfillmentId } })
      : null;
    const fulfillment =
      existingFulfillment ??
      (await prisma.fulfillment.create({
        data: {
          shopId: order.shopId,
          orderId: order.id,
          provider: "printful",
          status: "pending",
          providerExternalId: payload.external_id,
          metadata: { idempotencyKey },
          items: {
            create: printfulItems.map((item) => ({
              orderItemId: item.id,
              quantity: item.quantity,
            })),
          },
        },
      }));

    const printfulOrder = await prisma.printfulOrder.upsert({
      where: { idempotencyKey },
      update: {
          fulfillmentId: fulfillment.id,
        externalOrderId: payload.external_id,
        status: "pending",
        requestHash,
        recipientSnapshot: payload.recipient as Prisma.InputJsonObject,
        itemsSnapshot: payload.items as Prisma.InputJsonArray,
        shippingSnapshot: payload.shipping ? ({ shipping: payload.shipping } as Prisma.InputJsonObject) : undefined,
        requestPayload: payload as Prisma.InputJsonObject,
        error: null,
        errorPayload: undefined,
        confirmOrder,
      },
      create: {
        shopId: order.shopId,
        orderId: order.id,
        fulfillmentId: fulfillment.id,
        externalOrderId: payload.external_id,
        status: "pending",
        idempotencyKey,
        requestHash,
        recipientSnapshot: payload.recipient as Prisma.InputJsonObject,
        itemsSnapshot: payload.items as Prisma.InputJsonArray,
        shippingSnapshot: payload.shipping ? ({ shipping: payload.shipping } as Prisma.InputJsonObject) : undefined,
        requestPayload: payload as Prisma.InputJsonObject,
        confirmOrder,
      },
    });

    await prisma.printfulOrderItem.createMany({
      data: printfulItems.map((item) => ({
        shopId: order.shopId,
        printfulOrderId: printfulOrder.id,
        orderItemId: item.id,
        productId: item.productId,
        variantId: item.variantId,
        printfulVariantId: item.printfulVariantId ?? item.variant?.printfulVariantId ?? null,
        printfulSyncVariantId: item.printfulSyncVariantId ?? item.variant?.printfulSyncVariantId ?? null,
        quantity: item.quantity,
        status: "pending",
      })),
      skipDuplicates: true,
    });

    const response = await createPrintfulOrder(payload, { confirm: confirmOrder, updateExisting: true });
    const providerStatus = mapPrintfulStatus(response.status);

    await prisma.$transaction([
      prisma.printfulOrder.update({
        where: { id: printfulOrder.id },
        data: {
          printfulOrderId: response.id ? String(response.id) : printfulOrder.printfulOrderId,
          status: providerStatus.printful,
          responsePayload: response as Prisma.InputJsonObject,
          submittedAt: new Date(),
          lastSyncedAt: new Date(),
        },
      }),
      prisma.fulfillment.update({
        where: { id: fulfillment.id },
        data: {
          status: providerStatus.fulfillment,
          providerOrderId: response.id ? String(response.id) : undefined,
          submittedAt: new Date(),
          metadata: {
            idempotencyKey,
            printfulStatus: response.status ?? null,
          },
        },
      }),
      prisma.order.update({
        where: { id: order.id },
        data: { fulfillmentStatus: providerStatus.orderFulfillment },
      }),
      ...printfulItems.map((item) =>
        prisma.orderItem.update({
          where: { id: item.id },
          data: {
            printfulStatus: response.status ?? "submitted",
            fulfillmentProvider: "printful",
          },
        }),
      ),
    ]);

    return { ok: true, printfulOrderId: response.id ? String(response.id) : undefined };
  } catch (error) {
    const safeError = getSafePrintfulError(error);
    const failure = await prisma.printfulOrder.upsert({
      where: { idempotencyKey },
      update: {
        status: "failed",
        error: safeError.message,
        errorPayload: safeError as Prisma.InputJsonObject,
        lastSyncedAt: new Date(),
      },
      create: {
        shopId: order.shopId,
        orderId: order.id,
        status: "failed",
        idempotencyKey,
        error: safeError.message,
        errorPayload: safeError as Prisma.InputJsonObject,
        confirmOrder: process.env.PRINTFUL_CONFIRM_ORDERS === "true",
      },
    });

    if (failure.fulfillmentId) {
      await prisma.fulfillment.update({
        where: { id: failure.fulfillmentId },
        data: { status: "failed", errorMessage: safeError.message },
      });
    } else {
      const failedFulfillment = await prisma.fulfillment.create({
        data: {
          shopId: order.shopId,
          orderId: order.id,
          provider: "printful",
          status: "failed",
          errorMessage: safeError.message,
          metadata: { idempotencyKey },
        },
      });
      await prisma.printfulOrder.update({
        where: { id: failure.id },
        data: { fulfillmentId: failedFulfillment.id },
      });
    }

    await prisma.order.update({
      where: { id: order.id },
      data: { fulfillmentStatus: "unfulfilled" },
    });

    return { ok: false, reason: safeError.message };
  }
}

export async function refreshPrintfulOrderStatus(printfulOrderRecordId: string) {
  const prisma = getPrisma();
  const record = await prisma.printfulOrder.findUnique({ where: { id: printfulOrderRecordId } });

  if (!record?.printfulOrderId) {
    return { ok: false, reason: "Printful order ID is missing." };
  }

  const response = await getPrintfulOrder(record.printfulOrderId);
  const providerStatus = mapPrintfulStatus(response.status);

  await prisma.$transaction([
    prisma.printfulOrder.update({
      where: { id: record.id },
      data: {
        status: providerStatus.printful,
        responsePayload: response as Prisma.InputJsonObject,
        lastSyncedAt: new Date(),
      },
    }),
    ...(record.fulfillmentId
      ? [
          prisma.fulfillment.update({
            where: { id: record.fulfillmentId },
            data: { status: providerStatus.fulfillment },
          }),
        ]
      : []),
    prisma.order.update({
      where: { id: record.orderId },
      data: { fulfillmentStatus: providerStatus.orderFulfillment },
    }),
  ]);

  return { ok: true, status: response.status };
}

function mapPrintfulStatus(status?: string) {
  switch (status) {
    case "draft":
      return { printful: "draft" as const, fulfillment: "pending" as const, orderFulfillment: "unfulfilled" as const };
    case "inreview":
    case "pending":
    case "submitted":
      return { printful: "pending" as const, fulfillment: "submitted" as const, orderFulfillment: "unfulfilled" as const };
    case "inprocess":
      return { printful: "inprocess" as const, fulfillment: "in_production" as const, orderFulfillment: "unfulfilled" as const };
    case "partial":
      return { printful: "partial" as const, fulfillment: "shipped" as const, orderFulfillment: "partially_fulfilled" as const };
    case "fulfilled":
      return { printful: "fulfilled" as const, fulfillment: "fulfilled" as const, orderFulfillment: "fulfilled" as const };
    case "canceled":
    case "cancelled":
      return { printful: "cancelled" as const, fulfillment: "cancelled" as const, orderFulfillment: "unfulfilled" as const };
    case "failed":
    case "onhold":
      return { printful: "failed" as const, fulfillment: "failed" as const, orderFulfillment: "unfulfilled" as const };
    case "archived":
      return { printful: "archived" as const, fulfillment: "fulfilled" as const, orderFulfillment: "fulfilled" as const };
    default:
      return { printful: "submitted" as const, fulfillment: "submitted" as const, orderFulfillment: "unfulfilled" as const };
  }
}

function hashJson(value: unknown) {
  return createHash("sha256").update(JSON.stringify(value)).digest("hex");
}
