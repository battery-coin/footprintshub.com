import Link from "next/link";

export default async function RequestReturnPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">Returns</p>
      <h1 className="mt-3 text-4xl font-semibold">Request a return</h1>
      <p className="mt-4 text-sm leading-7 text-black/60">
        Return requests require customer account verification or order lookup before they can be submitted. Customer-submitted requests never trigger Stripe refunds directly.
      </p>
      <div className="mt-6 rounded-lg border border-black/10 bg-white p-5">
        <p className="text-sm text-black/60">Order reference: {id}</p>
        <p className="mt-3 text-sm leading-6 text-black/60">
          Contact support with your order email, item, quantity, reason, and photos if the product arrived damaged or incorrect. Admin approval is required before refunds or store credit are processed.
        </p>
      </div>
      <Link href="/account/returns" className="mt-6 inline-block rounded-md bg-black px-4 py-2 text-sm font-medium text-white">
        View returns
      </Link>
    </main>
  );
}
