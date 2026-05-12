import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { StatusBadge } from "@/components/ui/status-badge";
import { getPrisma, hasDatabaseUrl } from "@/lib/db/prisma";

export default async function AdminProductPrintfulPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = hasDatabaseUrl()
    ? await getPrisma().product.findUnique({
        where: { id },
        include: { variants: { orderBy: { sortOrder: "asc" } } },
      })
    : null;

  if (!product) notFound();

  const mappedVariants = product.variants.filter((variant) => variant.printfulVariantId || variant.printfulSyncVariantId).length;
  const productMapped = Boolean(product.printfulProductId || product.printfulSyncProductId || product.printfulTemplateId);

  return (
    <AdminShell requiredPermission="canManagePrintful">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">Printful</p>
        <h1 className="mt-3 text-4xl font-semibold">{product.title}</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-black/60">
          Edit this product in the main product editor to change Printful IDs. This view shows exactly what will be used by the paid-order handoff.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <StatusBadge tone={productMapped ? "good" : "warn"}>{productMapped ? "Product mapped" : "Product mapping missing"}</StatusBadge>
          <StatusBadge tone={mappedVariants === product.variants.length || !product.variants.length ? "good" : "warn"}>
            {mappedVariants}/{product.variants.length} variants mapped
          </StatusBadge>
          <Link className="rounded-md border border-black/10 px-3 py-2 text-sm font-medium" href={`/admin/products/${product.id}`}>Open product editor</Link>
        </div>

        <section className="mt-8 rounded-lg border border-black/10 bg-white p-5">
          <h2 className="text-2xl font-semibold">Product IDs</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <MappingValue label="Printful product ID" value={product.printfulProductId} />
            <MappingValue label="Printful sync product ID" value={product.printfulSyncProductId} />
            <MappingValue label="Printful template ID" value={product.printfulTemplateId} />
          </div>
        </section>

        <section className="mt-8 overflow-x-auto rounded-lg border border-black/10 bg-white">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-black/[0.03]">
              <tr>
                <th className="px-4 py-3">Variant</th>
                <th className="px-4 py-3">SKU</th>
                <th className="px-4 py-3">Printful variant</th>
                <th className="px-4 py-3">Sync variant</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {product.variants.map((variant) => {
                const mapped = Boolean(variant.printfulVariantId || variant.printfulSyncVariantId);
                return (
                  <tr key={variant.id} className="border-t border-black/5">
                    <td className="px-4 py-3 font-medium">{variant.title}</td>
                    <td className="px-4 py-3 text-black/60">{variant.sku ?? "none"}</td>
                    <td className="px-4 py-3 text-black/60">{variant.printfulVariantId ?? "not set"}</td>
                    <td className="px-4 py-3 text-black/60">{variant.printfulSyncVariantId ?? "not set"}</td>
                    <td className="px-4 py-3"><StatusBadge tone={mapped ? "good" : "danger"}>{mapped ? "mapped" : "missing"}</StatusBadge></td>
                  </tr>
                );
              })}
              {!product.variants.length ? (
                <tr>
                  <td className="px-4 py-8 text-center text-black/55" colSpan={5}>Single-SKU product. Product-level mapping will be used.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </section>
      </div>
    </AdminShell>
  );
}

function MappingValue({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="rounded-md bg-black/[0.03] p-3">
      <p className="text-xs uppercase tracking-[0.14em] text-black/45">{label}</p>
      <p className="mt-1 font-medium">{value || "not set"}</p>
    </div>
  );
}
