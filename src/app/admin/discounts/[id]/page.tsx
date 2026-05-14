import { AdminShell } from "@/components/admin/admin-shell";

export default async function AdminDiscountDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <AdminShell>
      <h1 className="text-3xl font-semibold">Discount {id}</h1>
      <div className="mt-6 rounded-lg border border-black/10 bg-white p-6">
        <p className="text-sm leading-6 text-black/60">
          Discount detail editing is prepared for usage limits, date windows, product/category restrictions, affiliate
          attribution, and one-coupon-per-cart rules.
        </p>
      </div>
    </AdminShell>
  );
}
