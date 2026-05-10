import { AffiliateAdminPage } from "@/components/admin/affiliate-admin-page";

export default function AdminAffiliateReferralsPage() {
  return (
    <AffiliateAdminPage title="Referral tracking">
      <div className="rounded-lg border border-black/10 bg-white p-5 text-sm text-black/60">
        Clicks, attribution records, coupon priority decisions, and suspicious activity flags appear here.
      </div>
    </AffiliateAdminPage>
  );
}
