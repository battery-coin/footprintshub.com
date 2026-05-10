import { AdminShell } from "@/components/admin/admin-shell";

export default function AdminMarketingCouponsPage() {
  return (
    <AdminShell>
      <h1 className="text-3xl font-semibold">Marketing coupons</h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-black/60">
        Coupon administration remains backed by the existing discount system; this route groups it with the wider
        marketing workspace.
      </p>
    </AdminShell>
  );
}
