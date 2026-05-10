import { AffiliateAdminPage } from "@/components/admin/affiliate-admin-page";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AdminAffiliateRulesPage() {
  return (
    <AffiliateAdminPage title="Commission rules">
      <form className="grid max-w-2xl gap-4 rounded-lg border border-black/10 bg-white p-5">
        <Input placeholder="Scope, e.g. affiliate_product" />
        <Input placeholder="Percentage bps, e.g. 1000 for 10%" type="number" />
        <Input placeholder="Fixed cents, optional" type="number" />
        <Button type="button">Save rule placeholder</Button>
      </form>
    </AffiliateAdminPage>
  );
}
