import Link from "next/link";

export default function CryptoCheckoutCancelPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">Crypto checkout</p>
      <h1 className="mt-3 text-4xl font-semibold">Crypto payment was not completed</h1>
      <p className="mt-4 text-sm leading-7 text-black/60">
        No order is marked paid from this page. You can return to the cart and choose card checkout or try crypto checkout again.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/cart" className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white">
          Return to cart
        </Link>
        <Link href="/checkout" className="rounded-md border border-black/10 px-4 py-2 text-sm font-medium">
          Back to checkout
        </Link>
      </div>
    </main>
  );
}
