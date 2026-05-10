import { AdminShell } from "@/components/admin/admin-shell";

export default function AdminGiftVouchersPage() {
  return (
    <AdminShell>
      <h1 className="text-3xl font-semibold">Gift vouchers</h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-black/60">
        Issue, inspect, and cancel voucher balances through the new `GiftVoucher` model. Redemption should flow through
        the server totals pipeline.
      </p>
    </AdminShell>
  );
}
