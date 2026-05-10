import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";

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

  try {
    const event = getStripe().webhooks.constructEvent(body, signature, webhookSecret);

    if (event.type === "checkout.session.completed") {
      // Production persistence belongs here:
      // 1. Find/create Order by checkout session id.
      // 2. Mark paymentStatus/status paid.
      // 3. Create digital unlock rows where applicable.
      // 4. Notify Hero Studio through signed webhooks when integration is enabled.
    }

    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json({ error: "Invalid Stripe webhook signature." }, { status: 400 });
  }
}
