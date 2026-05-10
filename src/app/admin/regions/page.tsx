import { AdminShell } from "@/components/admin/admin-shell";
import { EditRowLink } from "@/components/admin/edit-row-link";

export default function AdminRegionsPage() {
  return (
    <AdminShell>
      <div className="grid gap-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-black/45">Markets</p>
          <h1 className="mt-2 text-3xl font-semibold">Regions</h1>
          <p className="mt-2 max-w-2xl text-sm text-black/60">
            The first market region is United States / USD. This keeps launch simple while leaving a clean place for
            country, tax, shipping, and payment availability rules later.
          </p>
        </div>
        <div className="rounded-lg border border-black/10 bg-white p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-semibold">United States</h2>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-black px-3 py-1 text-xs font-medium text-white">USD</span>
              <EditRowLink href="/admin/regions?edit=united-states" />
            </div>
          </div>
          <p className="mt-3 text-sm text-black/60">Tax-exclusive pricing, Stripe Checkout, flat shipping.</p>
        </div>
      </div>
    </AdminShell>
  );
}
