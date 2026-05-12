import Link from "next/link";
import { AdminShell } from "@/components/admin/admin-shell";
import { EmptyState } from "@/components/ui/empty-state";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatMoney } from "@/lib/catalog/products";
import { getPrisma, hasDatabaseUrl } from "@/lib/db/prisma";

export default async function AdminRefundsPage() {
  const refunds = await getRefunds();

  return (
    <AdminShell requiredPermission="canManageRefunds">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">Refunds</p>
        <h1 className="mt-3 text-4xl font-semibold">Refund review</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-black/60">
          Refunds coordinate Stripe, inventory restock, Printful review, digital access review, and affiliate commission reversal.
        </p>

        <section className="mt-8 rounded-lg border border-black/10 bg-white">
          {refunds.length ? (
            <div className="divide-y divide-black/10">
              {refunds.map((refund) => (
                <Link key={refund.id} href={`/admin/refunds/${refund.id}`} className="grid gap-3 p-4 text-sm md:grid-cols-[1fr_130px_140px_150px]">
                  <span>
                    <span className="font-semibold">{refund.order.orderNumber}</span>
                    <span className="block text-black/50">{refund.reason ?? "No reason"}</span>
                  </span>
                  <span>{formatMoney(refund.amountCents, refund.currency)}</span>
                  <StatusBadge tone={refund.status === "succeeded" ? "good" : refund.status === "failed" ? "danger" : "warn"}>{refund.status}</StatusBadge>
                  <span className="text-black/50">{refund.createdAt.toLocaleDateString()}</span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-6">
              <EmptyState
                title="No refund requests yet"
                description="Create a refund from an order detail page. Refund execution is server-side and audited."
                actionHref="/admin/orders"
                actionLabel="Review orders"
              />
            </div>
          )}
        </section>
      </div>
    </AdminShell>
  );
}

async function getRefunds() {
  if (!hasDatabaseUrl()) return [];
  try {
    return await getPrisma().refund.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
      include: { order: { select: { orderNumber: true } } },
    });
  } catch {
    return [];
  }
}
