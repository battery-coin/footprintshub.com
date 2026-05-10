import { AffiliateAdminPage } from "@/components/admin/affiliate-admin-page";
import { defaultSevenLevelPlan } from "@/lib/affiliate/demo-data";

export default function AdminAffiliateLevelsPage() {
  return (
    <AffiliateAdminPage title="7-level ambassador settings">
      <div className="grid gap-3">
        {defaultSevenLevelPlan.map((level) => (
          <div key={level.depth} className="grid gap-2 rounded-lg border border-black/10 bg-white p-4 sm:grid-cols-[1fr_160px_160px]">
            <span>{level.label}</span>
            <span>{level.rate}</span>
            <span>enabled by admin</span>
          </div>
        ))}
      </div>
    </AffiliateAdminPage>
  );
}
