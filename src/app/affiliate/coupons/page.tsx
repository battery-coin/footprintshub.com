import { AffiliateShell } from "@/components/affiliate/affiliate-shell";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AffiliateCouponsPage() {
  return (
    <AffiliateShell>
      <h1 className="text-3xl font-semibold">Coupons</h1>
      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <form className="grid gap-4 rounded-lg border border-black/10 bg-white p-5">
          <h2 className="font-semibold">Customer referral coupon</h2>
          <Input placeholder="Code" />
          <Button type="button">Request coupon placeholder</Button>
        </form>
        <form className="grid gap-4 rounded-lg border border-black/10 bg-white p-5">
          <h2 className="font-semibold">Wallet to store credit</h2>
          <Input type="number" placeholder="Amount in cents" />
          <Button type="button">Convert placeholder</Button>
        </form>
      </div>
    </AffiliateShell>
  );
}
