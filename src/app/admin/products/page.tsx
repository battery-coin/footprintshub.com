import Link from "next/link";
import { AdminShell } from "@/components/admin/admin-shell";
import { EditRowLink } from "@/components/admin/edit-row-link";
import { ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatMoney, getAllProductsForAdmin } from "@/lib/catalog/products";

export default async function AdminProductsPage() {
  const products = await getAllProductsForAdmin();

  return (
    <AdminShell>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Products</h1>
          <p className="mt-2 text-sm text-black/55">Seed products display until Neon is connected.</p>
        </div>
        <ButtonLink href="/admin/products/new">New product</ButtonLink>
      </div>
      <div className="mt-6 overflow-hidden rounded-lg border border-black/10 bg-white">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b border-black/10 bg-black/[0.03]">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Franchise</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Price</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-black/5 last:border-0">
                <td className="px-4 py-3">
                  <Link href={`/admin/products/${product.id}`} className="font-medium hover:underline">
                    {product.title}
                  </Link>
                  <p className="text-xs text-black/45">{product.slug}</p>
                </td>
                <td className="px-4 py-3">{product.franchise.replaceAll("_", " ")}</td>
                <td className="px-4 py-3">{product.productType.replaceAll("_", " ")}</td>
                <td className="px-4 py-3">
                  <Badge>{product.status}</Badge>
                </td>
                <td className="px-4 py-3 text-right">{formatMoney(product.priceCents, product.currency)}</td>
                <td className="px-4 py-3 text-right">
                  <EditRowLink href={`/admin/products/${product.id}`} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
