import { AdminShell } from "@/components/admin/admin-shell";
import { ProductEditor } from "@/components/admin/products/ProductEditor";

export default function NewProductPage() {
  return (
    <AdminShell>
      <ProductEditor mode="create" />
    </AdminShell>
  );
}
