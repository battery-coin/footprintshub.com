import { AdminShell } from "@/components/admin/admin-shell";

export default function AdminProductReportsPage() {
  return (
    <AdminShell>
      <h1 className="text-3xl font-semibold">Product reports</h1>
      <p className="mt-3 text-sm text-black/60">Bestsellers, stock, reviews, returns, downloads, and creator-shop performance.</p>
    </AdminShell>
  );
}
