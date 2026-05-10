import { AffiliateShell } from "@/components/affiliate/affiliate-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatMoney } from "@/lib/catalog/products";
import { demoPayouts } from "@/lib/affiliate/demo-data";

export default function AffiliatePayoutsPage() {
  return (
    <AffiliateShell>
      <h1 className="text-3xl font-semibold">Payouts</h1>
      <form className="mt-6 grid max-w-xl gap-4 rounded-lg border border-black/10 bg-white p-5">
        <Input type="number" placeholder="Amount in cents" />
        <Input placeholder="Payout note" />
        <Button type="button">Request payout placeholder</Button>
      </form>
      <div className="mt-6 grid gap-4">
        {demoPayouts.map((payout) => (
          <div key={payout.id} className="rounded-lg border border-black/10 bg-white p-5">
            <div className="flex flex-wrap justify-between gap-3">
              <p className="font-medium">{formatMoney(payout.amountCents)}</p>
              <p className="text-sm text-black/55">{payout.status}</p>
            </div>
            <p className="mt-2 text-sm text-black/55">Fee {formatMoney(payout.feeCents)} via {payout.method}</p>
          </div>
        ))}
      </div>
    </AffiliateShell>
  );
}
