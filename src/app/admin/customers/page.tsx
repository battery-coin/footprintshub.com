import { AdminShell } from "@/components/admin/admin-shell";

export default function AdminCustomersPage() {
  return (
    <AdminShell>
      <h1 className="text-3xl font-semibold">Customers</h1>
      <div className="mt-6 rounded-lg border border-black/10 bg-white p-6">
        <p className="text-sm text-black/60">Customer records will appear after checkout/webhook persistence is enabled.</p>
      </div>
    </AdminShell>
  );
}
