import { AffiliateAdminPage } from "@/components/admin/affiliate-admin-page";

export default function AdminAffiliateReportsPage() {
  return (
    <AffiliateAdminPage title="Affiliate reports">
      <div className="rounded-lg border border-black/10 bg-white p-5 text-sm text-black/60">
        Reports will include top affiliates, revenue by shop, revenue by creator, commission liability, payout liability, and fraud flags.
      </div>
    </AffiliateAdminPage>
  );
}
