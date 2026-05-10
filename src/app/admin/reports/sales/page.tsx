import { AdminShell } from "@/components/admin/admin-shell";

export default function AdminSalesReportsPage() {
  return (
    <AdminShell>
      <h1 className="text-3xl font-semibold">Sales reports</h1>
      <p className="mt-3 text-sm text-black/60">Revenue, orders, refunds, shipping, tax, and payout liability reporting.</p>
    </AdminShell>
  );
}
