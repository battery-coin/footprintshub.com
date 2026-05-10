import { ButtonLink } from "@/components/ui/button";

export default function CheckoutSuccessPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:px-8">
      <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">Checkout</p>
      <h1 className="mt-3 text-4xl font-semibold">Order received</h1>
      <p className="mt-4 text-lg leading-8 text-black/60">
        Stripe returned a successful checkout. The webhook marks the order paid, then fulfillment, digital unlocks, inventory, and affiliate commission workflows can run from verified payment state.
      </p>
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <ButtonLink href="/shop">Keep shopping</ButtonLink>
        <ButtonLink href="/support" variant="secondary">Support center</ButtonLink>
      </div>
    </main>
  );
}
