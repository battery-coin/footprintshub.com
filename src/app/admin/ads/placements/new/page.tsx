import { AdminShell } from "@/components/admin/admin-shell";
import { AdPlacementForm } from "@/components/admin/ads/AdPlacementForm";

export default function AdminNewAdPlacementPage() {
  return (
    <AdminShell requiredPermission="canManageAds">
      <div className="grid gap-5">
        <h1 className="text-3xl font-semibold">New ad placement</h1>
        <AdPlacementForm />
      </div>
    </AdminShell>
  );
}
