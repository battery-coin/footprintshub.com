import { AdminShell } from "@/components/admin/admin-shell";

export default function AdminPromotionsPage() {
  return (
    <AdminShell>
      <div className="grid gap-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-black/45">Revenue</p>
          <h1 className="mt-2 text-3xl font-semibold">Promotions</h1>
          <p className="mt-2 max-w-2xl text-sm text-black/60">
            Promotions are the Medusa-style wrapper around coupons, automatic discounts, campaign pricing, free shipping,
            and future buy-X-get-Y rules.
          </p>
        </div>
        <div className="rounded-lg border border-black/10 bg-white p-5">
          <h2 className="font-semibold">Promotion engine status</h2>
          <div className="mt-4 grid gap-3 text-sm md:grid-cols-3">
            <span className="rounded-md bg-black/[0.04] p-3">Coupon rules: scaffolded</span>
            <span className="rounded-md bg-black/[0.04] p-3">Automatic rules: scaffolded</span>
            <span className="rounded-md bg-black/[0.04] p-3">Affiliate coupons: mapped</span>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
