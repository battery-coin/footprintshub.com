import { AdminShell } from "@/components/admin/admin-shell";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AdminDiscountsPage() {
  return (
    <AdminShell requiredPermission="canManagePricing">
      <h1 className="text-3xl font-semibold">Discounts</h1>
      <form className="mt-6 grid max-w-xl gap-4 rounded-lg border border-black/10 bg-white p-5">
        <Input placeholder="Code" />
        <Input placeholder="Value" type="number" />
        <Button type="button">Create discount placeholder</Button>
      </form>
    </AdminShell>
  );
}

