import { AdminShell } from "@/components/admin/admin-shell";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AdminNewDiscountPage() {
  return (
    <AdminShell requiredPermission="canManagePricing">
      <h1 className="text-3xl font-semibold">New discount</h1>
      <form className="mt-6 grid max-w-2xl gap-4 rounded-lg border border-black/10 bg-white p-5">
        <Input placeholder="Code" />
        <Input placeholder="Percent in basis points, fixed cents, or free shipping flag" />
        <Input placeholder="Minimum subtotal cents" type="number" />
        <Input placeholder="Product, category, collection, or affiliate restriction" />
        <Button type="button" disabled title="Enable persistent discount writes after Neon and admin auth are configured">
          Discount write setup required
        </Button>
      </form>
    </AdminShell>
  );
}

