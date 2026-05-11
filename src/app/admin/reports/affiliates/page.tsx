import { AdminShell } from "@/components/admin/admin-shell";

export default function AdminAffiliateReportsPage() {
  return (
    <AdminShell requiredPermission="canViewAffiliateReports">
      <h1 className="text-3xl font-semibold">Affiliate reports</h1>
      <p className="mt-3 text-sm text-black/60">Purchase commissions, level depth, reversals, payout liability, and creator-shop attribution.</p>
    </AdminShell>
  );
}

