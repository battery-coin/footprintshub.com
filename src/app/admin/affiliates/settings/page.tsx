import { AffiliateAdminPage } from "@/components/admin/affiliate-admin-page";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AdminAffiliateSettingsPage() {
  return (
    <AffiliateAdminPage title="Affiliate program settings">
      <form className="grid max-w-2xl gap-4 rounded-lg border border-black/10 bg-white p-5">
        <Input defaultValue="30" type="number" placeholder="Cookie days" />
        <Input defaultValue="7" type="number" placeholder="Max active levels" />
        <Input defaultValue="2000" type="number" placeholder="Max commission pool bps" />
        <Input defaultValue="5000" type="number" placeholder="Minimum payout cents" />
        <Button type="button">Save settings placeholder</Button>
      </form>
    </AffiliateAdminPage>
  );
}
