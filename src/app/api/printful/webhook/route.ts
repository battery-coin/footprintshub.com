import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { getPrisma, hasDatabaseUrl } from "@/lib/db/prisma";

export async function POST(request: Request) {
  const configuredSecret = process.env.PRINTFUL_WEBHOOK_SECRET;

  if (configuredSecret) {
    const providedSecret = request.headers.get("x-footprintshub-printful-secret");
    if (providedSecret !== configuredSecret) {
      return NextResponse.json({ error: "Invalid Printful webhook secret." }, { status: 401 });
    }
  }

  const event = await request.json().catch(() => null);
  const eventObject = event && typeof event === "object" && !Array.isArray(event) ? (event as Record<string, unknown>) : {};
  const eventType = typeof eventObject.type === "string" ? eventObject.type : "unknown";

  if (hasDatabaseUrl()) {
    await getPrisma().printfulWebhookEvent.create({
      data: {
        type: eventType,
        rawPayload: eventObject as Prisma.InputJsonObject,
        signature: request.headers.get("x-printful-signature") ?? request.headers.get("x-footprintshub-printful-secret"),
        status: "pending",
      },
    });
  }

  return NextResponse.json({
    ok: true,
    stored: hasDatabaseUrl(),
    message: "Printful webhook received. Status processing is stored for admin review; signature verification depends on PRINTFUL_WEBHOOK_SECRET setup.",
    eventType,
  });
}
