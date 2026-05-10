import { AffiliateAdminPage } from "@/components/admin/affiliate-admin-page";

const ranks = [
  ["Bronze", "Direct only", "$0 monthly qualified sales"],
  ["Silver", "Levels 0-1", "$500 monthly qualified sales"],
  ["Gold", "Levels 0-3", "$1,500 monthly qualified sales"],
  ["Platinum", "Levels 0-5", "$5,000 monthly qualified sales"],
  ["Founder Ambassador", "Levels 0-7", "Manual or founder qualification"],
  ["Creator Partner", "Levels 0-7", "Manual creator-partner qualification"],
];

export default function AdminAffiliateRanksPage() {
  return (
    <AffiliateAdminPage title="Ranks">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {ranks.map(([rank, levels, criteria]) => (
          <div key={rank} className="rounded-lg border border-black/10 bg-white p-4">
            <p className="font-semibold">{rank}</p>
            <p className="mt-2 text-sm text-black/60">{levels}</p>
            <p className="mt-1 text-xs text-black/45">{criteria}</p>
          </div>
        ))}
      </div>
    </AffiliateAdminPage>
  );
}
