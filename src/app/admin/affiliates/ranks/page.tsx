import { AffiliateAdminPage } from "@/components/admin/affiliate-admin-page";

const ranks = ["Bronze", "Silver", "Gold", "Platinum", "Founder Ambassador", "Creator Partner"];

export default function AdminAffiliateRanksPage() {
  return (
    <AffiliateAdminPage title="Ranks">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {ranks.map((rank) => (
          <div key={rank} className="rounded-lg border border-black/10 bg-white p-4 font-medium">{rank}</div>
        ))}
      </div>
    </AffiliateAdminPage>
  );
}
