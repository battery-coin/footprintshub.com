import { AdminShell } from "@/components/admin/admin-shell";

export default function AdminAdSettingsPage() {
  return (
    <AdminShell requiredPermission="canManageAds">
      <div className="grid gap-5">
        <h1 className="text-3xl font-semibold">Ad settings</h1>
        <section className="grid gap-4 rounded-lg border border-black/10 bg-white p-6">
          <label className="flex items-center justify-between gap-3 text-sm"><span>Require approval by default</span><input type="checkbox" defaultChecked /></label>
          <label className="flex items-center justify-between gap-3 text-sm"><span>Allow affiliate commissions on qualified ad purchases</span><input type="checkbox" defaultChecked /></label>
          <details className="rounded-md border border-black/10 p-4">
            <summary className="cursor-pointer font-medium">Advanced fraud controls</summary>
            <p className="mt-3 text-sm text-black/55">Click and impression fraud controls are planned for the next reporting pass.</p>
          </details>
        </section>
      </div>
    </AdminShell>
  );
}
