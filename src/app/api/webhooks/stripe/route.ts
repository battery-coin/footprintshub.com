import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { calculateCommissionsForOrder } from "@/lib/affiliate/order-commission";
import { getPrisma, hasDatabaseUrl } from "@/lib/db/prisma";
import { deductInventoryForPaidOrder } from "@/lib/inventory/inventory-service";
import { canCompletePaidOrder } from "@/lib/orders/payment-completion-gate";
import { markWebhookFailed, markWebhookProcessed, recordWebhookReceived } from "@/lib/webhooks/webhook-events";

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return NextResponse.json({ error: "Stripe webhook secret is not configured." }, { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing Stripe signature." }, { status: 400 });
  }

  const body = await request.text();

  let event;

  try {
    event = getStripe().webhooks.constructEvent(body, signature, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Invalid Stripe webhook signature." }, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const orderId = typeof session.metadata?.orderId === "string" ? session.metadata.orderId : undefined;
      const shopId = typeof session.metadata?.shopId === "string" ? session.metadata.shopId : undefined;
      const recorded = await recordWebhookReceived({
        provider: "stripe",
        eventId: event.id,
        eventType: event.type,
        payload: body,
        shopId,
        orderId,
      });

      if (recorded.duplicate) {
        return NextResponse.json({ received: true, duplicate: true });
      }

      if (orderId && hasDatabaseUrl()) {
        const paymentIntentId =
          typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id;

        const prisma = getPrisma();
        const composition = await prisma.orderPaymentComposition.findFirst({ where: { orderId } });
        const fiatPaidCents = session.amount_total ?? 0;

        const updatedComposition = composition
          ? await prisma.orderPaymentComposition.update({
              where: { id: composition.id },
              data: {
                fiatPaidCents,
                status:
                  fiatPaidCents >= composition.fiatRequiredCents && Number(composition.tokenRequiredUnits ?? 0) <= Number(composition.tokenPaidUnits ?? 0)
                    ? "paid"
                    : "partially_paid",
              },
            })
          : null;
        const completion = canCompletePaidOrder(updatedComposition ?? undefined);
        const paidOrder = await prisma.order.update({
          where: { id: orderId },
          data: {
            status: completion.ok ? "paid" : "awaiting_payment",
            paymentStatus: completion.ok ? "paid" : "fiat_paid_token_pending",
            stripeCheckoutSessionId: session.id,
            stripePaymentIntentId: paymentIntentId,
            customerEmail: session.customer_details?.email ?? session.customer_email ?? undefined,
          },
          select: {
            id: true,
            shopId: true,
          },
        });

        await prisma.payment.upsert({
          where: {
            idempotencyKey: `stripe:checkout.session.completed:${session.id}`,
          },
          update: {
            status: "paid",
            stripePaymentIntentId: paymentIntentId,
          },
          create: {
            shopId: paidOrder.shopId,
            orderId,
            provider: "stripe",
            paymentPart: "fiat",
            status: "paid",
            amountCents: session.amount_total ?? 0,
            currency: session.currency?.toUpperCase() ?? "USD",
            stripeCheckoutSessionId: session.id,
            stripePaymentIntentId: paymentIntentId,
            idempotencyKey: `stripe:checkout.session.completed:${session.id}`,
          },
        });

        if (completion.ok) {
          await deductInventoryForPaidOrder(orderId);
          await calculateCommissionsForOrder(orderId);
        }
      }

      await markWebhookProcessed("stripe", event.id);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    await markWebhookFailed("stripe", event.id, error);
    return NextResponse.json({ error: "Stripe webhook handler failed." }, { status: 500 });
  }
}
