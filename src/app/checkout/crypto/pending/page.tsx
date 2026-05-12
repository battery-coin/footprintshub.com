import Link from "next/link";

export default function CryptoCheckoutPendingPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">Crypto checkout</p>
      <h1 className="mt-3 text-4xl font-semibold">Payment is being confirmed</h1>
      <p className="mt-4 text-sm leading-7 text-black/60">
        Crypto payments can take time to settle. FootprintsHub waits for verified Coinbase status before fulfillment, downloads, Printful, or affiliate commissions begin.
      </p>
      <Link href="/account/orders" className="mt-8 inline-block rounded-md bg-black px-4 py-2 text-sm font-medium text-white">
        View order status
      </Link>
    </main>
  );
}
