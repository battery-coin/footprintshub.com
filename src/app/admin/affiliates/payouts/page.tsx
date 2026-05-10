import { AffiliateAdminPage } from "@/components/admin/affiliate-admin-page";
import { Button } from "@/components/ui/button";
import { formatMoney } from "@/lib/catalog/products";
import { demoPayouts } from "@/lib/affiliate/demo-data";

export default function AdminAffiliatePayoutsPage() {
  return (
    <AffiliateAdminPage title="Payouts">
      <div className="grid gap-4">
        {demoPayouts.map((payout) => (
          <div key={payout.id} className="rounded-lg border border-black/10 bg-white p-5">
            <p className="font-semibold">{formatMoney(payout.amountCents)} requested</p>
            <p className="mt-1 text-sm text-black/55">{payout.method} · {payout.status}</p>
            <div className="mt-4 flex gap-3">
              <Button type="button">Approve</Button>
              <Button type="button" variant="secondary">Reject</Button>
              <Button type="button" variant="ghost">Mark paid</Button>
            </div>
          </div>
        ))}
      </div>
    </AffiliateAdminPage>
  );
}
