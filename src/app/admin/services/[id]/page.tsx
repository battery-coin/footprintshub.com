import { AdminShell } from "@/components/admin/admin-shell";

export default async function AdminServiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <AdminShell requiredPermission="canManageFulfillment">
      <div className="grid gap-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-black/45">Service order</p>
          <h1 className="text-3xl font-semibold">{id}</h1>
        </div>
        <section className="rounded-lg border border-black/10 bg-white p-6">
          <h2 className="font-semibold">Service workflow ready</h2>
          <p className="mt-2 text-sm text-black/55">Scheduling, notes, brief review, and delivery actions can be wired here as service volume grows.</p>
        </section>
      </div>
    </AdminShell>
  );
}
