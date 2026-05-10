import { AffiliateAdminPage } from "@/components/admin/affiliate-admin-page";
import { formatMoney } from "@/lib/catalog/products";
import { demoCommissions } from "@/lib/affiliate/demo-data";

export default function AdminAffiliateCommissionsPage() {
  return (
    <AffiliateAdminPage title="Commission ledger">
      <div className="overflow-hidden rounded-lg border border-black/10 bg-white">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b border-black/10 bg-black/[0.03]">
            <tr>
              {["Date", "Type", "Order", "Level", "Amount", "Status"].map((heading) => (
                <th key={heading} className="px-4 py-3">{heading}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {demoCommissions.map((commission) => (
              <tr key={commission.id} className="border-b border-black/5 last:border-0">
                <td className="px-4 py-3">{commission.date}</td>
                <td className="px-4 py-3">{commission.type.replaceAll("_", " ")}</td>
                <td className="px-4 py-3">{commission.order}</td>
                <td className="px-4 py-3">{commission.levelDepth}</td>
                <td className="px-4 py-3">{formatMoney(commission.amountCents)}</td>
                <td className="px-4 py-3">{commission.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AffiliateAdminPage>
  );
}
