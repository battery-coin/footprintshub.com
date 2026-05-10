import { AdminShell } from "@/components/admin/admin-shell";
import { Input, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function NewProductPage() {
  return (
    <AdminShell>
      <h1 className="text-3xl font-semibold">New product</h1>
      <form className="mt-6 grid max-w-3xl gap-4 rounded-lg border border-black/10 bg-white p-5">
        <Input name="title" placeholder="Product title" />
        <Input name="slug" placeholder="product-slug" />
        <Textarea name="description" placeholder="Description" />
        <div className="grid gap-4 sm:grid-cols-2">
          <Input name="priceCents" type="number" placeholder="Price in cents" />
          <Input name="sku" placeholder="SKU" />
        </div>
        <p className="text-sm leading-6 text-black/55">
          This MVP form is ready for the `/api/admin/products` route. Connect `ADMIN_SECRET` and Neon before production writes.
        </p>
        <Button type="button">Create product placeholder</Button>
      </form>
    </AdminShell>
  );
}
