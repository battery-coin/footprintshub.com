import { AffiliateAdminPage } from "@/components/admin/affiliate-admin-page";

const tiers = [
  ["Starter", "$0-$999 monthly qualified sales", "8% direct", "Level 0"],
  ["Builder", "$1,000-$4,999 monthly qualified sales", "10% direct", "Levels 0-3"],
  ["Leader", "$5,000+ monthly qualified sales", "12% direct", "Levels 0-7"],
];

export default function AffiliatePerformanceTiersPage() {
  return (
    <AffiliateAdminPage title="Performance tiers">
      <div className="rounded-lg border border-black/10 bg-white p-5">
        <h2 className="text-xl font-semibold">Monthly performance bands</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-black/60">
          Tiers can raise direct commission and unlock additional paid levels based on qualified sales or order count.
          Recruitment alone is never a commissionable event.
        </p>
        <div className="mt-5 grid gap-3">
          {tiers.map(([name, threshold, commission, depth]) => (
            <div key={name} className="grid gap-2 rounded-lg border border-black/10 p-4 sm:grid-cols-[160px_1fr_140px_140px]">
              <span className="font-semibold">{name}</span>
              <span>{threshold}</span>
              <span>{commission}</span>
              <span>{depth}</span>
            </div>
          ))}
        </div>
      </div>
    </AffiliateAdminPage>
  );
}
