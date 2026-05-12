import { AdminShell } from "@/components/admin/admin-shell";
import { StatusBadge } from "@/components/ui/status-badge";
import { getPrisma, hasDatabaseUrl } from "@/lib/db/prisma";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = hasDatabaseUrl()
    ? await getPrisma().order.findUnique({
        where: { id },
        include: {
          items: true,
          fulfillments: true,
          printfulOrders: { include: { items: true }, orderBy: { updatedAt: "desc" } },
        },
      })
    : null;

  return (
    <AdminShell requiredPermission="canViewOrders">
      <h1 className="text-3xl font-semibold">Order {order?.orderNumber ?? id}</h1>
      {order ? (
        <div className="mt-6 grid gap-6">
          <section className="rounded-lg border border-black/10 bg-white p-6">
            <h2 className="text-xl font-semibold">Fulfillment</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <StatusBadge tone={order.fulfillmentStatus === "fulfilled" ? "good" : "warn"}>{order.fulfillmentStatus}</StatusBadge>
              <span className="text-sm text-black/60">{order.items.length} item(s)</span>
              <span className="text-sm text-black/60">{order.customerEmail ?? "No email captured"}</span>
            </div>
          </section>

          <section className="rounded-lg border border-black/10 bg-white p-6">
            <h2 className="text-xl font-semibold">Printful handoff</h2>
            <div className="mt-4 grid gap-3">
              {order.printfulOrders.map((printfulOrder) => (
                <div key={printfulOrder.id} className="rounded-md bg-black/[0.03] p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-medium">Printful order {printfulOrder.printfulOrderId ?? "not submitted"}</p>
                      <p className="mt-1 text-sm text-black/55">{printfulOrder.error ?? "No provider error recorded."}</p>
                    </div>
                    <StatusBadge tone={printfulOrder.status === "failed" ? "danger" : printfulOrder.status === "fulfilled" ? "good" : "warn"}>{printfulOrder.status}</StatusBadge>
                  </div>
                </div>
              ))}
              {!order.printfulOrders.length ? <p className="text-sm text-black/55">No Printful record exists for this order.</p> : null}
            </div>
          </section>
        </div>
      ) : (
        <div className="mt-6 rounded-lg border border-black/10 bg-white p-6">
          <p className="text-sm leading-6 text-black/60">Order not found or database unavailable.</p>
        </div>
      )}
    </AdminShell>
  );
}

