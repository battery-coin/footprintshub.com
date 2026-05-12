import Link from "next/link";
import { AdminShell } from "@/components/admin/admin-shell";

export default async function ProductSubscriptionsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <AdminShell requiredPermission="canManageSubscriptions">
      <div className="grid gap-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-black/45">Product subscriptions</p>
          <h1 className="text-3xl font-semibold">Subscription settings</h1>
          <p className="mt-2 text-black/60">Product ID: {id}</p>
        </div>
        <section className="rounded-lg border border-black/10 bg-white p-6">
          <h2 className="font-semibold">Configure in the product editor</h2>
          <p className="mt-2 text-sm text-black/55">Open the product editor and choose Subscription or Membership to set recurring interval, trial days, and Stripe price mapping.</p>
          <Link className="mt-4 inline-flex rounded-md bg-black px-4 py-2 text-sm font-medium text-white" href={`/admin/products/${id}`}>
            Edit product
          </Link>
        </section>
      </div>
    </AdminShell>
  );
}
