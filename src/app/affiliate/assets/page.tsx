import { AffiliateShell } from "@/components/affiliate/affiliate-shell";
import { demoMarketingAssets, getDemoReferralLink } from "@/lib/affiliate/demo-data";

export default function AffiliateAssetsPage() {
  return (
    <AffiliateShell>
      <h1 className="text-3xl font-semibold">Marketing assets</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {demoMarketingAssets.map((asset) => (
          <div key={asset.id} className="rounded-lg border border-black/10 bg-white p-5">
            <p className="font-semibold">{asset.title}</p>
            <p className="mt-1 text-sm text-black/55">{asset.type}</p>
            <code className="mt-4 block break-all rounded bg-black/[0.03] p-3 text-xs">
              {`<a href="${getDemoReferralLink(asset.targetUrl)}">Shop ${asset.title}</a>`}
            </code>
          </div>
        ))}
      </div>
    </AffiliateShell>
  );
}
