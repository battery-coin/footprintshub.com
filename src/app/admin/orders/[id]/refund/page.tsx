import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { formatMoney } from "@/lib/catalog/products";
import { getPrisma, hasDatabaseUrl } from "@/lib/db/prisma";

export default async function AdminOrderRefundPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!hasDatabaseUrl()) notFound();
  const order = await getPrisma().order.findUnique({
    where: { id },
    include: { items: true, refunds: true, printfulOrders: true },
  });
  if (!order) notFound();
  const alreadyRefunded = order.refunds.filter((refund) => ["requested", "approved", "processing", "succeeded", "partially_succeeded"].includes(refund.status)).reduce((total, refund) => total + refund.amountCents, 0);
  const refundableCents = Math.max(0, order.totalCents - alreadyRefunded);

  return (
    <AdminShell requiredPermission="canManageRefunds">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">Create refund</p>
        <h1 className="mt-3 text-3xl font-semibold">Order {order.orderNumber}</h1>
        <p className="mt-3 text-sm text-black/60">Refundable amount: {formatMoney(refundableCents, order.currency)}</p>
        <form className="mt-6 grid gap-4 rounded-lg border border-black/10 bg-white p-5" action="/api/admin/refunds" method="post">
          <input type="hidden" name="orderId" value={order.id} />
          <p className="text-sm leading-6 text-black/60">Use the admin refunds API for execution. This page documents the payload fields and item IDs for operators until server actions are added.</p>
          <div className="grid gap-2 text-sm">
            {order.items.map((item) => (
              <div key={item.id} className="rounded-md bg-black/[0.03] p-3">
                <p className="font-medium">{item.titleSnapshot}</p>
                <p className="text-black/55">Item ID: {item.id} | Remaining qty: {item.quantity - item.refundedQuantity} | Remaining amount: {formatMoney(item.totalCents - item.refundedAmountCents, order.currency)}</p>
              </div>
            ))}
          </div>
          <pre className="overflow-auto rounded-md bg-black p-4 text-xs text-white">{JSON.stringify({ orderId: order.id, type: "partial", provider: "stripe", items: [{ orderItemId: order.items[0]?.id ?? "ORDER_ITEM_ID", quantity: 1, restock: false }], reason: "customer_request", processNow: true }, null, 2)}</pre>
        </form>
      </div>
    </AdminShell>
  );
}
