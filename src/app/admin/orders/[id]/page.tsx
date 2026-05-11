import { AdminShell } from "@/components/admin/admin-shell";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <AdminShell requiredPermission="canViewOrders">
      <h1 className="text-3xl font-semibold">Order {id}</h1>
      <div className="mt-6 rounded-lg border border-black/10 bg-white p-6">
        <p className="text-sm leading-6 text-black/60">
          Order detail view scaffold. Connect Neon order reads after checkout persistence is enabled.
        </p>
      </div>
    </AdminShell>
  );
}

