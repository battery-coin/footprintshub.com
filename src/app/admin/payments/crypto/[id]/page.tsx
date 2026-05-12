import { notFound } from "next/navigation";
import { getPrisma, hasDatabaseUrl } from "@/lib/db/prisma";
import { formatMoney } from "@/lib/catalog/products";

export default async function AdminCryptoPaymentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!hasDatabaseUrl()) {
    notFound();
  }
  const { id } = await params;
  const payment = await getPrisma().cryptoPayment.findUnique({
    where: { id },
    include: {
      order: { select: { orderNumber: true, customerEmail: true, paymentStatus: true, fulfillmentStatus: true } },
      paymentSession: true,
    },
  });
  if (!payment) {
    notFound();
  }

  return (
    <main className="space-y-6">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">Crypto payment</p>
        <h1 className="mt-2 text-3xl font-semibold">{payment.order.orderNumber}</h1>
        <p className="mt-2 text-sm leading-6 text-black/60">
          Provider IDs and payload summaries are visible here. Coinbase Business secrets are never shown in the admin UI.
        </p>
      </div>

      <section className="grid gap-4 md:grid-cols-2">
        {[
          ["Amount", formatMoney(payment.amountCents, payment.currency)],
          ["Payment status", payment.status],
          ["Order payment", payment.order.paymentStatus],
          ["Fulfillment", payment.order.fulfillmentStatus],
          ["Provider checkout ID", payment.providerCheckoutId],
          ["Session ID", payment.paymentSessionId ?? "none"],
        ].map(([label, value]) => (
          <div key={label} className="rounded-lg border border-black/10 bg-white p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-black/45">{label}</p>
            <p className="mt-2 break-all text-sm font-medium">{value}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
