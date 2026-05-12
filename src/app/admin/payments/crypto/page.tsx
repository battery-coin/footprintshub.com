import Link from "next/link";
import { getCoinbaseConfigStatus } from "@/lib/coinbase/coinbase-business-client";
import { getPrisma, hasDatabaseUrl } from "@/lib/db/prisma";
import { formatMoney } from "@/lib/catalog/products";

export default async function AdminCryptoPaymentsPage() {
  const config = getCoinbaseConfigStatus();
  const payments = await getRecentCryptoPayments();

  return (
    <main className="space-y-6">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">Crypto payments</p>
        <h1 className="mt-2 text-3xl font-semibold">Coinbase checkout sessions</h1>
        <p className="mt-2 text-sm leading-6 text-black/60">
          Server-created crypto checkouts are confirmed only by signed Coinbase webhooks or verified provider status checks.
        </p>
      </div>

      <section className="grid gap-3 md:grid-cols-4">
        {[
          ["Checkout enabled", config.enabled ? "yes" : "no"],
          ["API key", config.keyConfigured ? "configured" : "missing"],
          ["API secret", config.secretConfigured ? "configured" : "missing"],
          ["Webhook secret", config.webhookConfigured ? "configured" : "missing"],
        ].map(([label, value]) => (
          <div key={label} className="rounded-lg border border-black/10 bg-white p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-black/45">{label}</p>
            <p className="mt-2 text-lg font-semibold">{value}</p>
          </div>
        ))}
      </section>

      <section className="rounded-lg border border-black/10 bg-white">
        <div className="border-b border-black/10 p-4">
          <h2 className="text-xl font-semibold">Recent crypto payments</h2>
        </div>
        <div className="divide-y divide-black/10">
          {payments.length ? (
            payments.map((payment) => (
              <Link key={payment.id} href={`/admin/payments/crypto/${payment.id}`} className="grid gap-2 p-4 text-sm md:grid-cols-[1fr_140px_120px_160px]">
                <span>
                  <span className="font-medium">{payment.order.orderNumber}</span>
                  <span className="block text-black/50">{payment.order.customerEmail ?? "No customer email yet"}</span>
                </span>
                <span>{formatMoney(payment.amountCents, payment.currency)}</span>
                <span className="font-medium">{payment.status}</span>
                <span className="text-black/55">{payment.createdAt.toLocaleString()}</span>
              </Link>
            ))
          ) : (
            <p className="p-4 text-sm text-black/55">No Coinbase crypto payments have been created yet.</p>
          )}
        </div>
      </section>
    </main>
  );
}

async function getRecentCryptoPayments() {
  if (!hasDatabaseUrl()) return [];
  try {
    return await getPrisma().cryptoPayment.findMany({
      orderBy: { createdAt: "desc" },
      take: 25,
      include: { order: { select: { orderNumber: true, customerEmail: true } } },
    });
  } catch {
    return [];
  }
}
