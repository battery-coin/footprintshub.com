import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { calculateCommissionsForOrder } from "@/lib/affiliate/order-commission";
import { getPrisma, hasDatabaseUrl } from "@/lib/db/prisma";

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

      if (orderId && hasDatabaseUrl()) {
        const paymentIntentId =
          typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id;

        await getPrisma().order.update({
          where: { id: orderId },
          data: {
            status: "paid",
            paymentStatus: "paid",
            stripeCheckoutSessionId: session.id,
            stripePaymentIntentId: paymentIntentId,
            customerEmail: session.customer_details?.email ?? session.customer_email ?? undefined,
          },
        });

        await calculateCommissionsForOrder(orderId);
      }
    }

    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json({ error: "Stripe webhook handler failed." }, { status: 500 });
  }
}
