import { AffiliateAdminPage } from "@/components/admin/affiliate-admin-page";
import { demoMarketingAssets } from "@/lib/affiliate/demo-data";

export default function AdminAffiliateAssetsPage() {
  return (
    <AffiliateAdminPage title="Marketing assets">
      <div className="grid gap-4 sm:grid-cols-2">
        {demoMarketingAssets.map((asset) => (
          <div key={asset.id} className="rounded-lg border border-black/10 bg-white p-5">
            <p className="font-semibold">{asset.title}</p>
            <p className="mt-1 text-sm text-black/55">{asset.type}</p>
          </div>
        ))}
      </div>
    </AffiliateAdminPage>
  );
}
