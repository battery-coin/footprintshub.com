import { AdminShell } from "@/components/admin/admin-shell";

export default function AdminAdReportsPage() {
  return (
    <AdminShell requiredPermission="canManageAds">
      <div className="grid gap-5">
        <h1 className="text-3xl font-semibold">Ad reports</h1>
        <section className="rounded-lg border border-black/10 bg-white p-6">
          <p className="text-sm text-black/55">Reports include ad revenue, status counts, clicks, CTR, refunds, and affiliate commissions on qualified ad purchases.</p>
        </section>
      </div>
    </AdminShell>
  );
}
