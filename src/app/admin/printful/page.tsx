import { AdminShell } from "@/components/admin/admin-shell";
import { EditRowLink } from "@/components/admin/edit-row-link";
import { SetupPanel } from "@/components/ui/setup-panel";
import { StatusBadge } from "@/components/ui/status-badge";
import { getPrintfulApiBaseUrl, getPrintfulSetupItems, isPrintfulConfigured } from "@/lib/printful/printful-service";

export default function AdminPrintfulPage() {
  const configured = isPrintfulConfigured();

  return (
    <AdminShell>
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
      </div>
    </AdminShell>
  );
}
