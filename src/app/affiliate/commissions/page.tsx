import { AffiliateShell } from "@/components/affiliate/affiliate-shell";
import { formatMoney } from "@/lib/catalog/products";
import { demoCommissions } from "@/lib/affiliate/demo-data";

export default function AffiliateCommissionsPage() {
  return (
    <AffiliateShell>
      <h1 className="text-3xl font-semibold">Commissions</h1>
      <Table
        headers={["Date", "Type", "Order", "Level", "Amount", "Status", "Reason"]}
        rows={demoCommissions.map((commission) => [
          commission.date,
          commission.type.replaceAll("_", " "),
          commission.order,
          commission.levelDepth.toString(),
          formatMoney(commission.amountCents),
          commission.status,
          commission.reason,
        ])}
      />
    </AffiliateShell>
  );
}

function Table({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="mt-6 overflow-hidden rounded-lg border border-black/10 bg-white">
      <table className="w-full min-w-[760px] text-left text-sm">
        <thead className="border-b border-black/10 bg-black/[0.03]">
          <tr>{headers.map((header) => <th key={header} className="px-4 py-3">{header}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.join("-")} className="border-b border-black/5 last:border-0">
              {row.map((cell) => <td key={cell} className="px-4 py-3">{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
