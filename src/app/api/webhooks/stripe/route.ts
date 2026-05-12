import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getPrisma, hasDatabaseUrl } from "@/lib/db/prisma";
import { canCompletePaidOrder } from "@/lib/orders/payment-completion-gate";
import { handleProviderRefundSucceeded } from "@/lib/refunds/refund-service";
import { markWebhookFailed, markWebhookProcessed, recordWebhookReceived } from "@/lib/webhooks/webhook-events";
import { completePaidOrder } from "@/workflows/orders/complete-paid-order";

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
    const eventType = event.type as string;

    if (eventType === "checkout.session.completed") {
      const session = event.data.object as {
        id: string;
        metadata?: Record<string, string>;
        payment_intent?: string | { id: string } | null;
        amount_total?: number | null;
        currency?: string | null;
        mode?: string | null;
        subscription?: string | { id: string } | null;
        customer?: string | { id: string } | null;
        customer_details?: { email?: string | null; name?: string | null; phone?: string | null; address?: { line1?: string | null; line2?: string | null; city?: string | null; state?: string | null; postal_code?: string | null; country?: string | null } | null } | null;
        customer_email?: string | null;
        shipping_details?: { name?: string | null; address?: { line1?: string | null; line2?: string | null; city?: string | null; state?: string | null; postal_code?: string | null; country?: string | null } | null } | null;
      };
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
            shippingAddress: normalizeStripeAddress(session),
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
            mode: session.mode === "subscription" ? "subscription" : "payment",
            status: "paid",
            amountCents: session.amount_total ?? 0,
            currency: session.currency?.toUpperCase() ?? "USD",
            stripeCheckoutSessionId: session.id,
            stripePaymentIntentId: paymentIntentId,
            stripeSubscriptionId: typeof session.subscription === "string" ? session.subscription : session.subscription?.id,
            stripeCustomerId: typeof session.customer === "string" ? session.customer : session.customer?.id,
            idempotencyKey: `stripe:checkout.session.completed:${session.id}`,
          },
        });

        if (completion.ok) {
          await completePaidOrder(orderId);
        }
      }

      await markWebhookProcessed("stripe", event.id);
    }

    if (eventType === "charge.refunded" || eventType === "refund.updated" || eventType === "charge.refund.updated") {
      const providerObject = event.data.object as {
        id?: string;
        object?: string;
        amount?: number;
        amount_refunded?: number;
        currency?: string;
        payment_intent?: string | null;
        charge?: string | null;
        status?: string;
        refunds?: { data?: Array<{ id?: string; amount?: number; currency?: string; payment_intent?: string | null; charge?: string | null; status?: string }> };
      };
      const refundObject = providerObject.object === "refund" ? providerObject : providerObject.refunds?.data?.[0];
      const providerRefundId = refundObject?.id ?? providerObject.id;
      const paymentIntentId = refundObject?.payment_intent ?? providerObject.payment_intent ?? undefined;
      const chargeId = refundObject?.charge ?? providerObject.charge ?? (providerObject.object === "charge" ? providerObject.id : undefined);
      const recorded = await recordWebhookReceived({
        provider: "stripe",
        eventId: event.id,
        eventType,
        payload: body,
      });

      if (recorded.duplicate) {
        return NextResponse.json({ received: true, duplicate: true });
      }

      if (providerRefundId && hasDatabaseUrl()) {
        await handleProviderRefundSucceeded({
          providerRefundId,
          paymentIntentId: paymentIntentId ?? undefined,
          chargeId: chargeId ?? undefined,
          amountCents: refundObject?.amount ?? providerObject.amount_refunded ?? providerObject.amount ?? 0,
          currency: refundObject?.currency ?? providerObject.currency ?? "usd",
          payload: providerObject,
        });
      }

      await markWebhookProcessed("stripe", event.id);
    }

    if (eventType === "payment_intent.canceled" || eventType === "dispute.created" || eventType === "dispute.closed") {
      const providerObject = event.data.object as { id?: string; object?: string; status?: string; payment_intent?: string | null };
      const recorded = await recordWebhookReceived({
        provider: "stripe",
        eventId: event.id,
        eventType,
        payload: body,
      });
      if (recorded.duplicate) {
        return NextResponse.json({ received: true, duplicate: true });
      }
      if (hasDatabaseUrl()) {
        await getPrisma().order.updateMany({
          where: { stripePaymentIntentId: providerObject.payment_intent ?? providerObject.id ?? "" },
          data:
            eventType === "dispute.created"
              ? { refundStatus: "chargeback_opened" }
              : eventType === "payment_intent.canceled"
                ? { paymentStatus: "cancelled" }
                : {},
        });
      }
      await markWebhookProcessed("stripe", event.id);
    }

    if (eventType === "customer.subscription.updated" || eventType === "customer.subscription.deleted") {
      const subscription = event.data.object as {
        id?: string;
        status?: string;
        cancel_at_period_end?: boolean;
        canceled_at?: number | null;
      };
      const stripeSubscriptionId = typeof subscription.id === "string" ? subscription.id : undefined;
      const shopId = undefined;
      const recorded = await recordWebhookReceived({
        provider: "stripe",
        eventId: event.id,
        eventType,
        payload: body,
        shopId,
      });

      if (recorded.duplicate) {
        return NextResponse.json({ received: true, duplicate: true });
      }

      if (stripeSubscriptionId && hasDatabaseUrl()) {
        const status = mapStripeSubscriptionStatus(subscription.status);
        await getPrisma().customerSubscription.updateMany({
          where: { stripeSubscriptionId },
          data: {
            status,
            cancelAtPeriodEnd: Boolean(subscription.cancel_at_period_end),
            canceledAt: subscription.canceled_at ? new Date(subscription.canceled_at * 1000) : undefined,
          },
        });

        if (status === "canceled" || status === "unpaid") {
          const subscriptions = await getPrisma().customerSubscription.findMany({ where: { stripeSubscriptionId }, select: { id: true } });
          await getPrisma().subscriptionEntitlement.updateMany({
            where: { customerSubscriptionId: { in: subscriptions.map((item) => item.id) } },
            data: { status: "inactive" },
          });
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

function normalizeStripeAddress(session: {
  shipping_details?: { name?: string | null; address?: { line1?: string | null; line2?: string | null; city?: string | null; state?: string | null; postal_code?: string | null; country?: string | null } | null } | null;
  customer_details?: { name?: string | null; phone?: string | null; address?: { line1?: string | null; line2?: string | null; city?: string | null; state?: string | null; postal_code?: string | null; country?: string | null } | null } | null;
}) {
  const address = session.shipping_details?.address ?? session.customer_details?.address;

  if (!address) {
    return undefined;
  }

  return {
    name: session.shipping_details?.name ?? session.customer_details?.name ?? null,
    phone: session.customer_details?.phone ?? null,
    line1: address.line1 ?? null,
    line2: address.line2 ?? null,
    city: address.city ?? null,
    state: address.state ?? null,
    postalCode: address.postal_code ?? null,
    country: address.country ?? null,
    source: "stripe_checkout",
  };
}

function mapStripeSubscriptionStatus(status?: string) {
  if (status === "trialing") return "trialing";
  if (status === "active") return "active";
  if (status === "past_due") return "past_due";
  if (status === "canceled") return "canceled";
  if (status === "unpaid") return "unpaid";
  if (status === "paused") return "paused";
  return "incomplete";
}
