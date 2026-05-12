import Link from "next/link";
import { AdminShell } from "@/components/admin/admin-shell";

export default function AdminAdPackagesPage() {
  return (
    <AdminShell requiredPermission="canManageAds">
      <div className="grid gap-5">
        <div>
          <h1 className="text-3xl font-semibold">Ad packages</h1>
          <p className="mt-2 text-black/60">Ad packages are products with ad-specific type and metadata.</p>
        </div>
        <section className="rounded-lg border border-black/10 bg-white p-6">
          <Link href="/admin/products/new" className="inline-flex rounded-md bg-black px-4 py-2 text-sm font-medium text-white">Create ad product</Link>
        </section>
      </div>
    </AdminShell>
  );
}
