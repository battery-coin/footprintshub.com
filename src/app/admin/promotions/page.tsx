import { AdminShell } from "@/components/admin/admin-shell";
import { EditRowLink } from "@/components/admin/edit-row-link";

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
            {["Coupon rules", "Automatic rules", "Affiliate coupons"].map((row) => (
              <div key={row} className="rounded-md bg-black/[0.04] p-3">
                <p>{row}: {row === "Affiliate coupons" ? "mapped" : "setup ready"}</p>
                <div className="mt-3">
                  <EditRowLink href={`/admin/promotions?edit=${encodeURIComponent(row.toLowerCase().replaceAll(" ", "-"))}`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
