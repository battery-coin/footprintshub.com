import { AdminShell } from "@/components/admin/admin-shell";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatMoney } from "@/lib/catalog/products";
import { getPrintfulOrderRows } from "@/lib/printful/printful-mapping-service";

export default async function AdminPrintfulOrdersPage() {
  const rows = await getPrintfulOrderRows();

  return (
    <AdminShell requiredPermission="canManagePrintful">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">Printful</p>
        <h1 className="mt-3 text-4xl font-semibold">Fulfillment orders</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-black/60">
          Stripe-paid orders create Printful records with an idempotency key so webhook retries do not create duplicate provider orders.
        </p>

        <div className="mt-8 overflow-x-auto rounded-lg border border-black/10 bg-white">
          <table className="w-full min-w-[920px] text-left text-sm">
            <thead className="bg-black/[0.03]">
              <tr>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Printful ID</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Submitted</th>
                <th className="px-4 py-3">Last synced</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-t border-black/5">
                  <td className="px-4 py-3 font-medium">{row.order.orderNumber}</td>
                  <td className="px-4 py-3 text-black/60">{row.order.customerEmail ?? "unknown"}</td>
                  <td className="px-4 py-3 text-black/60">{row.printfulOrderId ?? "not submitted"}</td>
                  <td className="px-4 py-3"><StatusBadge tone={row.status === "failed" ? "danger" : row.status === "fulfilled" ? "good" : "warn"}>{row.status}</StatusBadge></td>
                  <td className="px-4 py-3 text-black/60">{formatMoney(row.order.totalCents, row.order.currency)}</td>
                  <td className="px-4 py-3 text-black/60">{row.submittedAt ? row.submittedAt.toLocaleString() : "not yet"}</td>
                  <td className="px-4 py-3 text-black/60">{row.lastSyncedAt ? row.lastSyncedAt.toLocaleString() : "never"}</td>
                </tr>
              ))}
              {!rows.length ? (
                <tr>
                  <td className="px-4 py-8 text-center text-black/55" colSpan={7}>No Printful order records yet.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  );
}
