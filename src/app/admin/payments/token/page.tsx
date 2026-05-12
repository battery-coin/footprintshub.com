import { AdminShell } from "@/components/admin/admin-shell";

export default function AdminTokenPaymentsPage() {
  return (
    <AdminShell requiredPermission="canManageFunds">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">Payments</p>
        <h1 className="mt-3 text-4xl font-semibold">Token payment review</h1>
        <div className="mt-8 rounded-lg border border-black/10 bg-white p-5">
          <h2 className="text-xl font-semibold">Manual verification scaffold</h2>
          <p className="mt-2 text-sm leading-6 text-black/60">
            Pending Battery Coin utility token payments will appear here after token intents are enabled. Manual verification is owner-only and audit logged.
          </p>
        </div>
      </div>
    </AdminShell>
  );
}
