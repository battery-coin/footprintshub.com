import "server-only";
import { getStripe } from "@/lib/stripe";
import { RefundConfigurationError, RefundError } from "./refund-errors";

export async function processStripeRefundRequest(input: {
  refundId: string;
  orderId: string;
  amountCents: number;
  paymentIntentId?: string | null;
  chargeId?: string | null;
  reason?: string | null;
}) {
  if (!input.paymentIntentId && !input.chargeId) {
    throw new RefundError("Stripe refund requires a payment intent or charge ID.");
  }

  let stripe;
  try {
    stripe = getStripe();
  } catch {
    throw new RefundConfigurationError("Stripe is not configured for refund execution.");
  }

  return stripe.refunds.create(
    {
      amount: input.amountCents,
      ...(input.paymentIntentId ? { payment_intent: input.paymentIntentId } : { charge: input.chargeId! }),
      metadata: {
        refundId: input.refundId,
        orderId: input.orderId,
        source: "footprintshub-admin-refund",
      },
      reason: mapStripeReason(input.reason),
    },
    {
      idempotencyKey: `refund:${input.orderId}:${input.refundId}`,
    },
  );
}

function mapStripeReason(reason?: string | null) {
  if (reason === "fraudulent_order") return "fraudulent";
  if (reason === "duplicate_order") return "duplicate";
  if (reason === "customer_request") return "requested_by_customer";
  return undefined;
}
