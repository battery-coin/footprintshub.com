import { AdminShell } from "@/components/admin/admin-shell";

export default function AdminShopsPage() {
  return (
    <AdminShell requiredPermission="canManageRoles">
      <h1 className="text-3xl font-semibold">Shops</h1>
      <div className="mt-6 rounded-lg border border-black/10 bg-white p-6">
        <p className="font-medium">FootprintsHub</p>
        <p className="mt-2 text-sm text-black/55">Flagship shop. Future creator shops resolve by host/subdomain.</p>
      </div>
    </AdminShell>
  );
}

