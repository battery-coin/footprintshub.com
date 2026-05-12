import { AdminShell } from "@/components/admin/admin-shell";
import { EditRowLink } from "@/components/admin/edit-row-link";
import { SetupPanel } from "@/components/ui/setup-panel";
import { StatusBadge } from "@/components/ui/status-badge";
import { getPrintfulOrderRows, getPrintfulProductMappingRows } from "@/lib/printful/printful-mapping-service";
import { getPrintfulApiBaseUrl, getPrintfulSetupItems, isPrintfulConfigured } from "@/lib/printful/printful-service";

export default async function AdminPrintfulPage() {
  const configured = isPrintfulConfigured();
  const [mappingRows, orderRows] = await Promise.all([getPrintfulProductMappingRows(), getPrintfulOrderRows()]);
  const mappedCount = mappingRows.filter((row) => row.status === "mapped").length;
  const failedOrders = orderRows.filter((row) => row.status === "failed").length;

  return (
    <AdminShell requiredPermission="canManagePrintful">
      <div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">Printful</p>
            <h1 className="mt-3 text-4xl font-semibold">Printful fulfillment</h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-black/60">
              Paid print-on-demand orders should be submitted only after verified payment, product mapping, and idempotency checks. This page keeps the integration honest while credentials are being configured.
            </p>
          </div>
          <StatusBadge tone={configured ? "good" : "warn"}>{configured ? "Ready for service wiring" : "Setup required"}</StatusBadge>
        </div>

        <div className="mt-8">
          <SetupPanel title="Printful setup" description="No customer flow breaks when Printful is not configured. Admins see setup status and paid orders can remain in manual fulfillment review." items={getPrintfulSetupItems()} />
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-4">
          {[
            ["Mapped products", mappedCount],
            ["Needs mapping", mappingRows.length - mappedCount],
            ["Printful orders", orderRows.length],
            ["Failed orders", failedOrders],
          ].map(([label, value]) => (
            <div key={label} className="rounded-lg border border-black/10 bg-white p-4">
              <p className="text-sm text-black/55">{label}</p>
              <p className="mt-2 text-3xl font-semibold">{value}</p>
            </div>
          ))}
        </div>

        <section className="mt-8 rounded-lg border border-black/10 bg-white p-5">
          <h2 className="text-2xl font-semibold">Operational policy</h2>
          <div className="mt-4 grid gap-3 text-sm leading-6 text-black/62">
            {[
              ["API base URL", getPrintfulApiBaseUrl()],
              ["Order submission", "Runs after Stripe payment verification, not from client-side checkout state."],
              ["Retry policy", "Uses an idempotency key tied to the order ID."],
              ["Product mapping", "Unmapped products remain in fulfillment review until SKU or variant data is mapped."],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between gap-3 rounded-md bg-black/[0.03] p-3">
                <span>
                  <strong>{label}:</strong> {value}
                </span>
                <EditRowLink href={`/admin/printful?edit=${encodeURIComponent(label.toLowerCase().replaceAll(" ", "-"))}`} />
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 grid gap-4 lg:grid-cols-2">
          <a href="/admin/printful/products" className="rounded-lg border border-black/10 bg-white p-5 transition hover:border-black/25">
            <h2 className="text-2xl font-semibold">Product mapping</h2>
            <p className="mt-2 text-sm leading-6 text-black/60">Review local products marked for Printful and confirm every variant has a catalog or sync variant ID.</p>
          </a>
          <a href="/admin/printful/orders" className="rounded-lg border border-black/10 bg-white p-5 transition hover:border-black/25">
            <h2 className="text-2xl font-semibold">Fulfillment orders</h2>
            <p className="mt-2 text-sm leading-6 text-black/60">Refresh, retry, and inspect Printful submissions created from verified paid orders.</p>
          </a>
        </section>
      </div>
    </AdminShell>
  );
}

