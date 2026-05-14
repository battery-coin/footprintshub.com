import { AffiliateShell } from "@/components/affiliate/affiliate-shell";
import { Input, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AffiliateSettingsPage() {
  return (
    <AffiliateShell>
      <h1 className="text-3xl font-semibold">Settings</h1>
      <form className="mt-6 grid max-w-2xl gap-4 rounded-lg border border-black/10 bg-white p-5">
        <p className="text-sm leading-6 text-black/60">
          Profile and payout preferences are prepared for the affiliate account phase. Payout details should be encrypted
          and reviewed before production writes are enabled.
        </p>
        <Input placeholder="Display name" defaultValue="Founder Ambassador" />
        <Input placeholder="Payout method" defaultValue="manual bank" />
        <Textarea placeholder="Payout details, encrypted at rest before production use" />
        <Button type="button" disabled title="Enable saved affiliate settings after customer authentication is connected">
          Settings setup required
        </Button>
      </form>
    </AffiliateShell>
  );
}
