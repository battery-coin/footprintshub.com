import { AffiliateAdminPage } from "@/components/admin/affiliate-admin-page";
export default function AdminAffiliateSettingsPage() {
  return (
    <AffiliateAdminPage title="Affiliate program settings">
      <div className="grid max-w-4xl gap-4 rounded-lg border border-black/10 bg-white p-5 sm:grid-cols-2">
        {[
          ["Cookie window", "30 days"],
          ["Max active levels", "7"],
          ["Default commission pool", "20% of qualified product subtotal"],
          ["Payout hold", "14 days"],
          ["Cash payouts", "Disabled until compliance review"],
          ["Store credit payouts", "Enabled"],
          ["Own-referral blocking", "Enabled"],
          ["Default compression", "pay_zero"],
        ].map(([label, value]) => (
          <div key={label} className="rounded-md bg-black/[0.03] p-4">
            <p className="text-xs text-black/55">{label}</p>
            <p className="mt-1 font-semibold">{value}</p>
          </div>
        ))}
      </div>
    </AffiliateAdminPage>
  );
}
