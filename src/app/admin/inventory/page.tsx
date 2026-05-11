import { AdminShell } from "@/components/admin/admin-shell";
import { EditRowLink } from "@/components/admin/edit-row-link";

export default function AdminInventoryPage() {
  return (
    <AdminShell requiredPermission="canManageInventory">
      <h1 className="text-3xl font-semibold">Inventory</h1>
      <div className="mt-6 rounded-lg border border-black/10 bg-white p-6">
        <p className="text-sm leading-6 text-black/60">
          Inventory now has a ledger model for reservations, deductions, releases, restocks, refunds, and manual adjustments.
          Paid Stripe webhooks deduct stock once using idempotency keys.
        </p>
        <div className="mt-5 grid gap-3">
          {["Stock quantities", "Reservations", "Low-stock thresholds"].map((row) => (
            <div key={row} className="flex items-center justify-between rounded-md bg-black/[0.03] p-3">
              <span className="text-sm font-medium">{row}</span>
              <EditRowLink href={`/admin/inventory?edit=${encodeURIComponent(row.toLowerCase().replaceAll(" ", "-"))}`} />
            </div>
          ))}
        </div>
      </div>
    </AdminShell>
  );
}

