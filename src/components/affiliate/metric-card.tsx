import { formatMoney } from "@/lib/catalog/products";

export function MetricCard({
  label,
  value,
  cents,
}: {
  label: string;
  value?: string | number;
  cents?: number;
}) {
  return (
    <div className="rounded-lg border border-black/10 bg-white p-5">
      <p className="text-sm text-black/55">{label}</p>
      <p className="mt-2 text-2xl font-semibold">{cents !== undefined ? formatMoney(cents) : value}</p>
    </div>
  );
}
