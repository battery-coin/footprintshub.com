import { AdminShell } from "@/components/admin/admin-shell";

export default function AdminInventoryPage() {
  return (
    <AdminShell>
      <h1 className="text-3xl font-semibold">Inventory</h1>
      <div className="mt-6 rounded-lg border border-black/10 bg-white p-6">
        <p className="text-sm leading-6 text-black/60">
          Inventory now has a ledger model for reservations, deductions, releases, restocks, refunds, and manual adjustments.
          Paid Stripe webhooks deduct stock once using idempotency keys.
        </p>
      </div>
    </AdminShell>
  );
}
