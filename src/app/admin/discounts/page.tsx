import { AdminShell } from "@/components/admin/admin-shell";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AdminDiscountsPage() {
  return (
    <AdminShell>
      <h1 className="text-3xl font-semibold">Discounts</h1>
      <form className="mt-6 grid max-w-xl gap-4 rounded-lg border border-black/10 bg-white p-5">
        <p className="text-sm leading-6 text-black/60">
          Discount creation is ready for owner review. Enable persistent writes after admin auth, promotion rules, and
          refund reversal behavior are confirmed.
        </p>
        <Input placeholder="Code" />
        <Input placeholder="Value" type="number" />
        <Button type="button" disabled title="Enable persistent discount writes after admin auth and Neon validation are complete">
          Discount setup required
        </Button>
      </form>
    </AdminShell>
  );
}
