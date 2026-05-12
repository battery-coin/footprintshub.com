import { AdminShell } from "@/components/admin/admin-shell";

export default function AdminSubscriptionsPage() {
  return (
    <AdminShell requiredPermission="canManageSubscriptions">
      <div className="grid gap-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-black/45">Recurring commerce</p>
          <h1 className="text-3xl font-semibold">Subscriptions</h1>
          <p className="mt-2 text-black/60">View Stripe subscription state, customer access, trial windows, and entitlement status.</p>
        </div>
        <section className="rounded-lg border border-black/10 bg-white p-6">
          <h2 className="font-semibold">No subscriptions yet</h2>
          <p className="mt-2 text-sm text-black/55">Recurring product checkout will create subscription records after Stripe confirms payment.</p>
        </section>
      </div>
    </AdminShell>
  );
}
