import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { Input, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getAllProductsForAdmin } from "@/lib/catalog/products";

export default async function AdminProductEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = (await getAllProductsForAdmin()).find((item) => item.id === id);

  if (!product) {
    notFound();
  }

  return (
    <AdminShell>
      <h1 className="text-3xl font-semibold">Edit product</h1>
      <form className="mt-6 grid max-w-3xl gap-4 rounded-lg border border-black/10 bg-white p-5">
        <Input name="title" defaultValue={product.title} />
        <Input name="slug" defaultValue={product.slug} />
        <Textarea name="description" defaultValue={product.description} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Input name="priceCents" type="number" defaultValue={product.priceCents} />
          <Input name="sku" defaultValue={product.sku} />
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button type="button" disabled title="Enable persistent product writes after Neon and admin auth are configured">
            Product write setup required
          </Button>
          <Button type="button" variant="secondary" disabled title="Enable persistent product writes after Neon and admin auth are configured">
            Archive after persistence setup
          </Button>
        </div>
      </form>
    </AdminShell>
  );
}
