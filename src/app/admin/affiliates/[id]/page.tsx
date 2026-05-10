import { AffiliateAdminPage } from "@/components/admin/affiliate-admin-page";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { demoAffiliate } from "@/lib/affiliate/demo-data";

export default async function AdminAffiliateDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <AffiliateAdminPage title={`Affiliate ${id}`}>
      <form className="grid max-w-3xl gap-4 rounded-lg border border-black/10 bg-white p-5">
        <Input defaultValue={demoAffiliate.name} />
        <Input defaultValue={demoAffiliate.email} />
        <Input defaultValue={demoAffiliate.referralCode} />
        <Textarea defaultValue="Admin notes and fraud review trail." />
        <div className="flex flex-wrap gap-3">
          <Button type="button">Approve</Button>
          <Button type="button" variant="secondary">Reject</Button>
          <Button type="button" variant="secondary">Suspend</Button>
          <Button type="button" variant="ghost">Reactivate</Button>
        </div>
      </form>
    </AffiliateAdminPage>
  );
}
