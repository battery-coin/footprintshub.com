import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import type {
  CreatePaymentSessionInput,
  NormalizedPaymentEvent,
  PaymentProviderAdapter,
  PaymentSessionResult,
} from "../types";

function mapStripeSession(session: Stripe.Checkout.Session): PaymentSessionResult {
  const status = session.payment_status === "paid" ? "captured" : "pending";

  return {
    provider: "stripe_checkout",
    providerSessionId: session.id,
    providerPaymentIntentId:
      typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id,
    status,
    redirectUrl: session.url ?? undefined,
    metadata: session.metadata ?? undefined,
  };
}

export function normalizeStripeEvent(event: Stripe.Event): NormalizedPaymentEvent {
  const object = event.data.object as Stripe.Checkout.Session | Stripe.PaymentIntent | Stripe.Charge;

  if (event.type.startsWith("checkout.session.")) {
    const session = object as Stripe.Checkout.Session;
    return {
      provider: "stripe_checkout",
      eventId: event.id,
      eventType: event.type,
      rawType: event.type,
      status: session.payment_status === "paid" ? "captured" : "pending",
      orderId: session.metadata?.orderId,
      cartId: session.metadata?.cartId,
      shopId: session.metadata?.shopId,
      providerSessionId: session.id,
      providerPaymentIntentId:
        typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id,
    };
  }

  return {
    provider: "stripe_checkout",
    eventId: event.id,
    eventType: event.type,
    rawType: event.type,
    status: event.type.includes("refund") ? "refunded" : "pending",
  };
}

export function createStripeCheckoutProvider(): PaymentProviderAdapter {
  return {
    code: "stripe_checkout",
    async createSession(input: CreatePaymentSessionInput) {
      const stripe = getStripe();
      const session = await stripe.checkout.sessions.create(
        {
          mode: "payment",
          success_url: input.successUrl,
          cancel_url: input.cancelUrl,
          line_items: input.lineItems.map((item) => ({
            quantity: item.quantity,
            price_data: {
              currency: item.currency.toLowerCase(),
              unit_amount: item.unitAmountCents,
              product_data: {
                name: item.name,
              },
            },
          })),
          metadata: {
            shopId: input.shopId,
            ...(input.cartId ? { cartId: input.cartId } : {}),
            ...(input.orderId ? { orderId: input.orderId } : {}),
            ...input.metadata,
          },
        },
        input.idempotencyKey ? { idempotencyKey: input.idempotencyKey } : undefined,
      );

      return mapStripeSession(session);
    },
    async retrieveSession(providerSessionId: string) {
      const session = await getStripe().checkout.sessions.retrieve(providerSessionId);
      return mapStripeSession(session);
    },
    async capturePayment(input) {
      const paymentIntent = await getStripe().paymentIntents.capture(input.providerPaymentIntentId, {
        amount_to_capture: input.amountCents,
      });

      return {
        provider: "stripe_checkout",
        providerSessionId: paymentIntent.id,
        providerPaymentIntentId: paymentIntent.id,
        status: paymentIntent.status === "succeeded" ? "captured" : "authorized",
      };
    },
    async refundPayment(input) {
      const refund = await getStripe().refunds.create({
        payment_intent: input.providerPaymentIntentId,
        amount: input.amountCents,
        reason: input.reason === "fraud" ? "fraudulent" : "requested_by_customer",
      });

      return {
        provider: "stripe_checkout",
        providerSessionId: refund.id,
        providerPaymentIntentId:
          typeof refund.payment_intent === "string" ? refund.payment_intent : refund.payment_intent?.id,
        status: "refunded",
      };
    },
    handleWebhook(rawBody: string | Buffer, signature: string) {
      const secret = process.env.STRIPE_WEBHOOK_SECRET;

      if (!secret) {
        throw new Error("STRIPE_WEBHOOK_SECRET is not configured.");
      }

      const event = getStripe().webhooks.constructEvent(rawBody, signature, secret);
      return normalizeStripeEvent(event);
    },
  };
}
