import Link from "next/link";
import { AdminShell } from "@/components/admin/admin-shell";
import { ProductEditor } from "@/components/admin/products/ProductEditor";

export default function ProductApiImportPage() {
  return (
    <AdminShell requiredPermission="canManageProducts">
      <div className="mb-6">
        <Link href="/admin/products/import" className="text-sm font-medium underline">
          Back to import
        </Link>
      </div>
      <ProductEditor mode="create" />
    </AdminShell>
  );
}

