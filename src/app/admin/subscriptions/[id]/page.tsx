import { AdminShell } from "@/components/admin/admin-shell";

export default async function AdminSubscriptionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <AdminShell requiredPermission="canManageSubscriptions">
      <div className="grid gap-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-black/45">Subscription</p>
          <h1 className="text-3xl font-semibold">{id}</h1>
        </div>
        <section className="rounded-lg border border-black/10 bg-white p-6">
          <h2 className="font-semibold">Stripe lifecycle view</h2>
          <p className="mt-2 text-sm text-black/55">Subscription updates, cancellations, and access revocation are driven by verified Stripe webhook events.</p>
        </section>
      </div>
    </AdminShell>
  );
}
