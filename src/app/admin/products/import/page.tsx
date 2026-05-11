import Link from "next/link";
import { AdminShell } from "@/components/admin/admin-shell";
import { ProductEditor } from "@/components/admin/products/ProductEditor";

export default function ProductImportPage() {
  return (
    <AdminShell requiredPermission="canManageProducts">
      <div className="mb-6">
        <Link href="/admin/products" className="text-sm font-medium underline">
          Back to products
        </Link>
      </div>
      <ProductEditor mode="create" />
    </AdminShell>
  );
}

