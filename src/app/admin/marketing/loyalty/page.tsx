import { AdminShell } from "@/components/admin/admin-shell";

export default function AdminLoyaltyPage() {
  return (
    <AdminShell>
      <h1 className="text-3xl font-semibold">Loyalty</h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-black/60">
        Track points in `LoyaltyPointLedger`; keep this separate from affiliate wallet balances and store credit.
      </p>
    </AdminShell>
  );
}
