import { AdminShell } from "@/components/admin/admin-shell";

export default function AdminBannersPage() {
  return (
    <AdminShell requiredPermission="canManageAds">
      <h1 className="text-3xl font-semibold">Banners</h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-black/60">
        Manage shop-scoped placements for hero banners, campaign banners, creator-shop promos, and product launch
        artwork.
      </p>
    </AdminShell>
  );
}

