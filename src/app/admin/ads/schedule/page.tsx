import { AdminShell } from "@/components/admin/admin-shell";

export default function AdminAdSchedulePage() {
  return (
    <AdminShell requiredPermission="canManageAds">
      <div className="grid gap-5">
        <h1 className="text-3xl font-semibold">Ad schedule</h1>
        <section className="rounded-lg border border-black/10 bg-white p-6">
          <p className="text-sm text-black/55">Use schedule slots to reserve and publish approved campaigns by placement and date range.</p>
        </section>
      </div>
    </AdminShell>
  );
}
