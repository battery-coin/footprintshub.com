import { AffiliateShell } from "@/components/affiliate/affiliate-shell";
import { getDemoReferralLink } from "@/lib/affiliate/demo-data";

const snippets = [
  "I may earn a commission from qualified purchases made through my link.",
  "FootprintsHub commissions are purchase-based and subject to approval, refund reversal, and program rules.",
  "Use my link for supporter bundles, collectibles, and creator-shop drops.",
];

export default function AffiliateResourcesPage() {
  return (
    <AffiliateShell>
      <h1 className="text-3xl font-semibold">Affiliate resources</h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-black/60">
        Share links, disclosure copy, and product banners for purchase-based ambassador campaigns. Keep disclosure visible
        anywhere you promote your link.
      </p>

      <div className="mt-6 rounded-lg border border-black/10 bg-white p-5">
        <p className="text-sm text-black/55">General referral link</p>
        <p className="mt-2 break-all rounded-md bg-black/[0.03] p-3 font-mono text-sm">{getDemoReferralLink("/")}</p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {snippets.map((snippet) => (
          <div key={snippet} className="rounded-lg border border-black/10 bg-white p-4">
            <p className="text-sm leading-6">{snippet}</p>
          </div>
        ))}
      </div>
    </AffiliateShell>
  );
}
