import { AdminShell } from "@/components/admin/admin-shell";
import { MetricCard } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { getAllProductsForAdmin } from "@/lib/catalog/products";

export default async function AdminPage() {
  const products = await getAllProductsForAdmin();
  const activeCount = products.filter((product) => product.status === "active").length;
  const lowInventory = products.filter((product) => product.trackInventory && product.inventoryQuantity <= (product.lowStockThreshold ?? 5));
  const setupItems = [
    { label: "Database", ready: Boolean(process.env.DATABASE_URL) },
    { label: "Stripe", ready: Boolean(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_WEBHOOK_SECRET) },
    { label: "Admin secret", ready: Boolean(process.env.ADMIN_SECRET) },
    { label: "Printful", ready: Boolean(process.env.PRINTFUL_API_KEY && process.env.PRINTFUL_STORE_ID) },
    { label: "Site URL", ready: Boolean(process.env.NEXT_PUBLIC_SITE_URL) },
  ];

  return (
    <AdminShell>
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">Commerce admin</p>
        <h1 className="mt-3 text-4xl font-semibold">FootprintsHub dashboard</h1>
        {!process.env.ADMIN_SECRET ? (
          <div className="mt-6 rounded-lg border border-[var(--accent)]/25 bg-white p-4 text-sm leading-6 text-black/65">
            Set `ADMIN_SECRET` before exposing admin routes outside local development.
          </div>
        ) : null}

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard label="Products" value={products.length.toString()} detail={`${activeCount} active in catalog`} />
          <MetricCard label="Orders" value="0" detail="Paid order persistence appears after Stripe webhooks and DATABASE_URL are configured." />
          <MetricCard label="Refunds" value="0" detail="Refund review is prepared for Stripe, inventory, and affiliate reversal." />
          <MetricCard label="Affiliate liability" value="$0.00" detail="Ledger-based commissions are created after verified payment." />
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-lg border border-black/10 bg-white p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold">Needs attention</h2>
                <p className="mt-2 text-sm leading-6 text-black/60">Operational checks that should be clean before launch.</p>
              </div>
              <StatusBadge tone={lowInventory.length ? "warn" : "good"}>{lowInventory.length ? "Review" : "Clear"}</StatusBadge>
            </div>
            <div className="mt-5 grid gap-3">
              <AttentionRow label="Failed webhooks" value="0" status="Monitor `/admin/events` after Stripe is connected." />
              <AttentionRow label="Pending affiliate applications" value="0" status="Applications appear after DATABASE_URL is configured." />
              <AttentionRow label="Low inventory products" value={lowInventory.length.toString()} status="Inventory ledger is ready for paid-order deduction." />
              <AttentionRow label="Printful setup" value={process.env.PRINTFUL_API_KEY ? "Ready" : "Setup"} status="Configure Printful before automatic production submission." />
            </div>
          </section>

          <section className="rounded-lg border border-black/10 bg-white p-5">
            <h2 className="text-2xl font-semibold">Smart setup checklist</h2>
            <div className="mt-5 grid gap-3">
              {setupItems.map((item) => (
                <div key={item.label} className="flex items-center justify-between rounded-md bg-black/[0.03] p-3">
                  <span className="text-sm font-medium">{item.label}</span>
                  <StatusBadge tone={item.ready ? "good" : "warn"}>{item.ready ? "Ready" : "Configure"}</StatusBadge>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </AdminShell>
  );
}

function AttentionRow({ label, value, status }: { label: string; value: string; status: string }) {
  return (
    <div className="grid gap-2 rounded-md bg-black/[0.03] p-4 sm:grid-cols-[120px_1fr] sm:items-center">
      <p className="text-2xl font-semibold">{value}</p>
      <div>
        <p className="font-medium">{label}</p>
        <p className="mt-1 text-sm leading-6 text-black/58">{status}</p>
      </div>
    </div>
  );
}

