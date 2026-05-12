import { AdminShell } from "@/components/admin/admin-shell";

export default function AdminServicesPage() {
  return (
    <AdminShell requiredPermission="canManageFulfillment">
      <div className="grid gap-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-black/45">Service fulfillment</p>
          <h1 className="text-3xl font-semibold">Services</h1>
          <p className="mt-2 text-black/60">Track service orders, briefs, scheduling, delivery, and completion status.</p>
        </div>
        <section className="rounded-lg border border-black/10 bg-white p-6">
          <h2 className="font-semibold">No service orders to review</h2>
          <p className="mt-2 text-sm text-black/55">Paid service products will create service orders automatically.</p>
        </section>
      </div>
    </AdminShell>
  );
}
