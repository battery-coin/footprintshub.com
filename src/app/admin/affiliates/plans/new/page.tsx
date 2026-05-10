import { AffiliateAdminPage } from "@/components/admin/affiliate-admin-page";

const planTypes = [
  ["Flat Affiliate", "One direct purchase commission rate."],
  ["Product Specific", "Override rates by product."],
  ["Category / Collection", "Override rates by catalog grouping."],
  ["Campaign", "Deadline-based campaign commission."],
  ["Creator Shop", "Shop-specific default commission."],
  ["Rank Based", "Depth and bonuses unlock by rank."],
  ["Performance Tier", "Rate changes by monthly sales or orders."],
  ["7-Level Ambassador", "Direct plus capped ancestor purchase commissions."],
  ["Lifetime Attribution", "Future purchases credit the assigned affiliate."],
  ["Coupon Attribution", "Affiliate coupon can own attribution."],
  ["Hybrid", "Combine multiple models under platform caps."],
];

export default function NewAffiliatePlanPage() {
  return (
    <AffiliateAdminPage title="Create affiliate plan">
      <div className="rounded-lg border border-black/10 bg-white p-5">
        <p className="max-w-3xl text-sm leading-6 text-black/60">
          Choose a business model template, then configure rates, active depth, hold period, attribution, payout method,
          and fraud controls. Plan creation is wired through the schema and seed layer; the save action should connect to
          a protected admin API after authentication is finalized.
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {planTypes.map(([name, description]) => (
            <div key={name} className="rounded-lg border border-black/10 p-4">
              <p className="font-semibold">{name}</p>
              <p className="mt-2 text-sm leading-6 text-black/55">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </AffiliateAdminPage>
  );
}
