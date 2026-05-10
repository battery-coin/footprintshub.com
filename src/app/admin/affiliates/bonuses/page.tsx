import { AffiliateAdminPage } from "@/components/admin/affiliate-admin-page";

export default function AdminAffiliateBonusesPage() {
  return (
    <AffiliateAdminPage title="Bonus rules">
      <div className="rounded-lg border border-black/10 bg-white p-5 text-sm leading-6 text-black/60">
        Signup, click, and sharing bonuses are tracked as optional store credit by default. Cash payout must remain disabled unless legally reviewed.
      </div>
    </AffiliateAdminPage>
  );
}
