import Link from "next/link";

export default function CryptoCheckoutSuccessPage({
  searchParams,
}: {
  searchParams?: Promise<{ paymentSessionId?: string }>;
}) {
  void searchParams;
  return (
    <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">Crypto checkout</p>
      <h1 className="mt-3 text-4xl font-semibold">Payment confirmation is pending</h1>
      <p className="mt-4 text-sm leading-7 text-black/60">
        Coinbase returned you to FootprintsHub. This page does not mark an order paid. The order updates after the server verifies Coinbase payment status through a signed webhook or provider status check.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/account/orders" className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white">
          View orders
        </Link>
        <Link href="/shop" className="rounded-md border border-black/10 px-4 py-2 text-sm font-medium">
          Continue shopping
        </Link>
      </div>
    </main>
  );
}
