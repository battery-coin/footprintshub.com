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
          <p className="text-sm leading-6 text-black/60">
            Coupon requests open after affiliate approval and discount rule verification.
          </p>
          <Input placeholder="Code" />
          <Button type="button" disabled title="Affiliate coupon requests require approved affiliate status and discount persistence">
            Coupon setup required
          </Button>
        </form>
        <form className="grid gap-4 rounded-lg border border-black/10 bg-white p-5">
          <h2 className="font-semibold">Wallet to store credit</h2>
          <p className="text-sm leading-6 text-black/60">
            Store credit conversion opens after wallet ledger, refund reversal, and owner approval rules are live.
          </p>
          <Input type="number" placeholder="Amount in cents" />
          <Button type="button" disabled title="Store credit conversion requires approved wallet ledger writes">
            Conversion setup required
          </Button>
        </form>
      </div>
    </AffiliateShell>
  );
}
