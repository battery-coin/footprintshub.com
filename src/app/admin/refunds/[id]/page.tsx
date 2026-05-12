import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatMoney } from "@/lib/catalog/products";
import { getPrisma, hasDatabaseUrl } from "@/lib/db/prisma";

export default async function AdminRefundDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!hasDatabaseUrl()) notFound();
  const refund = await getPrisma().refund.findUnique({
    where: { id },
    include: { order: { include: { items: true, printfulOrders: true } }, items: { include: { orderItem: true } } },
  });
  if (!refund) notFound();

  return (
    <AdminShell requiredPermission="canManageRefunds">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">Refund</p>
        <h1 className="mt-3 text-3xl font-semibold">{refund.order.orderNumber}</h1>
        <div className="mt-6 grid gap-4 md:grid-cols-4">
          <Metric label="Amount" value={formatMoney(refund.amountCents, refund.currency)} />
          <Metric label="Provider" value={refund.provider} />
          <Metric label="Type" value={refund.type} />
          <div className="rounded-lg border border-black/10 bg-white p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-black/45">Status</p>
            <div className="mt-2"><StatusBadge tone={refund.status === "succeeded" ? "good" : refund.status === "failed" ? "danger" : "warn"}>{refund.status}</StatusBadge></div>
          </div>
        </div>

        <section className="mt-6 rounded-lg border border-black/10 bg-white p-5">
          <h2 className="text-xl font-semibold">Refunded items</h2>
          <div className="mt-4 divide-y divide-black/10">
            {refund.items.map((item) => (
              <div key={item.id} className="grid gap-2 py-3 text-sm md:grid-cols-[1fr_90px_120px_100px]">
                <span>{item.orderItem.titleSnapshot}</span>
                <span>Qty {item.quantity}</span>
                <span>{formatMoney(item.amountCents, refund.currency)}</span>
                <span>{item.restock ? "Restock" : "No restock"}</span>
              </div>
            ))}
            {!refund.items.length ? <p className="py-3 text-sm text-black/55">No item-level rows were attached to this refund.</p> : null}
          </div>
        </section>

        {refund.order.printfulOrders.some((item) => ["submitted", "accepted", "inprocess", "fulfilled", "shipped", "delivered"].includes(item.status)) ? (
          <section className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-900">
            Printful fulfillment has already been submitted or progressed. Do not assume provider cancellation is possible; review fulfillment status before promising return timing.
          </section>
        ) : null}
      </div>
    </AdminShell>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-black/10 bg-white p-4">
      <p className="text-xs uppercase tracking-[0.16em] text-black/45">{label}</p>
      <p className="mt-2 break-all font-semibold">{value}</p>
    </div>
  );
}
