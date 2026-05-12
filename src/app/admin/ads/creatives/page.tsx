import { AdminShell } from "@/components/admin/admin-shell";

export default function AdminAdCreativesPage() {
  return (
    <AdminShell requiredPermission="canApproveAdCreatives">
      <div className="grid gap-5">
        <h1 className="text-3xl font-semibold">Creative review</h1>
        <section className="rounded-lg border border-black/10 bg-white p-6">
          <p className="text-sm text-black/55">Creative submissions appear on campaign detail pages for approval, rejection, or change requests.</p>
        </section>
      </div>
    </AdminShell>
  );
}
