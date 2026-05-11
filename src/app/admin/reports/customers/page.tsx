import { AdminShell } from "@/components/admin/admin-shell";

export default function AdminCustomerReportsPage() {
  return (
    <AdminShell requiredPermission="canViewAnalytics">
      <h1 className="text-3xl font-semibold">Customer reports</h1>
      <p className="mt-3 text-sm text-black/60">Customer groups, store credit, loyalty, order history, and return activity.</p>
    </AdminShell>
  );
}

