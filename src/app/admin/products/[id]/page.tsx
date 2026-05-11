import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { ProductEditor } from "@/components/admin/products/ProductEditor";
import { getProductForEditor } from "@/lib/products/product-service";

export default async function AdminProductEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductForEditor(id);

  if (!product) {
    notFound();
  }

  return (
    <AdminShell>
      <ProductEditor mode="edit" product={product} />
    </AdminShell>
  );
}
