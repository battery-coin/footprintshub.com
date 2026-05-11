import { AdminShell } from "@/components/admin/admin-shell";

export default function AdminReturnsPage() {
  return (
    <AdminShell requiredPermission="canManageRefunds">
      <h1 className="text-3xl font-semibold">Returns</h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-black/60">
        Review return requests, approve or reject actions, and connect approved returns to refunds, replacements, or
        store credit.
      </p>
    </AdminShell>
  );
}

