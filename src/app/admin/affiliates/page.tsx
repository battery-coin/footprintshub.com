import Link from "next/link";
import { AffiliateAdminPage } from "@/components/admin/affiliate-admin-page";
import { EditRowLink } from "@/components/admin/edit-row-link";
import { demoAffiliate } from "@/lib/affiliate/demo-data";

export default function AdminAffiliatesPage() {
  return (
    <AffiliateAdminPage title="Affiliates">
      <div className="rounded-lg border border-black/10 bg-white p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <Link href={`/admin/affiliates/${demoAffiliate.id}`} className="text-lg font-semibold hover:underline">
              {demoAffiliate.name}
            </Link>
            <p className="mt-1 text-sm text-black/55">
              {demoAffiliate.email} - {demoAffiliate.status}
            </p>
          </div>
          <EditRowLink href={`/admin/affiliates/${demoAffiliate.id}`} />
        </div>
      </div>
    </AffiliateAdminPage>
  );
}

