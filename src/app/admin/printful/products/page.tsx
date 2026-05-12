import Link from "next/link";
import { AdminShell } from "@/components/admin/admin-shell";
import { StatusBadge } from "@/components/ui/status-badge";
import { getPrintfulProductMappingRows } from "@/lib/printful/printful-mapping-service";

const toneByStatus = {
  mapped: "good",
  partially_mapped: "warn",
  unmapped: "danger",
  invalid: "danger",
} as const;

export default async function AdminPrintfulProductsPage() {
  const rows = await getPrintfulProductMappingRows();

  return (
    <AdminShell requiredPermission="canManagePrintful">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">Printful</p>
        <h1 className="mt-3 text-4xl font-semibold">Product mapping</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-black/60">
          Products are submitted to Printful only after payment and only when each Printful item has a valid variant or sync variant mapping.
        </p>

        <div className="mt-8 overflow-x-auto rounded-lg border border-black/10 bg-white">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="bg-black/[0.03]">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">SKU</th>
                <th className="px-4 py-3">Printful product</th>
                <th className="px-4 py-3">Sync product</th>
                <th className="px-4 py-3">Variants</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-t border-black/5">
                  <td className="px-4 py-3 font-medium">{row.title}</td>
                  <td className="px-4 py-3 text-black/60">{row.sku ?? "none"}</td>
                  <td className="px-4 py-3 text-black/60">{row.printfulProductId ?? "not set"}</td>
                  <td className="px-4 py-3 text-black/60">{row.printfulSyncProductId ?? "not set"}</td>
                  <td className="px-4 py-3 text-black/60">{row.mappedVariantCount}/{row.variantCount}</td>
                  <td className="px-4 py-3"><StatusBadge tone={toneByStatus[row.status]}>{row.status.replace("_", " ")}</StatusBadge></td>
                  <td className="px-4 py-3"><Link className="text-sm font-medium underline" href={`/admin/products/${row.id}/printful`}>Edit mapping</Link></td>
                </tr>
              ))}
              {!rows.length ? (
                <tr>
                  <td className="px-4 py-8 text-center text-black/55" colSpan={7}>No products are marked for Printful yet.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  );
}
