import { AffiliateAdminPage } from "@/components/admin/affiliate-admin-page";

export default function AdminAffiliateApplicationsPage() {
  return (
    <AffiliateAdminPage title="Affiliate applications">
      <div className="rounded-lg border border-black/10 bg-white p-5 text-sm text-black/60">
        Pending applications appear here for approve/reject review.
      </div>
    </AffiliateAdminPage>
  );
}
