import { AffiliateAdminPage } from "@/components/admin/affiliate-admin-page";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AdminAffiliateRulesPage() {
  return (
    <AffiliateAdminPage title="Commission rules">
      <form className="grid max-w-2xl gap-4 rounded-lg border border-black/10 bg-white p-5">
        <p className="text-sm leading-6 text-black/60">
          Commission rules must stay tied to qualified purchases. Enable writes after the owner confirms caps, refund
          reversal behavior, and product-type eligibility.
        </p>
        <Input placeholder="Scope, e.g. affiliate_product" />
        <Input placeholder="Percentage bps, e.g. 1000 for 10%" type="number" />
        <Input placeholder="Fixed cents, optional" type="number" />
        <Button type="button" disabled title="Use plan level editing for active plans; custom rule writes need owner auth hardening">
          Rule setup required
        </Button>
      </form>
    </AffiliateAdminPage>
  );
}
