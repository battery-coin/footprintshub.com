import { AdminShell } from "@/components/admin/admin-shell";
import { getAllProductsForAdmin } from "@/lib/catalog/products";

export default async function AdminPage() {
  const products = await getAllProductsForAdmin();
  const activeCount = products.filter((product) => product.status === "active").length;

  return (
    <AdminShell>
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">Commerce admin</p>
        <h1 className="mt-3 text-4xl font-semibold">FootprintsHub dashboard</h1>
        {!process.env.ADMIN_SECRET ? (
          <div className="mt-6 rounded-lg border border-[var(--accent)]/25 bg-white p-4 text-sm leading-6 text-black/65">
            Set `ADMIN_SECRET` before exposing admin routes outside local development.
          </div>
        ) : null}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <Metric label="Products" value={products.length.toString()} />
          <Metric label="Active products" value={activeCount.toString()} />
          <Metric label="Orders" value="0" />
        </div>
      </div>
    </AdminShell>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-black/10 bg-white p-5">
      <p className="text-sm text-black/55">{label}</p>
      <p className="mt-2 text-3xl font-semibold">{value}</p>
    </div>
  );
}
