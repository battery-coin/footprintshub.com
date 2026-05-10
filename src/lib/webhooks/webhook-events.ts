import { createHash } from "node:crypto";
import { getPrisma, hasDatabaseUrl } from "@/lib/db/prisma";

export function hashWebhookPayload(payload: string) {
  return createHash("sha256").update(payload).digest("hex");
}

export async function recordWebhookReceived({
  provider,
  eventId,
  eventType,
  payload,
  shopId,
  orderId,
}: {
  provider: string;
  eventId: string;
  eventType: string;
  payload: string;
  shopId?: string;
  orderId?: string;
}) {
  if (!hasDatabaseUrl()) {
    return { duplicate: false, stored: false };
  }

  const prisma = getPrisma();
  const existing = await prisma.webhookEvent.findUnique({
    where: {
      provider_eventId: {
        provider,
        eventId,
      },
    },
  });

  if (existing?.status === "processed") {
    return { duplicate: true, stored: true };
  }

  const event = await prisma.webhookEvent.upsert({
    where: {
      provider_eventId: {
        provider,
        eventId,
      },
    },
    update: {
      status: "processing",
      orderId,
      shopId,
    },
    create: {
      provider,
      eventId,
      eventType,
      shopId,
      orderId,
      status: "processing",
      payloadHash: hashWebhookPayload(payload),
    },
  });

  return { duplicate: false, stored: true, id: event.id };
}

export async function markWebhookProcessed(provider: string, eventId: string) {
  if (!hasDatabaseUrl()) {
    return;
  }

  await getPrisma().webhookEvent.update({
    where: {
      provider_eventId: {
        provider,
        eventId,
      },
    },
    data: {
      status: "processed",
      processedAt: new Date(),
    },
  });
}

export async function markWebhookFailed(provider: string, eventId: string, error: unknown) {
  if (!hasDatabaseUrl()) {
    return;
  }

  await getPrisma().webhookEvent.update({
    where: {
      provider_eventId: {
        provider,
        eventId,
      },
    },
    data: {
      status: "failed",
      error: error instanceof Error ? error.message : "Unknown webhook handler failure.",
    },
  });
}
