import { ButtonLink } from "@/components/ui/button";

export default function CheckoutCancelPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:px-8">
      <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">Checkout</p>
      <h1 className="mt-3 text-4xl font-semibold">Checkout cancelled</h1>
      <p className="mt-4 text-lg leading-8 text-black/60">Your cart is still available in this browser.</p>
      <ButtonLink href="/cart" className="mt-8">
        Return to cart
      </ButtonLink>
    </main>
  );
}
